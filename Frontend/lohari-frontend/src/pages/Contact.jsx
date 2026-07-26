import React, { useState } from 'react'
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi'
import toast from 'react-hot-toast'
import axios from '../api/axios'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'general',
    message: '',
    preferredDate: '',
    preferredTime: '',
    address: ''
  })
  const [loading, setLoading] = useState(false)

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'fitting', label: '📏 Call for Fitting / Site Visit' },
    { value: 'custom', label: '🎨 Custom Design Request' },
    { value: 'quote', label: '💰 Request Quote' },
    { value: 'support', label: '🛠️ Support' }
  ]

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post('/inquiries', formData)
      toast.success('✅ Message sent! We will contact you soon.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'general',
        message: '',
        preferredDate: '',
        preferredTime: '',
        address: ''
      })
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-custom py-20">
      <h1 className="section-title">Contact Us</h1>
      <p className="section-subtitle">Get in touch for custom fabrication, fitting, or any inquiries</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="glass p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-1">Inquiry Type *</label>
              <select
                name="inquiryType"
                className="input-field"
                value={formData.inquiryType}
                onChange={handleChange}
                required
              >
                {inquiryTypes.map((type) => (
                  <option key={type.value} value={type.value} className="text-gray-900">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-1">Full Name *</label>
              <input
                name="name"
                type="text"
                className="input-field"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">Email *</label>
                <input
                  name="email"
                  type="email"
                  className="input-field"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">Phone *</label>
                <input
                  name="phone"
                  type="tel"
                  className="input-field"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="9876543210"
                />
              </div>
            </div>

            {formData.inquiryType === 'fitting' && (
              <div className="glass p-4 rounded-xl border border-secondary/30">
                <p className="text-secondary font-semibold mb-3">📏 Site Visit / Fitting Request</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Preferred Date</label>
                    <input
                      name="preferredDate"
                      type="date"
                      className="input-field"
                      value={formData.preferredDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Preferred Time</label>
                    <input
                      name="preferredTime"
                      type="time"
                      className="input-field"
                      value={formData.preferredTime}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">Site Address</label>
                  <textarea
                    name="address"
                    className="input-field"
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Enter site address for fitting"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-white/70 text-sm font-medium mb-1">Message *</label>
              <textarea
                name="message"
                rows="4"
                className="input-field"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell us about your project..."
              />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Sending...' : <span className="flex items-center justify-center gap-2"><FiSend /> Send Message</span>}
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Reach Us</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white/60">
                <FiMapPin className="text-secondary text-xl" />
                <span>123 Industrial Area, City, State - 123456</span>
              </div>
              <div className="flex items-center gap-3 text-white/60">
                <FiPhone className="text-secondary text-xl" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-white/60">
                <FiMail className="text-secondary text-xl" />
                <span>info@lohari.com</span>
              </div>
              <div className="flex items-center gap-3 text-white/60">
                <FiClock className="text-secondary text-xl" />
                <span>Mon-Sat: 9AM - 6PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact