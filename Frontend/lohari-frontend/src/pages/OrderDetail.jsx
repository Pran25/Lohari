import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiArrowLeft, FiPackage, FiClock, FiCheckCircle, FiXCircle, FiTruck, FiMapPin, FiUser, FiMail, FiPhone } from 'react-icons/fi'
import { getOrderById, getOrderTracking } from '../api/order'
import Loading from '../components/common/Loading'
import toast from 'react-hot-toast'

function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [tracking, setTracking] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrderDetails()
  }, [id])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const [orderData, trackingData] = await Promise.all([
        getOrderById(id),
        getOrderTracking(id)
      ])
      setOrder(orderData)
      setTracking(trackingData || [])
    } catch (error) {
      console.error('Error fetching order:', error)
      toast.error('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return <FiClock className="text-yellow-400 text-2xl" />
      case 'PROCESSING':
        return <FiPackage className="text-blue-400 text-2xl" />
      case 'SHIPPED':
        return <FiTruck className="text-purple-400 text-2xl" />
      case 'DELIVERED':
        return <FiCheckCircle className="text-green-400 text-2xl" />
      case 'CANCELLED':
        return <FiXCircle className="text-red-400 text-2xl" />
      default:
        return <FiPackage className="text-white/50 text-2xl" />
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'text-yellow-400 bg-yellow-400/10'
      case 'PROCESSING':
        return 'text-blue-400 bg-blue-400/10'
      case 'SHIPPED':
        return 'text-purple-400 bg-purple-400/10'
      case 'DELIVERED':
        return 'text-green-400 bg-green-400/10'
      case 'CANCELLED':
        return 'text-red-400 bg-red-400/10'
      default:
        return 'text-white/50 bg-white/5'
    }
  }

  if (loading) return <Loading />

  if (!order) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl text-white">Order not found</h2>
        <Link to="/orders" className="btn-primary inline-block mt-4">
          <FiArrowLeft className="inline mr-2" /> Back to Orders
        </Link>
      </div>
    )
  }

  return (
    <div className="container-custom py-20">
      <Link to="/orders" className="text-white/60 hover:text-white transition-colors inline-flex items-center gap-2 mb-6">
        <FiArrowLeft /> Back to Orders
      </Link>

      {/* Order Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Order #{order.orderNumber || order.id}</h1>
          <p className="text-white/50">
            Placed on {new Date(order.orderDate || order.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
          {order.status || 'PENDING'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Info */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Product Details</h3>
            <div className="flex items-center gap-4">
              <img 
                src={order.productImage || 'https://via.placeholder.com/100'} 
                alt={order.productName}
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h4 className="text-white font-semibold">{order.productName}</h4>
                <p className="text-white/50 text-sm">Material: {order.material || 'N/A'}</p>
                <p className="text-white/50 text-sm">Finish: {order.finish || 'N/A'}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-white/60 text-sm">Qty: {order.quantity}</span>
                  <span className="text-secondary font-semibold">₹{order.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {order.deliveryAddress && (
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">Delivery Address</h3>
              <div className="flex items-start gap-3">
                <FiMapPin className="text-secondary mt-1" />
                <div>
                  <p className="text-white">{order.deliveryAddress.addressLine1}</p>
                  {order.deliveryAddress.addressLine2 && (
                    <p className="text-white/60">{order.deliveryAddress.addressLine2}</p>
                  )}
                  <p className="text-white/60">
                    {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                  </p>
                  <p className="text-white/60">{order.deliveryAddress.country}</p>
                </div>
              </div>
            </div>
          )}

          {/* Customer Info */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Customer Details</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-white/70">
                <FiUser className="text-secondary" />
                <span>{order.customerName}</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <FiMail className="text-secondary" />
                <span>{order.customerEmail}</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <FiPhone className="text-secondary" />
                <span>{order.customerPhone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-2xl sticky top-24">
            <h3 className="text-lg font-semibold text-white mb-4">Order Timeline</h3>
            {tracking.length === 0 ? (
              <p className="text-white/50 text-sm">No tracking updates yet</p>
            ) : (
              <div className="space-y-4">
                {tracking.map((item, index) => (
                  <div key={index} className="relative pl-6 pb-4 border-l border-white/10 last:border-0">
                    <div className="absolute left-[-8px] top-0">
                      {getStatusIcon(item.status)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{item.status}</p>
                      <p className="text-white/50 text-sm">{item.description}</p>
                      <p className="text-white/40 text-xs mt-1">
                        {new Date(item.timestamp).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail