import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FcGoogle } from 'react-icons/fc'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
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
          <h2 className="text-3xl font-bold text-white mt-4">Welcome Back</h2>
          <p className="text-white/50">Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Google Login Button */}
        <div className="mt-6">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/10 w-full absolute"></div>
            <span className="bg-transparent px-4 text-white/40 text-sm relative">OR</span>
          </div>
          
          <button
            onClick={handleGoogleLogin}
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
            Don't have an account?{' '}
            <Link to="/register" className="text-secondary hover:text-orange-400 transition-colors">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login