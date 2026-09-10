import { FiStar } from 'react-icons/fi'  // ✅ Only import FiStar

function RatingStars({ rating, size = 20, color = '#F39C12', showText = false }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  const renderStars = () => {
    const stars = []

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FiStar key={`full-${i}`} size={size} fill={color} stroke={color} />
      )
    }

    // Half star - using FiStar with gradient clip
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative" style={{ width: size, height: size }}>
          <FiStar 
            size={size} 
            fill="none" 
            stroke={color}
            className="absolute inset-0"
          />
          <div 
            className="absolute inset-0 overflow-hidden" 
            style={{ width: '50%' }}
          >
            <FiStar 
              size={size} 
              fill={color} 
              stroke={color}
            />
          </div>
        </div>
      )
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FiStar key={`empty-${i}`} size={size} stroke="#4a5568" />
      )
    }

    return stars
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {renderStars()}
      </div>
      {showText && (
        <span className="text-white/50 text-sm ml-2">
          {rating.toFixed(1)} / 5
        </span>
      )}
    </div>
  )
}

export default RatingStars