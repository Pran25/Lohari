import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi'

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart()

  console.log('🛒 Cart Items:', cartItems)  // ✅ Debug log

  if (cartItems.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl text-white">Your cart is empty</h2>
        <p className="text-white/50 mt-2">Looks like you haven't added any products yet</p>
        <Link to="/products" className="btn-primary inline-block mt-6">
          <FiShoppingBag className="inline mr-2" /> Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="container-custom py-20">
      <h1 className="section-title">Shopping Cart</h1>
      <p className="section-subtitle">{getTotalItems()} items in your cart</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="glass rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
              <img 
                src={item.image || 'https://via.placeholder.com/80'} 
                alt={item.name}
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h3 className="text-white font-semibold">{item.name}</h3>
                <p className="text-secondary font-bold">₹{item.price?.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center glass rounded-xl">
                  <button 
                    className="px-3 py-1 text-white hover:text-secondary transition-colors"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <FiMinus />
                  </button>
                  <span className="px-3 text-white">{item.quantity}</span>
                  <button 
                    className="px-3 py-1 text-white hover:text-secondary transition-colors"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <FiPlus />
                  </button>
                </div>
                <button 
                  className="text-red-400 hover:text-red-300 p-2 hover:bg-red-400/10 rounded-lg transition-colors"
                  onClick={() => removeFromCart(item.id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-2xl sticky top-24">
            <h3 className="text-xl font-semibold text-white mb-4">Order Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-white/70">
                <span>Subtotal</span>
                <span>₹{getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Shipping</span>
                <span className="text-green-400">FREE</span>
              </div>
              <div className="border-t border-white/10 my-3 pt-3">
                <div className="flex justify-between text-white font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-secondary">₹{getTotalPrice().toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Link 
              to="/checkout" 
              className="btn-primary w-full text-center mt-4 inline-block"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart