import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  login as loginAPI,
  register as registerAPI,
  getCurrentUser,
  logout as logoutAPI
} from '../api/auth'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {

  const navigate = useNavigate()

  // ✅ Load user from localStorage immediately
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [loading, setLoading] = useState(true)

  // ✅ Verify token on app startup
  useEffect(() => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      setLoading(false)
      return
    }

    getCurrentUser()
      .then((data) => {
        if (data.success) {
          const userData = {
            id: data.id,
            email: data.email,
            fullName: data.fullName,
            role: data.role || 'CUSTOMER',
            phone: data.phone || '',
            profilePicture: data.profilePicture || ''
          }
          setUser(userData)
          localStorage.setItem('user', JSON.stringify(userData))
        } else {
          throw new Error('Invalid user data')
        }
      })
      .catch(() => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // ==========================
  // LOGIN
  // ==========================
  const login = async (email, password) => {
    try {
      const response = await loginAPI({ email, password })
      console.log('🔐 Login Response:', response)

      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken)
        localStorage.setItem('refreshToken', response.refreshToken || '')

        const loggedInUser = {
          id: response.userId || response.id,
          email: response.email,
          fullName: response.fullName || 'User',
          role: response.role || 'CUSTOMER',
          phone: response.phone || ''
        }
        console.log('👤 User data being stored:', loggedInUser)

        localStorage.setItem('user', JSON.stringify(loggedInUser))
        setUser(loggedInUser)

        toast.success('Login successful!')
        return response
      }

    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.response?.data?.message || 'Login failed')
      throw error
    }
  }

  // ==========================
  // REGISTER
  // ==========================
  const register = async (userData) => {
    try {
      const response = await registerAPI(userData)
      toast.success('Registration successful! Please login.')
      return response
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
      throw error
    }
  }

  // ==========================
  // LOGOUT - FIXED
  // ==========================
  const logout = useCallback(async (skipToast = false) => {
    console.log('🔴 LOGOUT CALLED')

    try {
      // ✅ Only call API if online
      if (navigator.onLine) {
        await logoutAPI()
      }
    } catch (error) {
      console.log('Logout API error (ignored):', error.message)
    }

    // ✅ Clear localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    sessionStorage.clear()

    // ✅ Reset user state
    setUser(null)

    // ✅ Only show toast if not skipped (offline logout)
    if (!skipToast && navigator.onLine) {
      toast.success('Logged out successfully')
    }

    // ✅ Redirect to login
    navigate('/login')
  }, [navigate])

  const value = {
    user,
    setUser,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}