import React, { useState, useEffect } from 'react'
import axios from '../../api/axios'
import toast from 'react-hot-toast'
import Loading from '../../components/common/Loading'

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('📊 Fetching admin orders...')
      
      // ✅ Try fetching all orders
      const response = await axios.get('/orders')
      console.log('📦 Orders response:', response.data)
      
      // ✅ Handle different response formats
      let orderList = []
      if (response.data && response.data.content && Array.isArray(response.data.content)) {
        orderList = response.data.content
      } else if (Array.isArray(response.data)) {
        orderList = response.data
      } else {
        orderList = []
      }
      
      console.log('📦 Orders count:', orderList.length)
      setOrders(orderList)
    } catch (error) {
      console.error('❌ Error fetching orders:', error)
      setError(error.message)
      // ✅ Don't show toast for 404 - just show empty state
      if (error.response?.status !== 404) {
        toast.error('Failed to load orders')
      }
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      console.log(`🔄 Updating order ${id} to ${status}`)
      await axios.put(`/admin/orders/${id}/status`, { status })
      toast.success('Status updated!')
      fetchOrders()
    } catch (error) {
      console.error('❌ Failed to update status:', error)
      toast.error('Failed to update status')
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'text-yellow-400 bg-yellow-400/10'
      case 'PROCESSING': return 'text-blue-400 bg-blue-400/10'
      case 'SHIPPED': return 'text-purple-400 bg-purple-400/10'
      case 'DELIVERED': return 'text-green-400 bg-green-400/10'
      case 'CANCELLED': return 'text-red-400 bg-red-400/10'
      default: return 'text-white/50 bg-white/5'
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Orders</h1>

      {orders.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-semibold text-white mb-2">No Orders Yet</h3>
          <p className="text-white/50">Orders will appear here once customers place them.</p>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left text-white/60 p-4">Order #</th>
                <th className="text-left text-white/60 p-4">Customer</th>
                <th className="text-left text-white/60 p-4">Total</th>
                <th className="text-left text-white/60 p-4">Status</th>
                <th className="text-left text-white/60 p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 text-white">{o.orderNumber || o.id}</td>
                  <td className="p-4 text-white/70">{o.customerName || 'N/A'}</td>
                  <td className="p-4 text-white">₹{(o.totalAmount || 0).toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(o.status)}`}>
                      {o.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      className="glass px-3 py-1 rounded-lg text-white text-sm"
                      value={o.status || 'PENDING'}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminOrders