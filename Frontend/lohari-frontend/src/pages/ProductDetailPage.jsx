import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  FiShoppingCart, FiArrowLeft, FiPackage, FiClock,
  FiStar, FiCheckCircle, FiTruck, FiShield, FiTool,
} from 'react-icons/fi'
import { getProductBySlug } from '../api/product'
import { useCart } from '../context/CartContext'
import Loading from '../components/common/Loading'
import toast from 'react-hot-toast'
import ReviewsList from '../components/product/ReviewList'
import ReviewForm from '../components/product/ReviewForm'
import { useAuth } from '../context/AuthContext'

function ProductDetailPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loadedSlug, setLoadedSlug] = useState(null)
  const loading = loadedSlug !== slug
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    let active = true

    getProductBySlug(slug)
      .then((data) => {
        if (active) setProduct(data)
      })
      .catch((error) => {
        if (!active) return
        console.error('❌ Error fetching product:', error)
        setProduct(null)
        toast.error('Product not found')
      })
      .finally(() => {
        if (active) setLoadedSlug(slug)
      })

    return () => {
      active = false
    }
  }, [slug])

  const fetchProduct = async () => {
    try {
      const data = await getProductBySlug(slug)
      setProduct(data)
    } catch (error) {
      console.error('❌ Error fetching product:', error)
      toast.error('Product not found')
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.basePrice,
          image: product.thumbnailUrl || product.mainImageUrl,
          slug: product.slug,
        },
        quantity
      )
      toast.success(`${quantity} × ${product.name} added to cart!`)
    }
  }

  if (loading) return <Loading />

  if (!product) {
    return (
      <div className="container-custom py-20 pt-28 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
          <FiPackage className="text-slate-500" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Product not found</h2>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 font-bold text-sm shadow-[0_0_24px_-6px_rgba(34,211,238,0.7)] hover:scale-[1.03] transition-all"
        >
          <FiArrowLeft /> Back to Products
        </Link>
      </div>
    )
  }

  return (
    <div className="container-custom py-20 pt-28">

      {/* ---------- BACK BUTTON ---------- */}
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-300 text-sm font-semibold mb-8 transition-colors group"
      >
        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Back to Products
      </Link>

      {/* ---------- MAIN GRID ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">

        {/* ═══════════════════════════════ */}
        {/* LEFT — IMAGE */}
        {/* ═══════════════════════════════ */}
        <div className="relative">
          {/* Glow behind image */}
          <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/[0.12] via-indigo-500/[0.12] to-transparent rounded-3xl blur-2xl" />

          {/* Main image card */}
          <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-slate-900/60 backdrop-blur-xl">
            <img
              src={
                product.mainImageUrl ||
                product.thumbnailUrl ||
                'https://via.placeholder.com/600x400'
              }
              alt={product.name}
              className="w-full h-[420px] lg:h-[520px] object-cover"
            />

            {/* Category badge */}
            {product.category?.name && (
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-xl border border-white/[0.1] text-slate-200">
                {product.category.name}
              </div>
            )}

            {/* Stock status */}
            <div className="absolute top-4 right-4">
              {product.isInStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-400/90 text-slate-950 shadow-[0_0_20px_-4px_rgba(52,211,153,0.7)]">
                  <FiCheckCircle size={11} />
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500/90 text-white">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Trust badges row */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { icon: <FiShield size={14} />, label: 'Quality' },
              { icon: <FiTruck size={14} />, label: 'Delivery' },
              { icon: <FiTool size={14} />, label: 'Custom' },
            ].map((b, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center"
              >
                <span className="w-7 h-7 rounded-lg bg-cyan-400/[0.1] border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                  {b.icon}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════ */}
        {/* RIGHT — DETAILS */}
        {/* ═══════════════════════════════ */}
        <div className="space-y-6">

          {/* Title */}
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3">
              {product.name}
            </h1>

            {/* Rating placeholder */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} size={12} fill="currentColor" />
                ))}
              </div>
              <span>Premium Quality</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300">
              ₹{product.basePrice?.toLocaleString()}
            </span>
            <span className="text-sm text-slate-500">incl. all taxes</span>
          </div>

          {/* Description */}
          <p className="text-slate-300 leading-relaxed">
            {product.longDescription ||
              product.shortDescription ||
              'No description available'}
          </p>

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-3">
            {product.material && (
              <SpecCard label="Material" value={product.material} />
            )}
            {product.finish && (
              <SpecCard label="Finish" value={product.finish} />
            )}
            {product.leadTimeDays && (
              <SpecCard
                label="Lead Time"
                value={`${product.leadTimeDays} days`}
                icon={<FiClock size={12} />}
              />
            )}
            {product.unit && (
              <SpecCard label="Unit" value={product.unit} />
            )}
          </div>

          {/* Quantity + Add to cart */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
                <button
                  className="px-4 py-3 text-white hover:bg-white/[0.06] hover:text-cyan-400 transition-colors font-bold"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-5 text-white font-bold min-w-[48px] text-center">
                  {quantity}
                </span>
                <button
                  className="px-4 py-3 text-white hover:bg-white/[0.06] hover:text-cyan-400 transition-colors font-bold"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 font-bold text-sm shadow-[0_0_28px_-6px_rgba(34,211,238,0.7)] hover:shadow-[0_0_36px_-4px_rgba(99,102,241,0.9)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <FiShoppingCart size={16} />
                Add to Cart
              </button>
            </div>

            {/* Customize button */}
            <Link
              to={`/customize/${product.id}`}
              className="block text-center px-6 py-3.5 rounded-xl border border-white/[0.1] bg-white/[0.04] text-white font-semibold text-sm hover:bg-white/[0.08] hover:border-white/[0.2] transition-all"
            >
              <FiTool className="inline mr-2" size={14} />
              Customize This Product
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════ */}
      {/* REVIEWS SECTION */}
      {/* ═══════════════════════════════ */}
      <div className="mt-20 pt-12 border-t border-white/[0.08]">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-cyan-400 border border-cyan-400/20 bg-cyan-400/[0.05] rounded-full mb-3">
            Reviews
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Customer Reviews
          </h2>
        </div>

        {isAuthenticated ? (
          <ReviewForm productId={product.id} onSuccess={fetchProduct} />
        ) : (
          <div className="rounded-2xl border border-white/[0.06] bg-slate-900/40 backdrop-blur-xl p-6 text-center">
            <p className="text-slate-300">
              <Link
                to="/login"
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
              >
                Login
              </Link>{' '}
              to write a review
            </p>
          </div>
        )}

        <div className="mt-8">
          <ReviewsList productId={product.id} />
        </div>
      </div>
    </div>
  )
}

/* ---------- Spec Card Helper ---------- */
function SpecCard({ label, value, icon }) {
  return (
    <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all">
      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className="text-white font-semibold text-sm">{value}</p>
    </div>
  )
}

export default ProductDetailPage