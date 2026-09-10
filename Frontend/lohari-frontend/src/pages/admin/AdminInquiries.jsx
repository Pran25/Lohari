import React, { useState, useEffect } from 'react'
import axios from '../../api/axios'
import toast from 'react-hot-toast'
import Loading from '../../components/common/Loading'
import { FiMail, FiPhone, FiCalendar, FiTrash2, FiCheckCircle } from 'react-icons/fi'

function AdminInquiries() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      console.log('📊 Fetching inquiries...')
      
      // ✅ API CALL - Make sure this matches backend
      const response = await axios.get('/inquiries/admin/all')
      console.log('📦 Inquiries response:', response.data)
      
      setInquiries(response.data || [])
    } catch (error) {
      console.error('❌ Error fetching inquiries:', error)
      toast.error('Failed to load inquiries')
      setInquiries([])
    } finally {
      setLoading(false)
    }
  }

  const deleteInquiry = async (id) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return
    try {
      await axios.delete(`/inquiries/admin/${id}`)
      toast.success('Inquiry deleted!')
      fetchInquiries()
    } catch (error) {
      toast.error('Failed to delete inquiry')
    }
  }

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/inquiries/admin/${id}/read`)
      toast.success('Marked as read!')
      fetchInquiries()
    } catch (error) {
      toast.error('Failed to update')
    }
  }

  const getInquiryTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'fitting': return 'text-purple-400 bg-purple-400/10'
      case 'custom': return 'text-blue-400 bg-blue-400/10'
      case 'quote': return 'text-yellow-400 bg-yellow-400/10'
      case 'support': return 'text-red-400 bg-red-400/10'
      default: return 'text-white/50 bg-white/5'
    }
  }

  const getInquiryTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'fitting': return '📏'
      case 'custom': return '🎨'
      case 'quote': return '💰'
      case 'support': return '🛠️'
      default: return '📬'
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">📬 User Queries</h1>

      {inquiries.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-2xl font-semibold text-white mb-2">No Queries Yet</h3>
          <p className="text-white/50">User queries will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="glass p-6 rounded-2xl hover:shadow-xl transition-all">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getInquiryTypeColor(inquiry.inquiryType)}`}>
                      {getInquiryTypeIcon(inquiry.inquiryType)} {inquiry.inquiryType || 'General'}
                    </span>
                    {!inquiry.isRead && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-white">
                        New
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-semibold text-lg mt-2">{inquiry.name}</h3>
                  <div className="flex flex-wrap gap-4 mt-1 text-white/50 text-sm">
                    <span className="flex items-center gap-1"><FiMail /> {inquiry.email}</span>
                    <span className="flex items-center gap-1"><FiPhone /> {inquiry.phone}</span>
                    <span className="flex items-center gap-1"><FiCalendar /> {new Date(inquiry.createdAt).toLocaleDateString()}</span>
                  </div>
                  {inquiry.preferredDate && (
                    <div className="mt-2 text-white/40 text-sm">
                      <span className="flex items-center gap-1"><FiCalendar /> Preferred: {inquiry.preferredDate} {inquiry.preferredTime}</span>
                    </div>
                  )}
                  <p className="text-white/70 mt-3 bg-white/5 p-3 rounded-xl">{inquiry.message}</p>
                </div>
                <div className="flex gap-2">
                  {!inquiry.isRead && (
                    <button
                      className="glass p-2 rounded-xl text-green-400 hover:text-green-300 hover:bg-white/10 transition-colors"
                      onClick={() => markAsRead(inquiry.id)}
                      title="Mark as read"
                    >
                      <FiCheckCircle size={20} />
                    </button>
                  )}
                  <button
                    className="glass p-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors"
                    onClick={() => deleteInquiry(inquiry.id)}
                    title="Delete"
                  >
                    <FiTrash2 size={20} />
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

export default AdminInquiries