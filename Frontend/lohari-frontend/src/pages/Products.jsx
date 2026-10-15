import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiShoppingCart, FiStar, FiTrendingUp } from 'react-icons/fi'
import { getProducts, searchProducts } from '../api/product'
import { useCart } from '../context/CartContext'
import Loading from '../components/common/Loading'
import toast from 'react-hot-toast'

const normalizeProducts = (data) => {
  if (Array.isArray(data?.content)) return data.content
  return Array.isArray(data) ? data : []
}

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searching, setSearching] = useState(false)
  const { addToCart } = useCart()

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      console.log('🔄 Fetching products...')
      const data = await getProducts()
      console.log('📦 Full API Response:', JSON.stringify(data, null, 2))

      setProducts(normalizeProducts(data))
    } catch (error) {
      console.error('❌ Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    getProducts()
      .then((data) => {
        if (active) setProducts(normalizeProducts(data))
      })
      .catch((error) => {
        if (!active) return
        console.error('❌ Error fetching products:', error)
        toast.error('Failed to load products')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const handleSearch = async (e) => {
    const keyword = e.target.value
    setSearch(keyword)

    if (keyword.trim().length === 0) {
      fetchProducts()
      return
    }

    if (keyword.trim().length < 2) return

    try {
      setSearching(true)
      const data = await searchProducts(keyword)
      const productList = data.content || data || []
      setProducts(productList)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setSearching(false)
    }
  }

  const handleAddToCart = (product) => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.basePrice || product.price,
        image: product.thumbnailUrl || product.mainImageUrl,
        slug: product.slug,
      },
      1
    )
    toast.success('Added to cart!')
  }

  if (loading) return <Loading />

  return (
    <div className="container-custom py-20 pt-28">
      {/* ═══════════════════════════════════════ */}
      {/* HEADER */}
      {/* ═══════════════════════════════════════ */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-cyan-400 border border-cyan-400/20 bg-cyan-400/[0.05] rounded-full mb-4">
              Collection
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
              Our Products
            </h1>
            <p className="text-slate-400 text-lg">
              Browse our collection of custom fabricated products
            </p>
          </div>

          <div className="text-sm text-slate-500">
            <span className="text-cyan-400 font-bold text-2xl">{products.length}</span>
            <span className="ml-1">products</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <FiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            size={18}
          />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.05] transition-all"
            value={search}
            onChange={handleSearch}
          />
          {searching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════ */}
      {/* PRODUCT GRID */}
      {/* ═══════════════════════════════════════ */}
      {products.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-white/[0.06] bg-slate-900/40 backdrop-blur-xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
            <FiSearch className="text-slate-500" size={24} />
          </div>
          <p className="text-xl font-bold text-white mb-2">No products found</p>
          <p className="text-sm text-slate-400 mb-6">
            Try adding products from backend
          </p>
          <button
            onClick={fetchProducts}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 font-bold text-sm shadow-[0_0_24px_-6px_rgba(34,211,238,0.7)] hover:shadow-[0_0_32px_-4px_rgba(99,102,241,0.9)] hover:scale-[1.03] active:scale-[0.98] transition-all"
          >
            Refresh Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-2xl overflow-hidden border border-white/[0.06] bg-slate-900/40 backdrop-blur-xl hover:border-white/[0.12] hover:bg-slate-900/60 hover:shadow-[0_20px_60px_-20px_rgba(34,211,238,0.3)] transition-all duration-300"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-56 bg-slate-950">
                <img
                  src={
                    product.thumbnailUrl ||
                    product.mainImageUrl ||
                    'https://via.placeholder.com/300x200'
                  }
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Category badge */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/70 backdrop-blur-xl border border-white/[0.1] text-slate-200">
                  {product.category?.name || 'General'}
                </div>

                {/* Featured badge */}
                {product.isFeatured && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-[0_0_16px_-2px_rgba(251,191,36,0.7)]">
                    <FiStar size={10} />
                    Featured
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {product.name}
                </h3>

                <div className="flex items-end justify-between">
                  <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300">
                    ₹{product.basePrice?.toLocaleString() || product.price?.toLocaleString() || '0'}
                  </p>
                  {(product.isBestSeller || product.isNew) && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      <FiTrendingUp size={10} />
                      {product.isNew ? 'New' : 'Hot'}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <Link
                    to={`/products/${product.slug}`}
                    className="flex-1 text-center px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-semibold text-sm hover:bg-white/[0.08] hover:border-white/[0.16] transition-all"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 font-bold shadow-[0_0_20px_-6px_rgba(34,211,238,0.6)] hover:shadow-[0_0_28px_-4px_rgba(99,102,241,0.8)] hover:scale-[1.05] active:scale-[0.95] transition-all"
                    aria-label="Add to cart"
                  >
                    <FiShoppingCart size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Products