import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FcGoogle } from 'react-icons/fc'

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(formData)
      navigate('/login')
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleRegister = () => {
    window.location.href = 'http://localhost:8081/oauth2/authorization/google'
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="glass p-8 rounded-2xl max-w-md w-full card-3d">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-purple-500 
                        flex items-center justify-center text-2xl font-bold text-white mx-auto
                        shadow-[0_0_30px_rgba(230,126,34,0.3)]">
            L
          </div>
          <h2 className="text-3xl font-bold text-white mt-4">Create Account</h2>
          <p className="text-white/50">Join Lohari Fabrication</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-1">Full Name</label>
            <input
              name="fullName"
              type="text"
              className="input-field"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm font-medium mb-1">Email</label>
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
            <label className="block text-white/70 text-sm font-medium mb-1">Phone</label>
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
          <div>
            <label className="block text-white/70 text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              className="input-field"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* Google Register Button */}
        <div className="mt-6">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/10 w-full absolute"></div>
            <span className="bg-transparent px-4 text-white/40 text-sm relative">OR</span>
          </div>
          
          <button
            onClick={handleGoogleRegister}
            className="w-full mt-4 flex items-center justify-center gap-3 
                     glass px-4 py-3 rounded-xl 
                     text-white font-medium
                     hover:bg-white/20 transition-all duration-300
                     border border-white/20"
          >
            <FcGoogle size={24} />
            Continue with Google
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-white/50">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary hover:text-orange-400 transition-colors">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register