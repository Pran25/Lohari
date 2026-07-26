import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiShoppingCart, FiArrowLeft } from 'react-icons/fi'
import { getProductBySlug } from '../api/product'
import { useCart } from '../context/CartContext'
import Loading from '../components/common/Loading'
import toast from 'react-hot-toast'

function ProductDetailPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      console.log('🔄 Fetching product with slug:', slug)
      const data = await getProductBySlug(slug)
      console.log('📦 Product data:', data)
      setProduct(data)
    } catch (error) {
      console.error('❌ Error fetching product:', error)
      toast.error('Product not found')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      console.log('🛒 Adding to cart:', {
        id: product.id,
        name: product.name,
        price: product.basePrice,
        image: product.thumbnailUrl || product.mainImageUrl,
        slug: product.slug,
        quantity: quantity
      })
      addToCart({
        id: product.id,
        name: product.name,
        price: product.basePrice,
        image: product.thumbnailUrl || product.mainImageUrl,
        slug: product.slug
      }, quantity)
    }
  }

  if (loading) return <Loading />

  if (!product) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl text-white">Product not found</h2>
        <Link to="/products" className="btn-primary inline-block mt-4">
          <FiArrowLeft className="inline mr-2" /> Back to Products
        </Link>
      </div>
    )
  }

  return (
    <div className="container-custom py-20">
      <Link to="/products" className="text-white/60 hover:text-white transition-colors inline-flex items-center gap-2 mb-6">
        <FiArrowLeft /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="glass rounded-2xl overflow-hidden">
          <img 
            src={product.mainImageUrl || product.thumbnailUrl || 'https://via.placeholder.com/600x400'} 
            alt={product.name}
            className="w-full h-[400px] object-cover"
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white">{product.name}</h1>
          
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-400">
              ₹{product.basePrice?.toLocaleString()}
            </span>
            {product.isInStock && (
              <span className="glass px-3 py-1 rounded-full text-xs text-green-400">
                In Stock
              </span>
            )}
          </div>

          <p className="text-white/70 leading-relaxed">
            {product.longDescription || product.shortDescription || 'No description available'}
          </p>

          <div className="grid grid-cols-2 gap-4">
            {product.material && (
              <div className="glass p-3 rounded-xl">
                <p className="text-white/50 text-sm">Material</p>
                <p className="text-white">{product.material}</p>
              </div>
            )}
            {product.finish && (
              <div className="glass p-3 rounded-xl">
                <p className="text-white/50 text-sm">Finish</p>
                <p className="text-white">{product.finish}</p>
              </div>
            )}
            {product.leadTimeDays && (
              <div className="glass p-3 rounded-xl">
                <p className="text-white/50 text-sm">Lead Time</p>
                <p className="text-white">{product.leadTimeDays} days</p>
              </div>
            )}
            {product.unit && (
              <div className="glass p-3 rounded-xl">
                <p className="text-white/50 text-sm">Unit</p>
                <p className="text-white">{product.unit}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center glass rounded-xl">
              <button 
                className="px-4 py-2 text-white hover:text-secondary transition-colors"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="px-4 text-white">{quantity}</span>
              <button 
                className="px-4 py-2 text-white hover:text-secondary transition-colors"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            <button 
              onClick={handleAddToCart}
              className="btn-primary flex items-center gap-2"
            >
              <FiShoppingCart /> Add to Cart
            </button>
          </div>

          <Link 
            to={`/customize/${product.id}`}
            className="btn-secondary inline-block w-full text-center"
          >
            Customize This Product
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage