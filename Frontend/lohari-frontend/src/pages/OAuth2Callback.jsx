import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

function OAuth2Callback() {

  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuth()

  useEffect(() => {

    const params = new URLSearchParams(location.search)

    const token = params.get('token')
    const refreshToken = params.get('refreshToken')
    const email = params.get('email')
    const name = params.get('name')

    if (!token) {
      toast.error('Login failed')
      navigate('/login', { replace: true })
      return
    }

    localStorage.setItem('accessToken', token)

    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    }

    const user = {
      email,
      fullName: name ? decodeURIComponent(name) : '',
      role: 'CUSTOMER'
    }

    localStorage.setItem('user', JSON.stringify(user))

    // ✅ Update React state immediately
    setUser(user)

    toast.success(`Welcome ${user.fullName}`)

    navigate('/', { replace: true })

  }, [location, navigate, setUser])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h2>Signing you in...</h2>
    </div>
  )
}

export default OAuth2Callback