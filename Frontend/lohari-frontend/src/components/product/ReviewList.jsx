import { useState, useEffect, useCallback } from 'react'
import axios from '../../api/axios'
import RatingStars from './RatingStars'
import { FiCheckCircle, FiClock } from 'react-icons/fi'

function ReviewsList({ productId }) {
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [loading, setLoading] = useState(true)

  // ✅ Define fetchReviews FIRST using useCallback
  const fetchReviews = useCallback(async () => {
    if (!productId) return
    
    try {
      setLoading(true)
      const response = await axios.get(`/reviews/product/${productId}`)
      setReviews(response.data.reviews || [])
      setAverageRating(response.data.averageRating || 0)
      setTotalReviews(response.data.totalReviews || 0)
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setReviews([])
      setAverageRating(0)
      setTotalReviews(0)
    } finally {
      setLoading(false)
    }
  }, [productId])

  // ✅ Then useEffect
  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  if (loading) {
    return (
      <div className="text-white/50 py-8 text-center">Loading reviews...</div>
    )
  }

  if (totalReviews === 0) {
    return (
      <div className="glass p-8 rounded-2xl text-center">
        <div className="text-5xl mb-4">⭐</div>
        <h3 className="text-2xl font-semibold text-white mb-2">No Reviews Yet</h3>
        <p className="text-white/50">Be the first to review this product!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="glass p-6 rounded-2xl">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-secondary">{averageRating.toFixed(1)}</div>
            <RatingStars rating={averageRating} size={20} />
            <span className="text-white/50 text-sm">({totalReviews} reviews)</span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="glass p-6 rounded-2xl">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-purple-500 
                                flex items-center justify-center text-white text-sm font-semibold">
                    {review.user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className="text-white font-semibold">
                    {review.user?.fullName || 'Anonymous'}
                  </span>
                  {review.isVerifiedPurchase && (
                    <span className="flex items-center gap-1 text-green-400 text-xs">
                      <FiCheckCircle size={12} /> Verified Purchase
                    </span>
                  )}
                </div>
                <RatingStars rating={review.rating} size={16} />
              </div>
              <span className="text-white/40 text-sm flex items-center gap-1">
                <FiClock size={12} />
                {new Date(review.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>

            {review.title && (
              <h4 className="text-white font-semibold mt-2">{review.title}</h4>
            )}
            <p className="text-white/70 mt-2">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReviewsList