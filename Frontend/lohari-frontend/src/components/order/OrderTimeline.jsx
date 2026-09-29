import React from 'react'
import { 
  FiPackage, FiClock, FiCheckCircle, FiXCircle, FiTruck, 
  FiTool, FiDollarSign, FiMapPin, FiCalendar 
} from 'react-icons/fi'

function OrderTimeline({ tracking = [] }) {
  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return <FiClock className="text-yellow-400 text-xl" />
      case 'QUOTE_SENT': return <FiDollarSign className="text-blue-400 text-xl" />
      case 'QUOTE_ACCEPTED': return <FiCheckCircle className="text-green-400 text-xl" />
      case 'SITE_VISIT_SCHEDULED': return <FiMapPin className="text-purple-400 text-xl" />
      case 'SITE_VISIT_COMPLETED': return <FiMapPin className="text-purple-500 text-xl" />
      case 'ADVANCE_PAID': return <FiDollarSign className="text-green-400 text-xl" />
      case 'FABRICATION_STARTED': return <FiTool className="text-orange-400 text-xl" />
      case 'FABRICATION_IN_PROGRESS': return <FiTool className="text-orange-500 text-xl" />
      case 'FABRICATION_COMPLETE': return <FiTool className="text-green-400 text-xl" />
      case 'DELIVERY_SCHEDULED': return <FiTruck className="text-blue-400 text-xl" />
      case 'DELIVERED': return <FiCheckCircle className="text-green-400 text-xl" />
      case 'COMPLETED': return <FiCheckCircle className="text-green-500 text-xl" />
      case 'CANCELLED': return <FiXCircle className="text-red-400 text-xl" />
      default: return <FiPackage className="text-white/50 text-xl" />
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'text-yellow-400 bg-yellow-400/10'
      case 'QUOTE_SENT': return 'text-blue-400 bg-blue-400/10'
      case 'QUOTE_ACCEPTED': return 'text-green-400 bg-green-400/10'
      case 'SITE_VISIT_SCHEDULED': return 'text-purple-400 bg-purple-400/10'
      case 'SITE_VISIT_COMPLETED': return 'text-purple-500 bg-purple-500/10'
      case 'ADVANCE_PAID': return 'text-green-400 bg-green-400/10'
      case 'FABRICATION_STARTED': return 'text-orange-400 bg-orange-400/10'
      case 'FABRICATION_IN_PROGRESS': return 'text-orange-500 bg-orange-500/10'
      case 'FABRICATION_COMPLETE': return 'text-green-400 bg-green-400/10'
      case 'DELIVERY_SCHEDULED': return 'text-blue-400 bg-blue-400/10'
      case 'DELIVERED': return 'text-green-400 bg-green-400/10'
      case 'COMPLETED': return 'text-green-500 bg-green-500/10'
      case 'CANCELLED': return 'text-red-400 bg-red-400/10'
      default: return 'text-white/50 bg-white/5'
    }
  }

  if (tracking.length === 0) {
    return (
      <div className="glass p-8 rounded-2xl text-center">
        <FiPackage className="text-5xl text-white/30 mx-auto mb-4" />
        <p className="text-white/50">No tracking updates yet</p>
      </div>
    )
  }

  return (
    <div className="glass p-6 rounded-2xl">
      <h3 className="text-xl font-semibold text-white mb-6">Order Journey</h3>
      
      <div className="relative">
        {tracking.map((item, index) => (
          <div key={index} className="relative pl-12 pb-8 last:pb-0">
            {/* Vertical Line */}
            {index !== tracking.length - 1 && (
              <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-white/10" />
            )}
            
            {/* Icon */}
            <div className="absolute left-0 top-0 w-10 h-10 rounded-full glass flex items-center justify-center">
              {getStatusIcon(item.status)}
            </div>
            
            {/* Content */}
            <div className="glass p-4 rounded-xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status?.replace(/_/g, ' ')}
                </span>
                {item.updatedBy && (
                  <span className="text-white/40 text-xs">
                    by {item.updatedBy}
                  </span>
                )}
              </div>
              
              <p className="text-white mt-2">{item.description}</p>
              
              {item.location && (
                <p className="text-white/50 text-sm mt-1 flex items-center gap-1">
                  <FiMapPin size={12} /> {item.location}
                </p>
              )}
              
              <p className="text-white/40 text-xs mt-2 flex items-center gap-1">
                <FiCalendar size={12} />
                {new Date(item.timestamp).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrderTimeline