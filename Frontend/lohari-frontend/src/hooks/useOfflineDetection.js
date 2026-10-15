import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export const useOfflineDetection = () => {
  const { logout, user } = useAuth()
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const logoutRef = useRef(logout)
  const logoutTriggered = useRef(false)

  useEffect(() => {
    logoutRef.current = logout
  }, [logout])

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      logoutTriggered.current = false
    }

    const handleOffline = () => {
      setIsOnline(false)
      if (!user || logoutTriggered.current) return

      logoutTriggered.current = true
      void logoutRef.current(true)
      toast.error('You are offline. You have been logged out.')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    if (!navigator.onLine) {
      handleOffline()
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [user])

  return { isOnline }
}