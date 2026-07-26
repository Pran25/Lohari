import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../api/order'
import toast from 'react-hot-toast'
import Loading from '../components/common/Loading'

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

  // ✅ Validation errors state
  const [errors, setErrors] = useState({})

  if (cartItems.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl text-white">Your cart is empty</h2>
        <p className="text-white/50 mt-2">Add some products to checkout</p>
        <Link to="/products" className="btn-primary inline-block mt-4">
          Browse Products
        </Link>
      </div>
    )
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // ✅ Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  // ✅ Validate form before submit
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required'
    }
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required'
    }
    // ✅ Phone must be exactly 10 digits
    const phoneRegex = /^[0-9]{10}$/
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required'
    } else if (!phoneRegex.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Phone must be exactly 10 digits'
    }
    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address is required'
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required'
    }
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
    
    // ✅ Validate first
    if (!validateForm()) {
      toast.error('Please fix all errors')
      return
    }
    
    setLoading(true)

    try {
      // Create order for each cart item
      for (const item of cartItems) {
        const orderData = {
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone, // ✅ 10 digits
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
        }
        console.log('📦 Order data:', orderData) // ✅ Debug
        await createOrder(orderData)
      }

      toast.success('Order placed successfully! 🎉')
      clearCart()
      navigate('/orders')
    } catch (error) {
      console.error('Order error:', error)
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="container-custom py-20">
      <h1 className="section-title">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-xl font-semibold text-white mb-4">Shipping Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-1">Full Name *</label>
                  <input
                    name="customerName"
                    className={`input-field ${errors.customerName ? 'border-red-500' : ''}`}
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                  />
                  {errors.customerName && (
                    <p className="text-red-400 text-xs mt-1">{errors.customerName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">Email *</label>
                  <input
                    name="customerEmail"
                    type="email"
                    className={`input-field ${errors.customerEmail ? 'border-red-500' : ''}`}
                    value={formData.customerEmail}
                    onChange={handleChange}
                    required
                  />
                  {errors.customerEmail && (
                    <p className="text-red-400 text-xs mt-1">{errors.customerEmail}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">Phone (10 digits) *</label>
                <input
                  name="customerPhone"
                  type="tel"
                  className={`input-field ${errors.customerPhone ? 'border-red-500' : ''}`}
                  value={formData.customerPhone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  required
                  maxLength="10"
                />
                {errors.customerPhone ? (
                  <p className="text-red-400 text-xs mt-1">{errors.customerPhone}</p>
                ) : (
                  <p className="text-white/40 text-xs mt-1">Enter 10 digit phone number</p>
                )}
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">Address Line 1 *</label>
                <input
                  name="addressLine1"
                  className={`input-field ${errors.addressLine1 ? 'border-red-500' : ''}`}
                  value={formData.addressLine1}
                  onChange={handleChange}
                  required
                />
                {errors.addressLine1 && (
                  <p className="text-red-400 text-xs mt-1">{errors.addressLine1}</p>
                )}
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">Address Line 2</label>
                <input
                  name="addressLine2"
                  className="input-field"
                  value={formData.addressLine2}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-1">City *</label>
                  <input
                    name="city"
                    className={`input-field ${errors.city ? 'border-red-500' : ''}`}
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                  {errors.city && (
                    <p className="text-red-400 text-xs mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">State *</label>
                  <input
                    name="state"
                    className={`input-field ${errors.state ? 'border-red-500' : ''}`}
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                  {errors.state && (
                    <p className="text-red-400 text-xs mt-1">{errors.state}</p>
                  )}
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">Pincode (6 digits) *</label>
                  <input
                    name="pincode"
                    type="text"
                    className={`input-field ${errors.pincode ? 'border-red-500' : ''}`}
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    maxLength="6"
                  />
                  {errors.pincode && (
                    <p className="text-red-400 text-xs mt-1">{errors.pincode}</p>
                  )}
                </div>
              </div>

              <button type="submit" className="btn-primary w-full">
                Place Order
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-2xl sticky top-24">
            <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-white/70 text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 my-4 pt-4">
              <div className="flex justify-between text-white font-semibold">
                <span>Total</span>
                <span className="text-secondary">₹{getTotalPrice().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout