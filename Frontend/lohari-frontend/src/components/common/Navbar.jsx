import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiChevronDown, FiPackage, FiSettings, FiShield } from 'react-icons/fi'

function Navbar() {
  const { user, logout } = useAuth()
  const { getTotalItems } = useCart()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setIsDropdownOpen(false)
  }

  // ✅ HIDE NAVBAR ON ADMIN ROUTES - Using window.location
  if (window.location.pathname.startsWith('/admin')) {
    return null
  }

  return (
    <nav className="fixed w-full top-0 z-50 glass-dark border-b border-white/10">
      <div className="container-custom">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-purple-500 
                          flex items-center justify-center text-xl font-bold text-white
                          shadow-[0_0_30px_rgba(230,126,34,0.3)] group-hover:scale-110 transition-transform">
              L
            </div>
            <span className="text-2xl font-bold text-white group-hover:text-secondary transition-colors">
              Lohari
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-white/70 hover:text-white hover:scale-105 transition-all">
              Products
            </Link>
            <Link to="/about" className="text-white/70 hover:text-white hover:scale-105 transition-all">
              About
            </Link>
            <Link to="/contact" className="text-white/70 hover:text-white hover:scale-105 transition-all">
              Contact
            </Link>

            {user ? (
              <>
                <Link to="/orders" className="text-white/70 hover:text-white hover:scale-105 transition-all">
                  <FiPackage size={20} className="inline mr-1" /> Orders
                </Link>
                
                {/* ✅ Admin Link - Only for ADMIN users */}
                {user.role === 'ADMIN' && (
                  <Link 
                    to="/admin/dashboard" 
                    className="text-white/70 hover:text-white hover:scale-105 transition-all flex items-center gap-1"
                  >
                    <FiShield size={18} className="text-secondary" /> Admin
                  </Link>
                )}
                
                <Link to="/cart" className="text-white/70 hover:text-white hover:scale-105 transition-all relative">
                  <FiShoppingCart size={24} />
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-secondary to-orange-500 
                   text-white text-xs rounded-full w-5 h-5 flex items-center justify-center
                   shadow-[0_0_20px_rgba(230,126,34,0.5)]">
                    {getTotalItems() || 0}
                  </span>
                </Link>
                
                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-purple-500 
                                  flex items-center justify-center text-white text-sm font-semibold">
                      {user.fullName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden lg:inline">{user.fullName || user.email}</span>
                    <FiChevronDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 glass rounded-xl shadow-2xl border border-white/10 py-2">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-white font-semibold">{user.fullName || 'User'}</p>
                        <p className="text-white/50 text-sm">{user.email}</p>
                      </div>
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-3 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FiUser /> Profile
                      </Link>
                      <Link 
                        to="/orders" 
                        className="flex items-center gap-3 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FiPackage /> My Orders
                      </Link>
                      <Link 
                        to="/settings" 
                        className="flex items-center gap-3 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FiSettings /> Settings
                      </Link>
                      <div className="border-t border-white/10 my-1"></div>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors w-full"
                      >
                        <FiLogOut /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-primary text-sm px-6 py-2">
                  Login
                </Link>
                <Link to="/register" className="btn-secondary text-sm px-6 py-2">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden glass-dark border-t border-white/10 py-6 space-y-4">
            <Link to="/products" className="block text-white/70 hover:text-white px-4 py-2" onClick={() => setIsMenuOpen(false)}>
              Products
            </Link>
            <Link to="/about" className="block text-white/70 hover:text-white px-4 py-2" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link to="/contact" className="block text-white/70 hover:text-white px-4 py-2" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            {user ? (
              <>
                <div className="px-4 py-2 border-t border-white/10">
                  <p className="text-white font-semibold">{user.fullName || 'User'}</p>
                  <p className="text-white/50 text-sm">{user.email}</p>
                </div>
                <Link to="/orders" className="block text-white/70 hover:text-white px-4 py-2" onClick={() => setIsMenuOpen(false)}>
                  <FiPackage className="inline mr-2" /> My Orders
                </Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin/dashboard" className="block text-white/70 hover:text-white px-4 py-2" onClick={() => setIsMenuOpen(false)}>
                    <FiShield className="inline mr-2 text-secondary" /> Admin Panel
                  </Link>
                )}
                <Link to="/profile" className="block text-white/70 hover:text-white px-4 py-2" onClick={() => setIsMenuOpen(false)}>
                  <FiUser className="inline mr-2" /> Profile
                </Link>
                <button onClick={handleLogout} className="block text-red-400 hover:text-red-300 px-4 py-2 w-full text-left">
                  <FiLogOut className="inline mr-2" /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-3 px-4">
                <Link to="/login" className="btn-primary text-center" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn-secondary text-center" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar