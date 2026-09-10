import React, { useState } from 'react'
import axios from '../../api/axios'
import toast from 'react-hot-toast'
import { FiStar } from 'react-icons/fi'

function ReviewForm({ productId, onSuccess }) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    try {
      setLoading(true)
      await axios.post('/reviews', {
        productId: productId,
        rating: rating,
        title: title,
        comment: comment
      })

      toast.success('Review submitted! Waiting for admin approval.')
      setRating(0)
      setTitle('')
      setComment('')
      onSuccess && onSuccess()
    } catch (error) {
      console.error('Review error:', error)
      toast.error(error.response?.data?.message || 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass p-6 rounded-2xl">
      <h3 className="text-xl font-semibold text-white mb-4">Write a Review</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Stars */}
        <div>
          <label className="block text-white/70 text-sm mb-2">Your Rating *</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform hover:scale-110"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <FiStar
                  size={32}
                  fill={(hoverRating || rating) >= star ? '#F39C12' : 'none'}
                  stroke={(hoverRating || rating) >= star ? '#F39C12' : '#4a5568'}
                  className="transition-colors"
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="text-white/50 text-sm ml-2">
                {rating} / 5 stars
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-white/70 text-sm mb-1">Review Title</label>
          <input
            type="text"
            className="input-field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience"
            required
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-white/70 text-sm mb-1">Your Review</label>
          <textarea
            className="input-field"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            required
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  )
}

export default ReviewForm