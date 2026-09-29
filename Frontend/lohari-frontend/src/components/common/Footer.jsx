import React from 'react'
import { Link } from 'react-router-dom'
import {
  FiMapPin, FiPhone, FiMail, FiClock,
  FiInstagram, FiFacebook, FiYoutube,
  FiArrowUpRight,
} from 'react-icons/fi'

function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/[0.08] bg-slate-950">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-cyan-500/[0.06] blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-80 w-80 rounded-full bg-indigo-500/[0.06] blur-[100px]" />

      {/* Top gradient line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

      <div className="relative container-custom pt-16 pb-8">
        {/* ---------- MAIN GRID ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* ---------- BRAND (4 cols) ---------- */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <span className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-indigo-300 transition-all">
                Lohari
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-400/20">
                Fab
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed mt-4 max-w-sm">
              Precision metal fabrication &amp; custom design. From gates to bespoke
              furniture — we engineer ideas into reality.
            </p>

            {/* Socials */}
            <div className="flex gap-2.5 mt-6">
              {[
                { icon: <FiInstagram size={16} />, label: 'Instagram' },
                { icon: <FiFacebook size={16} />, label: 'Facebook' },
                { icon: <FiYoutube size={16} />, label: 'YouTube' },
              ].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="group w-10 h-10 flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-slate-400 hover:text-cyan-300 hover:border-cyan-400/40 hover:bg-cyan-400/[0.06] hover:shadow-[0_0_20px_-6px_rgba(34,211,238,0.6)] hover:-translate-y-0.5 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ---------- QUICK LINKS (2 cols) ---------- */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold mb-5 text-[13px] uppercase tracking-[0.12em] flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-cyan-400" />
              Explore
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { to: '/products', label: 'Products' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/orders', label: 'Orders' },
              ].map((l, i) => (
                <li key={i}>
                  <Link
                    to={l.to}
                    className="group inline-flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-cyan-400 transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- CONTACT (3 cols) ---------- */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-semibold mb-5 text-[13px] uppercase tracking-[0.12em] flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-cyan-400" />
              Reach Us
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3 group">
                <span className="w-8 h-8 rounded-lg bg-cyan-400/[0.08] border border-cyan-400/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <FiMapPin size={13} />
                </span>
                <span className="text-slate-400 leading-relaxed">
                  123 Industrial Area,<br />Your City, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-cyan-400/[0.08] border border-cyan-400/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <FiPhone size={13} />
                </span>
                <a href="tel:+919876543210" className="text-slate-400 hover:text-cyan-300 transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-cyan-400/[0.08] border border-cyan-400/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <FiMail size={13} />
                </span>
                <a href="mailto:info@lohari.com" className="text-slate-400 hover:text-cyan-300 transition-colors">
                  info@lohari.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-cyan-400/[0.08] border border-cyan-400/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <FiClock size={13} />
                </span>
                <span className="text-slate-400">Mon–Sat · 9AM – 6PM</span>
              </li>
            </ul>
          </div>

          {/* ---------- NEWSLETTER (3 cols) ---------- */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-semibold mb-5 text-[13px] uppercase tracking-[0.12em] flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-cyan-400" />
              Newsletter
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              New designs, offers &amp; fabrication tips — straight to your inbox.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative group"
            >
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-indigo-500/0 group-focus-within:from-cyan-500/20 group-focus-within:to-indigo-500/20 blur transition-all duration-300" />
              <div className="relative flex items-center rounded-xl bg-white/[0.03] border border-white/[0.08] focus-within:border-cyan-400/40 transition-colors overflow-hidden">
                <input
                  type="email"
                  placeholder="you@email.com"
                  className="flex-1 px-4 py-3 bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="m-1 px-4 py-2 text-sm font-bold rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 hover:shadow-[0_0_20px_-4px_rgba(34,211,238,0.7)] transition-all"
                >
                  Join
                </button>
              </div>
            </form>

            <p className="text-slate-500 text-[11px] mt-2.5">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* ---------- BOTTOM BAR ---------- */}
        <div className="mt-14 pt-6 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()}{' '}
            <span className="text-slate-400 font-medium">Lohari Fabrication</span>. All rights reserved.
          </p>

          <div className="flex items-center gap-1 text-xs">
            <Link
              to="/privacy"
              className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-cyan-300 hover:bg-white/[0.04] transition-colors"
            >
              Privacy
            </Link>
            <span className="text-slate-700">·</span>
            <Link
              to="/terms"
              className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-cyan-300 hover:bg-white/[0.04] transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom subtle brand watermark */}
      <div className="relative overflow-hidden">
        <p className="text-center text-[70px] md:text-[110px] font-black tracking-tighter leading-none bg-gradient-to-b from-white/[0.03] to-transparent bg-clip-text text-transparent select-none pb-2">
          LOHARI
        </p>
      </div>
    </footer>
  )
}

export default Footer