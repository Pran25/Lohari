import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export const useOfflineDetection = () => {
  const { logout, user } = useAuth()  // ✅ Get user instead of isAuthenticated
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  
  // ✅ Use ref to store logout function
  const logoutRef = useRef(logout)

  useEffect(() => {
    logoutRef.current = logout
  }, [logout])

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      console.log('🟢 User is online')
    }

    const handleOffline = () => {
      setIsOnline(false)
      console.log('🔴 User is offline')
      
      // ✅ Check if user is logged in
      if (user) {
        console.log('🔴 User logged in, calling logout...')
        logoutRef.current()
        alert('⚠️ You are offline. Please login again.')
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // ✅ Periodic check every 5 seconds
    const interval = setInterval(() => {
      if (!navigator.onLine && user) {
        console.log('🔴 Periodic check: Offline + logged in')
        setIsOnline(false)
        logoutRef.current()
        alert('⚠️ You are offline. Please login again.')
      }
    }, 5000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [user])  // ✅ Only depends on user

  return { isOnline }
}