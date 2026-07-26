import React, { useState, useEffect } from 'react'
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi'
import axios from '../../api/axios'
import toast from 'react-hot-toast'

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('📊 Fetching admin stats...')
      
      // ✅ Try single API call first
      try {
        const response = await axios.get('/admin/dashboard/summary')
        console.log('📊 Dashboard summary response:', response.data)
        
        const data = response.data || {}
        setStats({
          totalProducts: data.totalProducts || data.products || 0,
          totalOrders: data.totalOrders || data.orders || 0,
          totalUsers: data.totalUsers || data.users || 0,
          totalRevenue: data.totalRevenue || data.revenue || 0,
        })
        return // Success - exit function
      } catch (summaryError) {
        console.warn('⚠️ Dashboard summary failed, trying individual APIs...')
      }
      
      // ✅ Fallback: Individual APIs
      let productsCount = 0
      let ordersCount = 0
      let usersCount = 0
      let revenueTotal = 0

      try {
        const productsRes = await axios.get('/admin/products/count')
        productsCount = productsRes.data || 0
        console.log('✅ Products count:', productsCount)
      } catch (e) {
        console.warn('⚠️ Products count failed:', e.message)
      }

      try {
        const ordersRes = await axios.get('/admin/orders/count')
        ordersCount = ordersRes.data || 0
        console.log('✅ Orders count:', ordersCount)
      } catch (e) {
        console.warn('⚠️ Orders count failed:', e.message)
      }

      try {
        const usersRes = await axios.get('/admin/users/count')
        usersCount = usersRes.data || 0
        console.log('✅ Users count:', usersCount)
      } catch (e) {
        console.warn('⚠️ Users count failed:', e.message)
      }

      try {
        const revenueRes = await axios.get('/admin/revenue/total')
        revenueTotal = revenueRes.data || 0
        console.log('✅ Revenue total:', revenueTotal)
      } catch (e) {
        console.warn('⚠️ Revenue count failed:', e.message)
      }

      setStats({
        totalProducts: productsCount,
        totalOrders: ordersCount,
        totalUsers: usersCount,
        totalRevenue: revenueTotal,
      })

    } catch (error) {
      console.error('❌ Error fetching stats:', error)
      setError(error.message)
      toast.error('Failed to load dashboard stats')
    } finally {
      setLoading(false)
    }
  }

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