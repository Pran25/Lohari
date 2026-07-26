import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export const useOfflineDetection = () => {
  const { logout } = useAuth()
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      console.log('🟢 User is online')
    }

    const handleOffline = () => {
      setIsOnline(false)
      console.log('🔴 User is offline - Logging out...')
      
      // ✅ Auto logout when offline
      logout()
      
      // ✅ Show alert
      alert('⚠️ You are offline. Please check your internet connection and login again.')
    }

    // ✅ Add event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // ✅ Check periodically (every 10 seconds)
    const interval = setInterval(() => {
      if (!navigator.onLine && isOnline) {
        setIsOnline(false)
        logout()
        alert('⚠️ You are offline. Please check your internet connection and login again.')
      }
    }, 10000)

    // ✅ Cleanup
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [logout, isOnline])

  return { isOnline }
}