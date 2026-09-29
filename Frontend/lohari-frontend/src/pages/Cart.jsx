import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import {
  FiTrash2, FiPlus, FiMinus, FiShoppingBag,
  FiArrowRight, FiPackage, FiCheckCircle,
} from 'react-icons/fi'

function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
  } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="container-custom py-20 pt-28 text-center">
        <div className="max-w-md mx-auto rounded-3xl border border-white/[0.06] bg-slate-900/40 backdrop-blur-xl p-10">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
            <FiShoppingBag className="text-slate-500" size={26} />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Your cart is empty</h2>
          <p className="text-slate-400 mb-6">
            Looks like you haven't added any products yet
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 font-bold text-sm shadow-[0_0_24px_-6px_rgba(34,211,238,0.7)] hover:scale-[1.03] transition-all"
          >
            <FiShoppingBag size={16} />
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-20 pt-28">

      {/* ═══════════════════════════════ */}
      {/* HEADER */}
      {/* ═══════════════════════════════ */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-cyan-400 border border-cyan-400/20 bg-cyan-400/[0.05] rounded-full mb-3">
            Your Cart
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            Shopping Cart
          </h1>
          <p className="text-slate-400 text-lg">
            {getTotalItems()} item{getTotalItems() > 1 ? 's' : ''} in your cart
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ═══════════════════════════════ */}
        {/* CART ITEMS */}
        {/* ═══════════════════════════════ */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl border border-white/[0.06] bg-slate-900/40 backdrop-blur-xl p-4 flex flex-col sm:flex-row items-center gap-4 hover:border-white/[0.12] hover:bg-slate-900/60 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative shrink-0">
                <img
                  src={item.image || 'https://via.placeholder.com/80'}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl border border-white/[0.06]"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h3 className="text-white font-bold text-base truncate">
                  {item.name}
                </h3>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300 font-bold text-lg">
                  ₹{item.price?.toLocaleString()}
                </p>
                <p className="text-slate-500 text-xs mt-0.5">
                  Total: ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
                  <button
                    className="px-3 py-2 text-white hover:bg-white/[0.06] hover:text-cyan-400 transition-colors"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label="Decrease"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="px-3 text-white font-bold min-w-[36px] text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    className="px-3 py-2 text-white hover:bg-white/[0.06] hover:text-cyan-400 transition-colors"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>

                {/* Remove */}
                <button
                  className="p-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/[0.08] border border-transparent hover:border-rose-500/20 transition-all"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {/* Continue shopping link */}
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-300 font-semibold transition-colors group"
            >
              <FiArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" />
              Continue shopping
            </Link>
          </div>
        </div>

        {/* ═══════════════════════════════ */}
        {/* ORDER SUMMARY */}
        {/* ═══════════════════════════════ */}
        <div className="lg:col-span-1">
          <div className="rounded-3xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-xl p-6 lg:sticky lg:top-28">

            {/* Header */}
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/[0.06]">
              <div className="w-10 h-10 rounded-xl bg-indigo-400/[0.1] border border-indigo-400/20 flex items-center justify-center text-indigo-400">
                <FiPackage size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Order Summary</h3>
                <p className="text-xs text-slate-500">
                  {getTotalItems()} item{getTotalItems() > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Subtotal</span>
                <span>₹{getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>Shipping</span>
                <span className="text-emerald-400 font-semibold">FREE</span>
              </div>

              <div className="pt-3 mt-3 border-t border-white/[0.06]">
                <div className="flex items-baseline justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300 font-black text-2xl">
                    ₹{getTotalPrice().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout button */}
            <Link
              to="/checkout"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 font-bold text-sm shadow-[0_0_28px_-6px_rgba(34,211,238,0.7)] hover:shadow-[0_0_36px_-4px_rgba(99,102,241,0.9)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Proceed to Checkout
              <FiArrowRight size={16} />
            </Link>

            {/* Trust note */}
            <p className="text-center text-xs text-slate-500 mt-4">
              <FiCheckCircle className="inline mr-1 text-emerald-400" size={12} />
              Free delivery · Pay 30% advance
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart