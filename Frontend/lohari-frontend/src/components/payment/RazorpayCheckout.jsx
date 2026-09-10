import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import toast from 'react-hot-toast'

function RazorpayCheckout({ orderId, amount, customerName, customerEmail, customerPhone }) {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    try {
      setLoading(true)

      const isLoaded = await loadRazorpayScript()
      if (!isLoaded) {
        toast.error('Failed to load payment gateway')
        setLoading(false)
        return
      }

      if (!orderId) {
        toast.error('Invalid order ID')
        setLoading(false)
        return
      }

      const response = await axios.post('/payments/create-order', {
        orderId: orderId,
        amount: amount
      })

      const orderData = response.data

      const options = {
        key: orderData.keyId || 'rzp_test_RrlxfwtgU5VaLT',
        amount: orderData.amount * 100,
        currency: 'INR',
        name: 'Lohari Fabrication',
        description: 'Order #' + orderId,
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: customerName || 'Customer',
          email: customerEmail || 'customer@email.com',
          contact: customerPhone || '9876543210'
        },
        theme: {
          color: '#E67E22'
        },
        handler: async (razorpayResponse) => {
          try {
            const verifyResponse = await axios.post('/payments/verify', {
              razorpayOrderId: razorpayResponse.razorpay_order_id,
              razorpayPaymentId: razorpayResponse.razorpay_payment_id,
              razorpaySignature: razorpayResponse.razorpay_signature
            })

            if (verifyResponse.data.success) {
              toast.success('Payment successful! 🎉')
              localStorage.removeItem('pendingOrder')
              navigate('/orders')
            } else {
              toast.error('Payment verification failed')
            }
          } catch (error) {
            console.error('Verification error:', error)
            toast.error('Payment verification failed')
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Failed to initiate payment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      className="btn-primary w-full text-center py-3"
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  )
}

export default RazorpayCheckout