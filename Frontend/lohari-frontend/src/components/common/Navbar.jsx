import React, { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import NotificationBell from './NotificationBell'
import {
  FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX,
  FiChevronDown, FiPackage, FiSettings, FiShield,
  FiBarChart2, FiCpu,
  FiSearch, FiPlus, FiEye, FiUsers, FiGrid, FiTruck,
} from 'react-icons/fi'

function Navbar() {
  const { user, logout } = useAuth()
  const { getTotalItems } = useCart()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef(null)

  const isAdmin = user?.role === 'ADMIN'

  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsDropdownOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
    setIsDropdownOpen(false)
    setIsMenuOpen(false)
  }

  const closeMenu = () => setIsMenuOpen(false)

  const navLinkClass = ({ isActive }) =>
    `relative px-4 py-2 rounded-xl text-[13px] font-semibold tracking-wide transition-all duration-200 ${
      isActive
        ? 'text-white bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
    }`

  const cartCount = getTotalItems?.() || 0

  return (
    <>
      {/* ═══════════════════════════════════════ */}
      {/* FULL WIDTH NAVBAR — EDGE TO EDGE */}
      {/* ═══════════════════════════════════════ */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? 'bg-slate-950/90 border-white/[0.08] shadow-[0_8px_32px_-12px_rgba(34,211,238,0.3)] backdrop-blur-2xl'
            : 'bg-slate-950/70 border-white/[0.05] backdrop-blur-xl'
        }`}
      >
        <div className="px-4 sm:px-6 md:px-8 lg:px-12">
          <div className={`flex justify-between items-center transition-all duration-300 ${scrolled ? 'h-14' : 'h-16'}`}>

            {/* ---------- LOGO ---------- */}
            <Link to="/" className="group flex items-center gap-2.5">
              <span className="text-[22px] font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-cyan-200 group-hover:to-indigo-300 transition-all duration-300">
                Lohari
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-400/20">
                Fab
              </span>
              {isAdmin && (
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md bg-amber-500/15 text-amber-300 border border-amber-400/25">
                  Admin
                </span>
              )}
            </Link>

            {/* ---------- DESKTOP MENU ---------- */}
            <div className="hidden md:flex items-center gap-1">
              {isAdmin ? (
                <>
                  {/* ---- ADMIN LINKS ---- */}
                  <NavLink to="/admin/dashboard" className={navLinkClass}>Dashboard</NavLink>
                  <NavLink to="/admin/products"  className={navLinkClass}>Products</NavLink>
                  <NavLink to="/admin/orders"    className={navLinkClass}>Orders</NavLink>
                  <NavLink to="/admin/users"     className={navLinkClass}>Users</NavLink>
                  <NavLink to="/analytics"       className={navLinkClass}>Analytics</NavLink>
                  <NavLink to="/ai-assistant"    className={navLinkClass}>AI</NavLink>

                  <div className="w-px h-5 bg-white/[0.08] mx-2" />

                  {/* ---- SEARCH ---- */}
                  <div className="hidden lg:flex items-center gap-2 px-3 h-9 rounded-xl border border-white/[0.08] bg-white/[0.02] focus-within:border-cyan-400/40 transition-all">
                    <FiSearch size={14} className="text-slate-500" />
                    <input
                      placeholder="Search…"
                      className="bg-transparent outline-none text-[12px] text-white placeholder:text-slate-500 w-40 xl:w-56"
                    />
                    <kbd className="hidden xl:inline text-[9px] px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-400">⌘K</kbd>
                  </div>

                  {/* ---- VIEW STORE ---- */}
                  <Link
                    to="/"
                    className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium text-slate-300 border border-white/[0.08] hover:text-white hover:bg-white/[0.05] transition-all"
                  >
                    <FiEye size={14} /> Store
                  </Link>

                  {/* ---- NOTIFICATIONS (NEW COMPONENT) ---- */}
                  <NotificationBell />

                  {/* ---- NEW PRODUCT ---- */}
                  <Link
                    to="/admin/products/new"
                    className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-indigo-400 hover:scale-[1.03] active:scale-[0.98] transition-all"
                  >
                    <FiPlus size={14} /> New
                  </Link>

                  {/* ---- PROFILE DROPDOWN ---- */}
                  <div className="relative ml-1.5" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="group flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-cyan-400/30 hover:bg-white/[0.05] transition-all duration-200"
                    >
                      <div className="relative">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-[11px] font-bold text-white shadow-[0_0_12px_-2px_rgba(34,211,238,0.6)]">
                          {user.fullName?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                      </div>
                      <span className="hidden lg:inline text-[12px] font-medium text-slate-300 max-w-[100px] truncate">
                        {user.fullName || user.email}
                      </span>
                      <FiChevronDown
                        size={13}
                        className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-cyan-400' : 'group-hover:text-slate-200'}`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2.5 w-[260px] rounded-2xl overflow-hidden bg-slate-950/95 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6),0_0_40px_-10px_rgba(34,211,238,0.2)]">
                        <div className="relative px-4 py-3.5 border-b border-white/[0.06] overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-transparent" />
                          <div className="relative flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-[13px] font-bold text-white">
                              {user.fullName?.charAt(0) || user.email?.charAt(0) || 'U'}
                            </div>
                            <div className="min-w-0">
                              <p className="text-white text-[13px] font-semibold truncate">
                                {user.fullName || 'User'}
                              </p>
                              <p className="text-slate-400 text-[11px] truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-1.5">
                          <DropdownItem to="/profile"  icon={<FiUser size={15} />}     onNav={() => setIsDropdownOpen(false)}>Profile</DropdownItem>
                          <DropdownItem to="/settings" icon={<FiSettings size={15} />} onNav={() => setIsDropdownOpen(false)}>Settings</DropdownItem>

                          <div className="my-1.5 mx-2 border-t border-white/[0.06]" />
                          <p className="px-3 pb-1 pt-0.5 text-[9px] uppercase tracking-[0.12em] text-slate-500 font-semibold">
                            Admin Tools
                          </p>
                          <DropdownItem to="/admin/dashboard" icon={<FiGrid size={15} />}       accent onNav={() => setIsDropdownOpen(false)}>Dashboard</DropdownItem>
                          <DropdownItem to="/admin/users"     icon={<FiUsers size={15} />}      accent onNav={() => setIsDropdownOpen(false)}>Users</DropdownItem>
                          <DropdownItem to="/analytics"       icon={<FiBarChart2 size={15} />}  accent onNav={() => setIsDropdownOpen(false)}>Analytics</DropdownItem>
                          <DropdownItem to="/ai-assistant"    icon={<FiCpu size={15} />}        accent onNav={() => setIsDropdownOpen(false)}>AI Assistant</DropdownItem>

                          <div className="my-1.5 mx-2 border-t border-white/[0.06]" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[13px] font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/[0.08] transition-colors"
                          >
                            <FiLogOut size={15} /> Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : user ? (
                <>
                  {/* ---- CUSTOMER LINKS ---- */}
                  <NavLink to="/products" className={navLinkClass}>Products</NavLink>
                  <NavLink to="/about"    className={navLinkClass}>About</NavLink>
                  <NavLink to="/contact"  className={navLinkClass}>Contact</NavLink>
                  <NavLink to="/orders"   className={navLinkClass}>Orders</NavLink>

                  <div className="w-px h-5 bg-white/[0.08] mx-2" />

                  <Link
                    to="/cart"
                    className="group relative p-2.5 rounded-xl text-slate-300 border border-white/[0.08] bg-white/[0.02] hover:border-cyan-400/40 hover:text-white hover:bg-cyan-400/[0.06] hover:shadow-[0_0_20px_-6px_rgba(34,211,238,0.5)] transition-all duration-200"
                  >
                    <FiShoppingCart size={17} />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-gradient-to-br from-cyan-400 to-indigo-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center ring-[2.5px] ring-slate-950">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </Link>

                  <div className="relative ml-1.5" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="group flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-cyan-400/30 hover:bg-white/[0.05] transition-all duration-200"
                    >
                      <div className="relative">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-[11px] font-bold text-white shadow-[0_0_12px_-2px_rgba(34,211,238,0.6)]">
                          {user.fullName?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                      </div>
                      <span className="hidden lg:inline text-[12px] font-medium text-slate-300 max-w-[100px] truncate">
                        {user.fullName || user.email}
                      </span>
                      <FiChevronDown
                        size={13}
                        className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-cyan-400' : 'group-hover:text-slate-200'}`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2.5 w-[260px] rounded-2xl overflow-hidden bg-slate-950/95 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6),0_0_40px_-10px_rgba(34,211,238,0.2)]">
                        <div className="relative px-4 py-3.5 border-b border-white/[0.06] overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-transparent" />
                          <div className="relative flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-[13px] font-bold text-white">
                              {user.fullName?.charAt(0) || user.email?.charAt(0) || 'U'}
                            </div>
                            <div className="min-w-0">
                              <p className="text-white text-[13px] font-semibold truncate">
                                {user.fullName || 'User'}
                              </p>
                              <p className="text-slate-400 text-[11px] truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-1.5">
                          <DropdownItem to="/profile"  icon={<FiUser size={15} />}     onNav={() => setIsDropdownOpen(false)}>Profile</DropdownItem>
                          <DropdownItem to="/orders"   icon={<FiPackage size={15} />}  onNav={() => setIsDropdownOpen(false)}>My Orders</DropdownItem>
                          <DropdownItem to="/settings" icon={<FiSettings size={15} />} onNav={() => setIsDropdownOpen(false)}>Settings</DropdownItem>

                          <div className="my-1.5 mx-2 border-t border-white/[0.06]" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[13px] font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/[0.08] transition-colors"
                          >
                            <FiLogOut size={15} /> Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* ---- GUEST LINKS ---- */}
                  <NavLink to="/products" className={navLinkClass}>Products</NavLink>
                  <NavLink to="/about"    className={navLinkClass}>About</NavLink>
                  <NavLink to="/contact"  className={navLinkClass}>Contact</NavLink>

                  <div className="w-px h-5 bg-white/[0.08] mx-2" />

                  <Link
                    to="/login"
                    className="text-[13px] font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-xl hover:bg-white/[0.05] transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="relative text-[13px] font-bold text-slate-950 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 shadow-[0_0_20px_-4px_rgba(34,211,238,0.6)] hover:shadow-[0_0_28px_-2px_rgba(99,102,241,0.85)] hover:scale-[1.04] active:scale-[0.98] transition-all duration-200"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            <button
              className="md:hidden p-2 rounded-xl text-white border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={19} /> : <FiMenu size={19} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ---------- MOBILE OVERLAY ---------- */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* ---------- MOBILE DRAWER ---------- */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[85%] max-w-sm bg-slate-950/95 backdrop-blur-2xl border-l border-white/[0.08] md:hidden transition-transform duration-300 ease-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-cyan-400 to-indigo-500" />

        <div className="flex items-center justify-between px-5 h-20 border-b border-white/[0.08]">
          <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Menu
          </span>
          <button
            onClick={closeMenu}
            className="p-2 rounded-xl text-white border border-white/[0.08] hover:bg-white/[0.06] transition-all"
          >
            <FiX size={19} />
          </button>
        </div>

        <div className="p-4 space-y-0.5 overflow-y-auto h-[calc(100%-5rem)]">

          {isAdmin ? (
            <>
              {/* Admin user card */}
              <div className="pb-3">
                <div className="relative flex items-center gap-3 p-3 rounded-2xl border border-white/[0.08] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.08] to-indigo-500/[0.08]" />
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-white font-bold text-[14px]">
                    {user.fullName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <div className="relative min-w-0">
                    <p className="text-white text-[13px] font-semibold truncate">{user.fullName || 'User'}</p>
                    <p className="text-slate-400 text-[11px] truncate">{user.email}</p>
                  </div>
                </div>
              </div>

              <p className="pt-2 pb-1 px-3 text-[9px] uppercase tracking-[0.12em] text-slate-500 font-semibold">
                Admin
              </p>
              <MobileLink to="/admin/dashboard" icon={<FiGrid size={16} />}       onNav={closeMenu}>Dashboard</MobileLink>
              <MobileLink to="/admin/products"  icon={<FiPackage size={16} />}    onNav={closeMenu}>Products</MobileLink>
              <MobileLink to="/admin/orders"    icon={<FiTruck size={16} />}      onNav={closeMenu}>Orders</MobileLink>
              <MobileLink to="/admin/users"     icon={<FiUsers size={16} />}      onNav={closeMenu}>Users</MobileLink>

              <p className="pt-3 pb-1 px-3 text-[9px] uppercase tracking-[0.12em] text-slate-500 font-semibold">
                Tools
              </p>
              <MobileLink to="/analytics"       icon={<FiBarChart2 size={16} />}  onNav={closeMenu}>Analytics</MobileLink>
              <MobileLink to="/ai-assistant"    icon={<FiCpu size={16} />}        onNav={closeMenu}>AI Assistant</MobileLink>
              <MobileLink to="/"                icon={<FiEye size={16} />}        onNav={closeMenu}>View Store</MobileLink>

              <p className="pt-3 pb-1 px-3 text-[9px] uppercase tracking-[0.12em] text-slate-500 font-semibold">
                Account
              </p>
              <MobileLink to="/profile"  icon={<FiUser size={16} />}     onNav={closeMenu}>Profile</MobileLink>
              <MobileLink to="/settings" icon={<FiSettings size={16} />} onNav={closeMenu}>Settings</MobileLink>

              <div className="pt-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-4 py-3 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/[0.08] transition-colors font-semibold text-[13px]"
                >
                  <FiLogOut size={16} /> Logout
                </button>
              </div>
            </>
          ) : user ? (
            <>
              {/* Customer user card */}
              <div className="pb-3">
                <div className="relative flex items-center gap-3 p-3 rounded-2xl border border-white/[0.08] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.08] to-indigo-500/[0.08]" />
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-white font-bold text-[14px]">
                    {user.fullName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <div className="relative min-w-0">
                    <p className="text-white text-[13px] font-semibold truncate">{user.fullName || 'User'}</p>
                    <p className="text-slate-400 text-[11px] truncate">{user.email}</p>
                  </div>
                </div>
              </div>

              <MobileLink to="/products" onNav={closeMenu}>Products</MobileLink>
              <MobileLink to="/about"    onNav={closeMenu}>About</MobileLink>
              <MobileLink to="/contact"  onNav={closeMenu}>Contact</MobileLink>
              <MobileLink to="/orders"   icon={<FiPackage size={16} />}  onNav={closeMenu}>My Orders</MobileLink>
              <MobileLink to="/profile"  icon={<FiUser size={16} />}     onNav={closeMenu}>Profile</MobileLink>
              <MobileLink to="/settings" icon={<FiSettings size={16} />} onNav={closeMenu}>Settings</MobileLink>

              <div className="pt-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-4 py-3 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/[0.08] transition-colors font-semibold text-[13px]"
                >
                  <FiLogOut size={16} /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <MobileLink to="/products" onNav={closeMenu}>Products</MobileLink>
              <MobileLink to="/about"    onNav={closeMenu}>About</MobileLink>
              <MobileLink to="/contact"  onNav={closeMenu}>Contact</MobileLink>

              <div className="pt-4 space-y-2.5">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="block text-center py-3 rounded-xl border border-white/[0.1] text-white font-semibold text-[13px] hover:bg-white/[0.04] transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="block text-center py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 font-bold text-[13px] shadow-[0_0_20px_-4px_rgba(34,211,238,0.6)] transition-all"
                >
                  Register
                </Link>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  )
}

function DropdownItem({ to, icon, children, onNav, accent = false }) {
  return (
    <Link
      to={to}
      onClick={onNav}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
        accent
          ? 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/[0.08]'
          : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
      }`}
    >
      {icon} {children}
    </Link>
  )
}

function MobileLink({ to, icon, children, onNav }) {
  return (
    <NavLink
      to={to}
      onClick={onNav}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all duration-150 ${
          isActive
            ? 'text-white bg-gradient-to-r from-cyan-500/[0.12] to-indigo-500/[0.12] ring-1 ring-cyan-400/20'
            : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
        }`
      }
    >
      {icon} {children}
    </NavLink>
  )
}

export default Navbar