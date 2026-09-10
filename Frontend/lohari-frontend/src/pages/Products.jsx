import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiShoppingCart } from 'react-icons/fi'
import { getProducts, searchProducts } from '../api/product'
import { useCart } from '../context/CartContext'  // ✅ ADD THIS
import Loading from '../components/common/Loading'
import toast from 'react-hot-toast'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searching, setSearching] = useState(false)
  const { addToCart } = useCart()  // ✅ ADD THIS

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      console.log('🔄 Fetching products...')
      const data = await getProducts()
      console.log('📦 Full API Response:', JSON.stringify(data, null, 2))
      
      let productList = []
      if (data && data.content && Array.isArray(data.content)) {
        productList = data.content
        console.log('✅ Found products in content array:', productList.length)
      } else if (Array.isArray(data)) {
        productList = data
        console.log('✅ Data is array:', productList.length)
      } else {
        console.log('⚠️ Unknown data format. Full data:', data)
        productList = []
      }
      
      console.log('📦 Final products list:', productList)
      setProducts(productList)
    } catch (error) {
      console.error('❌ Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

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
    console.log('🛒 Adding to cart:', product)
    addToCart({
      id: product.id,
      name: product.name,
      price: product.basePrice || product.price,
      image: product.thumbnailUrl || product.mainImageUrl,
      slug: product.slug
    }, 1)
  }

  if (loading) return <Loading />

  return (
    <div className="container-custom py-20">
      <h1 className="section-title">Our Products</h1>
      <p className="section-subtitle">Browse our collection of custom fabricated products</p>

      {/* Search */}
      <div className="relative max-w-md mb-8">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          placeholder="Search products..."
          className="input-field pl-12"
          value={search}
          onChange={handleSearch}
        />
        {searching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="text-center text-white/60 py-12">
          <p className="text-xl">No products found</p>
          <p className="text-sm mt-2">Try adding products from backend</p>
          <button 
            onClick={fetchProducts}
            className="btn-primary mt-4 text-sm"
          >
            Refresh Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="glass rounded-2xl overflow-hidden card-3d group">
              <div className="relative overflow-hidden h-56">
                <img 
                  src={product.thumbnailUrl || product.mainImageUrl || 'https://via.placeholder.com/300x200'} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 glass px-3 py-1 rounded-full text-xs text-white">
                  {product.category?.name || 'General'}
                </div>
                {product.isFeatured && (
                  <div className="absolute top-3 left-3 glass px-3 py-1 rounded-full text-xs text-yellow-400">
                    ⭐ Featured
                  </div>
                )}
              </div>
              <div className="p-5 space-y-3">
                <h3 className="text-lg font-semibold text-white group-hover:text-secondary transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-400">
                  ₹{product.basePrice?.toLocaleString() || product.price?.toLocaleString() || '0'}
                </p>
                <div className="flex gap-2">
                  <Link 
                    to={`/products/${product.slug}`}
                    className="flex-1 btn-primary text-center text-sm"
                  >
                    View Details
                  </Link>
                  <button 
                    className="glass px-3 py-2 rounded-xl hover:bg-white/20 transition-colors"
                    onClick={() => handleAddToCart(product)}
                  >
                    <FiShoppingCart className="text-white" />
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