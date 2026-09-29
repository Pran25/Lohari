import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPackage, FiClock, FiCheckCircle, FiXCircle, FiTruck, FiEye, FiTool, FiMapPin, FiDollarSign } from 'react-icons/fi'
import { getOrders } from '../api/order'
import Loading from '../components/common/Loading'
import toast from 'react-hot-toast'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await getOrders()
      
      // ✅ Handle different response formats
      let orderList = []
      if (Array.isArray(data)) {
        orderList = data
      } else if (data && data.content && Array.isArray(data.content)) {
        orderList = data.content
      }
      
      setOrders(orderList)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return <FiClock className="text-yellow-400" />
      case 'QUOTE_SENT': return <FiDollarSign className="text-blue-400" />
      case 'QUOTE_ACCEPTED': return <FiCheckCircle className="text-green-400" />
      case 'SITE_VISIT_SCHEDULED': return <FiMapPin className="text-purple-400" />
      case 'SITE_VISIT_COMPLETED': return <FiMapPin className="text-purple-500" />
      case 'ADVANCE_PAID': return <FiDollarSign className="text-green-400" />
      case 'FABRICATION_STARTED': return <FiTool className="text-orange-400" />
      case 'FABRICATION_IN_PROGRESS': return <FiTool className="text-orange-500" />
      case 'FABRICATION_COMPLETE': return <FiTool className="text-green-400" />
      case 'DELIVERY_SCHEDULED': return <FiTruck className="text-blue-400" />
      case 'DELIVERED': return <FiCheckCircle className="text-green-400" />
      case 'COMPLETED': return <FiCheckCircle className="text-green-500" />
      case 'CANCELLED': return <FiXCircle className="text-red-400" />
      default: return <FiPackage className="text-white/50" />
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'text-yellow-400 bg-yellow-400/10'
      case 'QUOTE_SENT': return 'text-blue-400 bg-blue-400/10'
      case 'QUOTE_ACCEPTED': return 'text-green-400 bg-green-400/10'
      case 'SITE_VISIT_SCHEDULED': return 'text-purple-400 bg-purple-400/10'
      case 'SITE_VISIT_COMPLETED': return 'text-purple-500 bg-purple-500/10'
      case 'ADVANCE_PAID': return 'text-green-400 bg-green-400/10'
      case 'FABRICATION_STARTED': return 'text-orange-400 bg-orange-400/10'
      case 'FABRICATION_IN_PROGRESS': return 'text-orange-500 bg-orange-500/10'
      case 'FABRICATION_COMPLETE': return 'text-green-400 bg-green-400/10'
      case 'DELIVERY_SCHEDULED': return 'text-blue-400 bg-blue-400/10'
      case 'DELIVERED': return 'text-green-400 bg-green-400/10'
      case 'COMPLETED': return 'text-green-500 bg-green-500/10'
      case 'CANCELLED': return 'text-red-400 bg-red-400/10'
      default: return 'text-white/50 bg-white/5'
    }
  }

  // ✅ Calculate progress for fabrication flow
  const getProgressWidth = (status) => {
    const statusMap = {
      'PENDING': 8,
      'QUOTE_SENT': 16,
      'QUOTE_ACCEPTED': 24,
      'SITE_VISIT_SCHEDULED': 32,
      'SITE_VISIT_COMPLETED': 40,
      'ADVANCE_PAID': 48,
      'FABRICATION_STARTED': 56,
      'FABRICATION_IN_PROGRESS': 64,
      'FABRICATION_COMPLETE': 72,
      'DELIVERY_SCHEDULED': 80,
      'DELIVERED': 90,
      'COMPLETED': 100,
      'CANCELLED': 0
    }
    return statusMap[status?.toUpperCase()] || 8
  }

  if (loading) return <Loading />

  return (
    <div className="container-custom py-20">
      <h1 className="section-title">My Orders</h1>
      <p className="section-subtitle">Track and manage your orders</p>

      {orders.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-semibold text-white mb-2">No Orders Yet</h3>
          <p className="text-white/50 mb-6">You haven't placed any orders yet.</p>
          <Link to="/products" className="btn-primary inline-block">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="glass rounded-2xl p-6 hover:shadow-2xl transition-all">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-white font-semibold">Order #{order.orderNumber || order.id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status?.replace(/_/g, ' ') || 'PENDING'}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm">
                    {new Date(order.orderDate || order.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-white/70 mt-1">{order.productName || 'Product'}</p>
                </div>

                {/* Order Details */}
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-white/50 text-sm">Total Amount</p>
                    <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-400">
                      ₹{(order.totalAmount || order.price || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getStatusIcon(order.status)}</span>
                  </div>
                  <Link
                    to={`/orders/${order.id}`}
                    className="glass px-4 py-2 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2 text-white/70 hover:text-white"
                  >
                    <FiEye /> View
                  </Link>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-secondary to-orange-400 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressWidth(order.status)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-white/40">
                  <span>Ordered</span>
                  <span>Fabrication</span>
                  <span>Delivery</span>
                  <span>Complete</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders