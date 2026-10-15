import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiCheckCircle,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import axios from '../api/axios'

const today = new Date()
const todayDate = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, '0'),
  String(today.getDate()).padStart(2, '0'),
].join('-')

const createInitialFormData = (inquiryType) => ({
  name: '',
  email: '',
  phone: '',
  inquiryType,
  message: '',
  preferredDate: '',
  preferredTime: '',
  address: ''
})

function Contact() {
  const [searchParams] = useSearchParams()
  const requestedInquiryType = searchParams.get('type') === 'site-visit' ? 'fitting' : 'general'
  return (
    <ContactForm
      key={requestedInquiryType}
      initialInquiryType={requestedInquiryType}
    />
  )
}

function ContactForm({ initialInquiryType }) {
  const [formData, setFormData] = useState(() => createInitialFormData(initialInquiryType))
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
      const response = await axios.post('/inquiries', formData)
      const { customerEmailSent, adminEmailSent } = response.data
      if (customerEmailSent && adminEmailSent) {
        toast.success(formData.inquiryType === 'fitting'
          ? 'Site visit request sent! Confirmation emails were sent to you and our team.'
          : 'Message sent! Confirmation emails were sent to you and our team.')
      } else {
        const failedRecipients = [
          !customerEmailSent && 'you',
          !adminEmailSent && 'our team',
        ].filter(Boolean).join(' and ')
        toast.error(`Your request was saved, but the email to ${failedRecipients} could not be sent.`)
      }
      setFormData(createInitialFormData(formData.inquiryType))
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-custom py-20">
      <h1 className="section-title">
        {formData.inquiryType === 'fitting' ? 'Request a Site Visit' : 'Contact Us'}
      </h1>
      <p className="section-subtitle">
        {formData.inquiryType === 'fitting'
          ? 'Choose a convenient time and share the site address so our team can arrange a visit.'
          : 'Get in touch for custom fabrication, fitting, or any inquiries'}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="glass p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">
            {formData.inquiryType === 'fitting' ? 'Schedule Your Site Visit' : 'Send Us a Message'}
          </h2>
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
              <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/[0.08] via-indigo-400/[0.05] to-transparent p-5">
                <div className="mb-4 flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.1] text-cyan-300">
                    <FiMapPin size={18} />
                  </span>
                  <div>
                    <p className="font-semibold text-white">Plan your site visit</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">
                      Share your preferred date, time, and site address. Our team will get in touch to confirm the visit.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-white/70">Preferred Date *</label>
                    <input
                      name="preferredDate"
                      type="date"
                      className="input-field"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      min={todayDate}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-white/70">Preferred Time *</label>
                    <input
                      name="preferredTime"
                      type="time"
                      className="input-field"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-white/70">Site Address *</label>
                  <textarea
                    name="address"
                    className="input-field"
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Enter site address for fitting"
                    required
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
              />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Sending...' : (
                <span className="flex items-center justify-center gap-2">
                  <FiSend />
                  {formData.inquiryType === 'fitting' ? 'Request Site Visit' : 'Send Message'}
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          {formData.inquiryType === 'fitting' && (
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-indigo-500/[0.1] via-slate-900/70 to-slate-950 p-8">
              <h2 className="text-xl font-bold text-white">What happens next?</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Once you send your request, our team will review your details and contact you to confirm a suitable visit time.
              </p>
              <ul className="mt-5 space-y-3">
                {[
                  'We review your preferred date and time',
                  'Our team contacts you to confirm availability',
                  'We use your site address to plan the visit',
                ].map((step) => (
                  <li key={step} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <FiCheckCircle className="mt-0.5 shrink-0 text-cyan-300" size={16} />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="glass p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Reach Us</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white/60">
                <FiMapPin className="text-secondary text-xl" />
                <span>MIDC Road, Chalisgaon</span>
              </div>
              <div className="flex items-center gap-3 text-white/60">
                <FiPhone className="text-secondary text-xl" />
                <a href="tel:+919834276435" className="transition-colors hover:text-cyan-300">
                  +91 98342 76435
                </a>
              </div>
              <div className="flex items-center gap-3 text-white/60">
                <FiMail className="text-secondary text-xl" />
                <a href="mailto:lohari.orders@gmail.com" className="transition-colors hover:text-cyan-300">
                  lohari.orders@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-white/60">
                <FiClock className="text-secondary text-xl" />
                <span>Mon–Sat · 9AM – 6PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact