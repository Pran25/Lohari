import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  FiArrowLeft, FiMapPin, FiUser, FiMail, FiPhone,
  FiDollarSign,
  FiTag, FiGift,
} from 'react-icons/fi'
import { getOrderById, getOrderTracking } from '../api/order'
import Loading from '../components/common/Loading'
import toast from 'react-hot-toast'
import OrderTimeline from '../components/order/OrderTimeline'
import InvoiceButton from '../components/order/InvoiceButton'

function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [tracking, setTracking] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([
        getOrderById(id),
        getOrderTracking(id),
      ])
      .then(([orderData, trackingData]) => {
        if (!active) return
        setOrder(orderData)
        setTracking(trackingData || [])
      })
      .catch((error) => {
        if (!active) return
        console.error('Error fetching order:', error)
        toast.error('Failed to load order details')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

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

  if (loading) return <Loading />

  if (!order) {
    return (
      <div className="container-custom py-20 pt-28 text-center">
        <h2 className="text-2xl text-white">Order not found</h2>
        <Link to="/orders" className="btn-primary inline-block mt-4">
          <FiArrowLeft className="inline mr-2" /> Back to Orders
        </Link>
      </div>
    )
  }

  // ✅ Discount calculations
  const baseAmount = Number(order.originalAmount ?? order.totalAmount ?? 0)
  const couponDiscount = Number(order.discountAmount ?? 0)
  const manualDiscount = Number(order.manualDiscount ?? 0)
  const totalDiscount = couponDiscount + manualDiscount
  const hasDiscount = totalDiscount > 0

  return (
    <div className="container-custom py-20 pt-28">
      <Link
        to="/orders"
        className="text-slate-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-2 mb-6 text-sm font-semibold"
      >
        <FiArrowLeft /> Back to Orders
      </Link>

      {/* Order Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Order #{order.orderNumber || order.id}
          </h1>
          <p className="text-slate-400">
            Placed on{' '}
            {new Date(order.orderDate || order.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
              order.status
            )}`}
          >
            {order.status?.replace(/_/g, ' ') || 'PENDING'}
          </span>
        </div>
      </div>

      {/* ✅ Discount Applied Banner */}
      {hasDiscount && (
        <div className="mb-6 flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400/[0.12] to-cyan-400/[0.12] border border-emerald-400/30">
          <span className="w-10 h-10 rounded-xl bg-emerald-400/[0.15] border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
            <FiGift size={18} />
          </span>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">
              🎉 You saved ₹{totalDiscount.toLocaleString()} on this order!
            </p>
            <p className="text-emerald-300/80 text-xs mt-0.5">
              {couponDiscount > 0 && `Coupon: ₹${couponDiscount.toLocaleString()}`}
              {couponDiscount > 0 && manualDiscount > 0 && ' • '}
              {manualDiscount > 0 && `Special discount: ₹${manualDiscount.toLocaleString()}`}
            </p>
          </div>
        </div>
      )}

      {/* ✅ Invoice Download Button (customer) */}
      <div className="mb-6 max-w-xs">
        <InvoiceButton orderId={order.id} orderNumber={order.orderNumber} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">
              Product Details
            </h3>
            <div className="flex items-center gap-4">
              <img
                src={order.productImage || 'https://via.placeholder.com/100'}
                alt={order.productName}
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h4 className="text-white font-semibold">{order.productName}</h4>
                <p className="text-white/50 text-sm">
                  Material: {order.material || 'N/A'}
                </p>
                <p className="text-white/50 text-sm">
                  Finish: {order.finish || 'N/A'}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-white/60 text-sm">
                    Qty: {order.quantity}
                  </span>
                  <div className="flex items-center gap-2">
                    {hasDiscount && (
                      <span className="text-white/40 text-sm line-through">
                        ₹{baseAmount.toLocaleString()}
                      </span>
                    )}
                    <span className="text-secondary font-semibold">
                      ₹{Number(order.totalAmount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ NEW: Pricing Breakdown Card */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FiDollarSign className="text-secondary" />
              Pricing Breakdown
            </h3>

            <div className="space-y-3">
              {/* Base Amount */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Base Amount</span>
                <span className="text-white font-medium">
                  ₹{baseAmount.toLocaleString()}
                </span>
              </div>

              {/* Coupon Discount */}
              {couponDiscount > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60 flex items-center gap-2">
                    Coupon Discount
                    {order.couponCode && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-400/10 border border-blue-400/30 text-blue-300 text-[10px] font-mono font-semibold">
                        {order.couponCode}
                      </span>
                    )}
                  </span>
                  <span className="text-emerald-400 font-medium">
                    − ₹{couponDiscount.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Manual Discount */}
              {manualDiscount > 0 && (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/60 flex items-center gap-2">
                      <FiTag size={12} className="text-emerald-400" />
                      Special Discount
                    </span>
                    <span className="text-emerald-400 font-medium">
                      − ₹{manualDiscount.toLocaleString()}
                    </span>
                  </div>
                  {order.discountReason && (
                    <div className="ml-5 pl-3 border-l-2 border-emerald-400/30 text-xs text-emerald-300/70 italic">
                      "{order.discountReason}"
                    </div>
                  )}
                </>
              )}

              {/* Divider */}
              <div className="border-t border-white/10 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Final Total</span>
                  <span className="text-secondary font-bold text-lg">
                    ₹{Number(order.totalAmount || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Advance */}
              <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-white/60">Advance Paid (30%)</span>
                <span className="text-white font-medium">
                  ₹{Number(order.advanceAmount || 0).toLocaleString()}
                </span>
              </div>

              {/* Balance */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Balance Due</span>
                <span className="text-amber-400 font-semibold">
                  ₹{Number(order.balanceAmount || 0).toLocaleString()}
                </span>
              </div>

              {/* Total Savings Badge */}
              {hasDiscount && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-400/[0.08] border border-emerald-400/20 flex items-center justify-between">
                  <span className="text-emerald-300 text-sm font-semibold flex items-center gap-2">
                    <FiGift size={14} />
                    Total Savings
                  </span>
                  <span className="text-emerald-400 font-bold">
                    ₹{totalDiscount.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {order.deliveryAddress && (
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">
                Delivery Address
              </h3>
              <div className="flex items-start gap-3">
                <FiMapPin className="text-secondary mt-1" />
                <div>
                  <p className="text-white">
                    {order.deliveryAddress.addressLine1}
                  </p>
                  {order.deliveryAddress.addressLine2 && (
                    <p className="text-white/60">
                      {order.deliveryAddress.addressLine2}
                    </p>
                  )}
                  <p className="text-white/60">
                    {order.deliveryAddress.city}, {order.deliveryAddress.state} -{' '}
                    {order.deliveryAddress.pincode}
                  </p>
                  <p className="text-white/60">
                    {order.deliveryAddress.country}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="glass p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">
              Customer Details
            </h3>
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
          <OrderTimeline tracking={tracking} />
        </div>
      </div>
    </div>
  )
}

export default OrderDetail