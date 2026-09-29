import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiBell, FiX, FiCheck, FiPackage, FiDollarSign,
  FiInbox, FiAlertCircle, FiTrash2,
} from 'react-icons/fi'
import { getRecentOrders } from '../../api/notificationApi'

const STORAGE_KEY = 'lohari_seen_order_ids'
const NOTIF_KEY = 'lohari_notifications'
const POLL_INTERVAL = 30000 // 30 sec

function NotificationBell() {
  const [notifications, setNotifications] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // ============================================
  // LOAD FROM LOCALSTORAGE
  // ============================================
  useEffect(() => {
    try {
      const saved = localStorage.getItem(NOTIF_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Keep only last 50
        setNotifications(parsed.slice(0, 50))
      }
    } catch {
      // ignore
    }
  }, [])

  // ============================================
  // SAVE TO LOCALSTORAGE
  // ============================================
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications.slice(0, 50)))
    }
  }, [notifications])

  // ============================================
  // CLOSE ON OUTSIDE CLICK
  // ============================================
  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // ============================================
  // CHECK FOR NEW ORDERS (polling)
  // ============================================
  const checkForNewOrders = useCallback(async () => {
    try {
      const orders = await getRecentOrders(10)
      if (!orders || orders.length === 0) return

      // Get seen IDs
      let seenIds = []
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        seenIds = saved ? JSON.parse(saved) : []
      } catch {
        seenIds = []
      }

      const newNotifs = []
      const newSeenIds = [...seenIds]

      orders.forEach((order) => {
        const orderId = order.id
        if (!orderId) return

        // Skip if already seen
        if (seenIds.includes(orderId)) return

        // Create notification
        const isPaid = order.paymentStatus === 'PAID' || order.status === 'ADVANCE_PAID'

        newNotifs.push({
          id: `order-${orderId}-${Date.now()}`,
          orderId,
          type: isPaid ? 'payment' : 'order',
          title: isPaid ? `Payment received` : `New order #${order.orderNumber || orderId}`,
          message: isPaid
            ? `₹${(order.advanceAmount || 0).toLocaleString('en-IN')} from ${order.customerName || 'customer'}`
            : `${order.customerName || 'Customer'} ordered ${order.productName || 'a product'}`,
          amount: order.totalAmount,
          timestamp: new Date().toISOString(),
          read: false,
        })

        newSeenIds.push(orderId)
      })

      // Update seen IDs
      if (newSeenIds.length !== seenIds.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSeenIds.slice(-200)))
      }

      // Add new notifications
      if (newNotifs.length > 0) {
        setNotifications((prev) => [...newNotifs, ...prev].slice(0, 50))
      }
    } catch (err) {
      console.error('Notification check error:', err)
    }
  }, [])

  // ============================================
  // START POLLING
  // ============================================
  useEffect(() => {
    // Initial check after 2 sec
    const timeout = setTimeout(checkForNewOrders, 2000)

    // Poll every 30 sec
    const interval = setInterval(checkForNewOrders, POLL_INTERVAL)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [checkForNewOrders])

  // ============================================
  // HANDLERS
  // ============================================
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const clearAll = () => {
    setNotifications([])
    localStorage.removeItem(NOTIF_KEY)
  }

  const handleNotifClick = (notif) => {
    markAsRead(notif.id)
    setIsOpen(false)
    if (notif.orderId) {
      navigate(`/orders/${notif.orderId}`)
    }
  }

  // ============================================
  // FORMAT TIME
  // ============================================
  const formatTime = (isoStr) => {
    if (!isoStr) return ''
    const now = new Date()
    const then = new Date(isoStr)
    const diff = Math.floor((now - then) / 1000) // seconds

    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return then.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
  }

  // ============================================
  // ICON PER TYPE
  // ============================================
  const getIcon = (type) => {
    switch (type) {
      case 'payment':
        return <FiDollarSign size={14} />
      case 'order':
        return <FiPackage size={14} />
      default:
        return <FiAlertCircle size={14} />
    }
  }

  const getIconColor = (type, read) => {
    if (read) return 'text-slate-500 bg-white/[0.04] border-white/[0.08]'
    switch (type) {
      case 'payment':
        return 'text-emerald-400 bg-emerald-400/[0.12] border-emerald-400/25'
      case 'order':
        return 'text-cyan-400 bg-cyan-400/[0.12] border-cyan-400/25'
      default:
        return 'text-amber-400 bg-amber-400/[0.12] border-amber-400/25'
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* BELL BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl text-slate-300 border border-white/[0.08] bg-white/[0.02] hover:border-cyan-400/40 hover:text-white hover:bg-cyan-400/[0.06] transition-all"
        aria-label="Notifications"
      >
        <FiBell size={16} />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-br from-rose-500 to-rose-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center ring-2 ring-slate-950 shadow-[0_0_12px_-2px_rgba(244,63,94,0.7)] animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-[360px] max-w-[90vw] rounded-2xl overflow-hidden bg-slate-950/98 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7),0_0_40px_-10px_rgba(34,211,238,0.15)] z-50">

          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-gradient-to-r from-cyan-500/[0.06] to-indigo-500/[0.06]">
            <div>
              <h3 className="text-white text-sm font-bold">Notifications</h3>
              <p className="text-slate-400 text-[10px] uppercase tracking-wider">
                {unreadCount} unread
              </p>
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-1.5 rounded-lg text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/[0.08] transition-all"
                  title="Mark all as read"
                >
                  <FiCheck size={14} />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/[0.08] transition-all"
                  title="Clear all"
                >
                  <FiTrash2 size={14} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all"
              >
                <FiX size={14} />
              </button>
            </div>
          </div>

          {/* LIST */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-10 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                  <FiInbox className="text-slate-500" size={20} />
                </div>
                <p className="text-slate-400 text-sm font-medium">
                  No notifications yet
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  You'll see new orders here
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNotifClick(n)}
                  className={`w-full flex items-start gap-3 px-4 py-3 border-b border-white/[0.04] text-left transition-all hover:bg-white/[0.03] ${
                    !n.read ? 'bg-cyan-400/[0.03]' : ''
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${getIconColor(
                      n.type,
                      n.read
                    )}`}
                  >
                    {getIcon(n.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-[13px] font-semibold truncate">
                      {n.title}
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5 line-clamp-2">
                      {n.message}
                    </p>
                    <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-wider">
                      {formatTime(n.timestamp)}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-2 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* FOOTER */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-white/[0.06] bg-slate-950/50 text-center">
              <p className="text-slate-500 text-[10px] uppercase tracking-wider">
                Auto-refreshes every 30s
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationBell