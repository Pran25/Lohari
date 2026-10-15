import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  FiCreditCard, FiLock, FiShield, FiCheckCircle,
  FiArrowLeft, FiPackage,
} from 'react-icons/fi'
import RazorpayCheckout from '../components/payment/RazorpayCheckout'
import toast from 'react-hot-toast'
import Loading from '../components/common/Loading'

function PaymentPage() {
  const [orderId, setOrderId] = useState(null)
  const [amount, setAmount] = useState(0)
  const [customerDetails, setCustomerDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const loadOrder = () => {
      try {
        console.log('📍 Location state:', location.state)

        let orderData = null

        // Source 1: location state
        if (location.state && location.state.orderData) {
          orderData = location.state.orderData
        }

        // Source 2: localStorage
        if (!orderData) {
          const stored = localStorage.getItem('pendingOrder')
          if (stored) {
            try {
              orderData = JSON.parse(stored)
            } catch (e) {
              console.warn('Failed to parse pendingOrder:', e)
            }
          }
        }

        // Source 3: URL params
        if (!orderData) {
          const params = new URLSearchParams(location.search)
          const id = params.get('orderId')
          const total = params.get('amount')
          const name = params.get('name')
          const email = params.get('email')
          const phone = params.get('phone')

          if (id) {
            orderData = {
              id: Number(id),
              totalAmount: Number(total) || 0,
              customerName: name || 'Customer',
              customerEmail: email || 'customer@email.com',
              customerPhone: phone || '9876543210',
            }
          }
        }

        // Validate and set state
        if (orderData && orderData.id) {
          const orderIdNum = Number(orderData.id)

          if (isNaN(orderIdNum) || orderIdNum <= 0) {
            toast.error('Invalid order ID')
            navigate('/orders')
            return
          }

          setOrderId(orderIdNum)
          setAmount(Number(orderData.totalAmount) || 0)
          setCustomerDetails({
            name: orderData.customerName || 'Customer',
            email: orderData.customerEmail || 'customer@email.com',
            phone: orderData.customerPhone || '9876543210',
          })
          setLoading(false)
        } else {
          toast.error('No order found')
          navigate('/orders')
        }
      } catch (error) {
        console.error('❌ Payment page error:', error)
        toast.error('Failed to load order details')
        navigate('/orders')
      }
    }

    loadOrder()
  }, [navigate, location])

  if (loading) {
    return <Loading />
  }

  const advanceAmount = Math.round(amount * 0.3)
  const balanceAmount = amount - advanceAmount

  return (
    <div className="container-custom py-20 pt-28">
      <div className="max-w-4xl mx-auto">

        {/* ═══════════════════════════════ */}
        {/* HEADER */}
        {/* ═══════════════════════════════ */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-cyan-400 border border-cyan-400/20 bg-cyan-400/[0.05] rounded-full mb-4">
            <FiLock size={11} />
            Secure Payment
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Complete Payment
          </h1>
          <p className="text-slate-400 text-lg">
            Pay 30% advance to confirm your order
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ═══════════════════════════════ */}
          {/* LEFT — Payment Area */}
          {/* ═══════════════════════════════ */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-xl p-6 md:p-8">

              {/* Header */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/[0.06]">
                <div className="w-11 h-11 rounded-xl bg-cyan-400/[0.1] border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                  <FiCreditCard size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Payment Method</h2>
                  <p className="text-xs text-slate-500">Powered by Razorpay</p>
                </div>
              </div>

              {/* Razorpay Checkout */}
              <RazorpayCheckout
                orderId={orderId}
                amount={amount}
                customerName={customerDetails.name}
                customerEmail={customerDetails.email}
                customerPhone={customerDetails.phone}
              />

              {/* Trust row */}
              <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-white/[0.06]">
                <TrustItem icon={<FiShield size={14} />} label="Secure" />
                <TrustItem icon={<FiCheckCircle size={14} />} label="Verified" />
                <TrustItem icon={<FiLock size={14} />} label="Encrypted" />
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════ */}
          {/* RIGHT — Order Summary */}
          {/* ═══════════════════════════════ */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-xl p-6 lg:sticky lg:top-28">

              {/* Header */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/[0.06]">
                <div className="w-10 h-10 rounded-xl bg-indigo-400/[0.1] border border-indigo-400/20 flex items-center justify-center text-indigo-400">
                  <FiPackage size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Order Summary</h3>
                  <p className="text-xs text-slate-500">Review before payment</p>
                </div>
              </div>

              {/* Order ID */}
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-slate-400">Order ID</span>
                <span className="text-white font-mono font-bold">#{orderId}</span>
              </div>

              {/* Amount breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-white/[0.06]">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total Amount</span>
                  <span className="text-white font-semibold">
                    ₹{amount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                    Advance (30%)
                    <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-cyan-400/20 text-cyan-300">
                      Pay Now
                    </span>
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300 font-black text-lg">
                    ₹{advanceAmount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm pt-2 border-t border-white/[0.04]">
                  <span className="text-slate-500">Balance (70%)</span>
                  <span className="text-slate-500 font-semibold">
                    ₹{balanceAmount.toLocaleString()}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 pt-1">
                  Balance to be paid before delivery
                </p>
              </div>

              {/* Info box */}
              <div className="mt-5 p-3.5 rounded-xl bg-cyan-400/[0.05] border border-cyan-400/20">
                <p className="text-[11px] text-cyan-200 leading-relaxed">
                  <strong>Note:</strong> Your order will be confirmed after
                  advance payment. Balance must be paid before delivery.
                </p>
              </div>

              {/* Back link */}
              <Link
                to="/orders"
                className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-cyan-300 font-semibold transition-colors group"
              >
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={13} />
                Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Trust item ─── */
function TrustItem({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
      <span className="text-emerald-400">{icon}</span>
      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
        {label}
      </span>
    </div>
  )
}

export default PaymentPage