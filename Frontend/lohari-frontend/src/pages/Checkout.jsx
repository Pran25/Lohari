import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiPackage,
  FiShoppingBag, FiCheckCircle, FiArrowRight, FiCreditCard,
} from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../api/order'
import axios from '../api/axios'
import toast from 'react-hot-toast'
import Loading from '../components/common/Loading'
import CouponInput from '../components/checkout/CouponInput'

function Checkout() {
  const { cartItems, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    customerName: user?.fullName || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  })

  const [errors, setErrors] = useState({})

  // ✅ COUPON STATE
  const [appliedCoupon, setAppliedCoupon] = useState(null)

  if (cartItems.length === 0) {
    return (
      <div className="container-custom py-20 pt-28 text-center">
        <div className="max-w-md mx-auto rounded-3xl border border-white/[0.06] bg-slate-900/40 backdrop-blur-xl p-10">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
            <FiShoppingBag className="text-slate-500" size={26} />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Your cart is empty</h2>
          <p className="text-slate-400 mb-6">Add some products to checkout</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 font-bold text-sm shadow-[0_0_24px_-6px_rgba(34,211,238,0.7)] hover:scale-[1.03] transition-all"
          >
            Browse Products
            <FiArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  // ✅ CALCULATED VALUES (with coupon)
  const subtotal = getTotalPrice()
  const discountAmount = appliedCoupon?.discountAmount || 0
  const finalTotal = subtotal - discountAmount

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.customerName.trim()) newErrors.customerName = 'Name is required'
    if (!formData.customerEmail.trim()) newErrors.customerEmail = 'Email is required'

    const phoneRegex = /^[0-9]{10}$/
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required'
    } else if (!phoneRegex.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Phone must be exactly 10 digits'
    }

    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required'
    } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please fix all errors')
      return
    }

    setLoading(true)

    try {
      let lastOrder = null

      for (const item of cartItems) {
        const orderData = {
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
          productName: item.name,
          productImage: item.image,
          quantity: item.quantity,
          unitPrice: item.price,
          material: item.material || 'Standard',
          finish: item.finish || 'Standard',
          leadTimeDays: 15,

          // ✅ COUPON FIELDS
          couponCode: appliedCoupon?.code || null,
          discountAmount: appliedCoupon?.discountAmount || 0,
        }

        const response = await createOrder(orderData)
        console.log('📦 Order created:', response)
        lastOrder = response
      }

      if (!lastOrder || !lastOrder.id) {
        throw new Error('Order creation failed — no order ID returned')
      }

      // ✅ Increment coupon usage
      if (appliedCoupon?.code) {
        try {
          await axios.post(`/coupons/apply?code=${appliedCoupon.code}`)
          console.log('✅ Coupon usage incremented:', appliedCoupon.code)
        } catch (err) {
          console.warn('⚠️ Coupon usage increment failed:', err)
        }
      }

      const pendingOrder = {
        id: lastOrder.id,
        orderNumber: lastOrder.orderNumber || `LOH-${lastOrder.id}`,
        totalAmount: lastOrder.totalAmount || finalTotal,
        advanceAmount: lastOrder.advanceAmount || Math.round(finalTotal * 0.3),
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
      }

      console.log('💾 Saving pendingOrder:', pendingOrder)

      localStorage.setItem('pendingOrder', JSON.stringify(pendingOrder))
      clearCart()

      toast.success('Order placed! Redirecting to payment...')

      navigate('/payment', {
        state: { orderData: pendingOrder },
      })

    } catch (error) {
      console.error('❌ Order error:', error)
      toast.error(
        error.response?.data?.message || error.message || 'Failed to place order'
      )
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="container-custom py-20 pt-28">

      {/* HEADER */}
      <div className="mb-10">
        <span className="inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-cyan-400 border border-cyan-400/20 bg-cyan-400/[0.05] rounded-full mb-3">
          Final Step
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
          Checkout
        </h1>
        <p className="text-slate-400 text-lg">Complete your order details below</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* FORM */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-xl p-6 md:p-8">

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/[0.1] border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                <FiMapPin size={18} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Shipping Details</h2>
                <p className="text-xs text-slate-500">Where should we deliver?</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  label="Full Name"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  error={errors.customerName}
                  icon={<FiUser size={14} />}
                  placeholder="John Doe"
                  required
                />
                <Field
                  label="Email"
                  name="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  error={errors.customerEmail}
                  icon={<FiMail size={14} />}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <Field
                label="Phone Number"
                name="customerPhone"
                type="tel"
                value={formData.customerPhone}
                onChange={handleChange}
                error={errors.customerPhone}
                icon={<FiPhone size={14} />}
                placeholder="9876543210"
                maxLength="10"
                required
                hint="Enter 10 digit mobile number"
              />

              <Field
                label="Address Line 1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                error={errors.addressLine1}
                icon={<FiMapPin size={14} />}
                placeholder="House/Flat No., Building, Street"
                required
              />

              <Field
                label="Address Line 2"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                icon={<FiMapPin size={14} />}
                placeholder="Area, Landmark (optional)"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                  placeholder="Pune"
                  required
                />
                <Field
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  error={errors.state}
                  placeholder="Maharashtra"
                  required
                />
                <Field
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  error={errors.pincode}
                  placeholder="411001"
                  maxLength="6"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 font-bold text-sm shadow-[0_0_28px_-6px_rgba(34,211,238,0.7)] hover:shadow-[0_0_36px_-4px_rgba(99,102,241,0.9)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      Place Order & Pay Advance
                      <FiArrowRight size={16} />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-500 mt-3">
                  <FiCheckCircle className="inline mr-1 text-emerald-400" size={12} />
                  Secure checkout · No hidden charges
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="lg:col-span-1">
          <div className="rounded-3xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-xl p-6 lg:sticky lg:top-28">

            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/[0.06]">
              <div className="w-10 h-10 rounded-xl bg-indigo-400/[0.1] border border-indigo-400/20 flex items-center justify-center text-indigo-400">
                <FiShoppingBag size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Order Summary</h3>
                <p className="text-xs text-slate-500">
                  {cartItems.length} item{cartItems.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Items list */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover border border-white/[0.06]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-slate-500">
                      <FiPackage size={16} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-[13px] font-semibold truncate">
                      {item.name}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Qty {item.quantity} × ₹{item.price?.toLocaleString()}
                    </p>
                  </div>
                  <p className="text-white text-[13px] font-bold whitespace-nowrap">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* ✅ COUPON INPUT */}
            <div className="mt-5 pt-5 border-t border-white/[0.06]">
              <CouponInput
                orderAmount={subtotal}
                customerEmail={formData.customerEmail}
                appliedCoupon={appliedCoupon}
                onApply={setAppliedCoupon}
                onRemove={() => setAppliedCoupon(null)}
              />
            </div>

            {/* Totals */}
            <div className="mt-5 pt-5 border-t border-white/[0.06] space-y-2.5">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>

              {/* ✅ Discount row */}
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    Discount
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-400/20 text-emerald-300">
                      {appliedCoupon.code}
                    </span>
                  </span>
                  <span className="text-emerald-400 font-semibold">
                    -₹{discountAmount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm text-slate-400">
                <span>Delivery</span>
                <span className="text-emerald-400 font-semibold">Free</span>
              </div>

              <div className="flex justify-between pt-3 mt-3 border-t border-white/[0.06]">
                <span className="text-white font-bold">Total</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300 font-black text-2xl">
                  ₹{finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
              <FiCreditCard className="text-cyan-400" size={13} />
              <span>Pay 30% advance to confirm order</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Reusable field */
function Field({
  label,
  name,
  value,
  onChange,
  error,
  icon,
  type = 'text',
  placeholder,
  maxLength,
  required,
  hint,
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
        {icon}
        {label}
        {required && <span className="text-cyan-400">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-white placeholder-slate-600 text-sm focus:outline-none transition-all ${
          error
            ? 'border-rose-500/50 focus:border-rose-400 focus:bg-rose-500/[0.03]'
            : 'border-white/[0.08] focus:border-cyan-400/40 focus:bg-white/[0.05]'
        }`}
      />
      {error ? (
        <p className="text-rose-400 text-[11px] mt-1.5 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-rose-400" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-slate-600 text-[11px] mt-1.5">{hint}</p>
      ) : null}
    </div>
  )
}

export default Checkout