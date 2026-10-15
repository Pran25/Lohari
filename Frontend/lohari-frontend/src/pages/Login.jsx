import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FcGoogle } from 'react-icons/fc'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const submitting = useRef(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting.current) return

    submitting.current = true
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch {
      // Error handled in context
    } finally {
      submitting.current = false
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8081/oauth2/authorization/google'
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 shadow-2xl">
          <div className="aspect-video bg-slate-950">
            <video
              autoPlay
              loop
              muted
              playsInline
              controls
              poster="/images/LohariAdvertisement.png"
              className="h-full w-full object-cover"
            >
              <source src="/videos/LOHARI_modern_fabrication_ad.mp4" type="video/mp4" />
              Your browser does not support embedded videos.
            </video>
          </div>
          <div className="p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
              Lohari Fabrication
            </p>
            <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              See what we can create for you.
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Watch our fabrication film, then sign in to explore the collection and start your project.
            </p>
          </div>
        </section>

        <div className="glass p-8 rounded-2xl max-w-md w-full card-3d justify-self-center">
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
    </div>
  )
}

export default Login