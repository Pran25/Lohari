import { useState, useEffect } from 'react'
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi'
import axios from '../../api/axios'
import toast from 'react-hot-toast'

const loadDashboardStats = async () => {
  try {
    const response = await axios.get('/admin/dashboard/summary')
    const data = response.data || {}
    return {
      totalProducts: data.totalProducts || data.products || 0,
      totalOrders: data.totalOrders || data.orders || 0,
      totalUsers: data.totalUsers || data.users || 0,
      totalRevenue: data.totalRevenue || data.revenue || 0,
    }
  } catch (error) {
    console.warn('⚠️ Dashboard summary failed, trying individual APIs:', error)
  }

  const endpoints = [
    '/admin/products/count',
    '/admin/orders/count',
    '/admin/users/count',
    '/admin/revenue/total',
  ]
  const results = await Promise.allSettled(endpoints.map((endpoint) => axios.get(endpoint)))
  const values = results.map((result, index) => {
    if (result.status === 'fulfilled') return result.value.data || 0
    console.warn(`⚠️ Dashboard metric ${endpoints[index]} failed:`, result.reason)
    return 0
  })

  return {
    totalProducts: values[0],
    totalOrders: values[1],
    totalUsers: values[2],
    totalRevenue: values[3],
  }
}

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStats = async () => {
    setLoading(true)
    setError(null)
    try {
      setStats(await loadDashboardStats())
    } catch (error) {
      console.error('❌ Error fetching stats:', error)
      setError(error.message)
      toast.error('Failed to load dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    loadDashboardStats()
      .then((loadedStats) => {
        if (active) setStats(loadedStats)
      })
      .catch((error) => {
        if (!active) return
        console.error('❌ Error fetching stats:', error)
        setError(error.message)
        toast.error('Failed to load dashboard stats')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const cards = [
    { title: 'Total Products', value: stats.totalProducts, icon: FiPackage, color: 'from-blue-500 to-blue-600' },
    { title: 'Total Orders', value: stats.totalOrders, icon: FiShoppingBag, color: 'from-purple-500 to-purple-600' },
    { title: 'Total Users', value: stats.totalUsers, icon: FiUsers, color: 'from-green-500 to-green-600' },
    { title: 'Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: FiDollarSign, color: 'from-secondary to-orange-500' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white/70">Loading dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-xl mb-4">⚠️ Failed to load dashboard</div>
        <p className="text-white/50">{error}</p>
        <button 
          onClick={fetchStats}
          className="btn-primary mt-4"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.title} className={`glass p-6 rounded-2xl bg-gradient-to-br ${card.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">{card.title}</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {card.value}
                </p>
              </div>
              <card.icon size={28} className="text-white/80" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard