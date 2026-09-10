import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
        
        // ✅ Try to get order data from multiple sources
        let orderData = null
        
        // Source 1: location state
        if (location.state && location.state.orderData) {
          orderData = location.state.orderData
          console.log('✅ Order data from location state:', orderData)
        }
        
        // Source 2: localStorage
        if (!orderData) {
          const stored = localStorage.getItem('pendingOrder')
          if (stored) {
            try {
              orderData = JSON.parse(stored)
              console.log('✅ Order data from localStorage:', orderData)
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
              customerPhone: phone || '9876543210'
            }
            console.log('✅ Order data from URL params:', orderData)
          }
        }

        // ✅ Validate and set state
        if (orderData && orderData.id) {
          const orderIdNum = Number(orderData.id)
          
          // ✅ Validate orderId is a valid number
          if (isNaN(orderIdNum) || orderIdNum <= 0) {
            console.error('❌ Invalid order ID:', orderIdNum)
            toast.error('Invalid order ID')
            navigate('/orders')
            return
          }
          
          setOrderId(orderIdNum)
          setAmount(Number(orderData.totalAmount) || 0)
          setCustomerDetails({
            name: orderData.customerName || 'Customer',
            email: orderData.customerEmail || 'customer@email.com',
            phone: orderData.customerPhone || '9876543210'
          })
          setLoading(false)
        } else {
          console.warn('❌ No order data found')
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

  return (
    <div className="container-custom py-20">
      <div className="max-w-2xl mx-auto">
        <div className="glass p-8 rounded-2xl">
          <h1 className="section-title text-center">Complete Payment</h1>
          
          <div className="space-y-6">
            <div className="glass p-4 rounded-xl">
              <h3 className="text-white font-semibold mb-2">Order Summary</h3>
              <div className="flex justify-between text-white/70">
                <span>Order ID</span>
                <span className="text-white">#{orderId}</span>
              </div>
              <div className="flex justify-between text-white/70 mt-2">
                <span>Total Amount</span>
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-400">
                  ₹{amount.toLocaleString()}
                </span>
              </div>
            </div>

            <RazorpayCheckout
              orderId={orderId}
              amount={amount}
              customerName={customerDetails.name}
              customerEmail={customerDetails.email}
              customerPhone={customerDetails.phone}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage