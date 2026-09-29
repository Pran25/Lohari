import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiArrowRight, FiStar, FiShield, FiTool,
  FiPlay, FiCheckCircle, FiTrendingUp,
} from 'react-icons/fi'
import { getPublicStats } from '../api/publicAPI'

function Home() {
  const [stats, setStats] = useState({
    projectsDone: 500,
    happyClients: 100,
    yearsExperience: 10,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getPublicStats()
        setStats({
          projectsDone: data.projectsDone || 500,
          happyClients: data.happyClients || 100,
          yearsExperience: data.yearsExperience || 10,
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        // Fallback values already set in state
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="overflow-x-hidden">

      {/* ═══════════════════════════════════════════ */}
      {/* HERO SECTION — Video Background Ready */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* ─── VIDEO BACKGROUND (uncomment when video ready) ─── */}
        {/*
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        */}

        {/* ─── FALLBACK BACKGROUND (jab tak video nahi) ─── */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

        {/* Ambient glows — video ke saath bhi kaam karenge */}
        <div className="pointer-events-none absolute top-32 left-20 w-96 h-96 bg-cyan-500/[0.08] rounded-full blur-[120px] animate-pulse" />
        <div className="pointer-events-none absolute bottom-20 right-20 w-[500px] h-[500px] bg-indigo-500/[0.08] rounded-full blur-[140px]" />

        {/* Dark overlay — video pe text readable rakhne ke liye */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950" />

        {/* ─── CONTENT ─── */}
        <div className="relative z-10 container-custom py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* LEFT — Text */}
            <div className="lg:col-span-7 space-y-7">

              {/* Trust badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.05] backdrop-blur-xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-slate-200 text-[12px] font-medium tracking-wide">
                  Trusted by {stats.happyClients}+ clients across India
                </span>
              </div>

              {/* Main heading */}
              <h1 className="text-[44px] sm:text-6xl md:text-7xl lg:text-[78px] font-black leading-[0.95] tracking-tight">
                <span className="text-white">Build Your</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-300 to-violet-300">
                  Vision in Metal
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-lg md:text-xl text-slate-300/90 max-w-xl leading-relaxed font-light">
                Custom metal fabrication and design services.
                From gates to bespoke furniture — we bring your
                ideas to life with precision and quality.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/products"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 font-bold text-sm shadow-[0_0_30px_-6px_rgba(34,211,238,0.7)] hover:shadow-[0_0_40px_-4px_rgba(99,102,241,0.9)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
                >
                  Explore Products
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/[0.12] bg-white/[0.04] backdrop-blur-xl text-white font-semibold text-sm hover:bg-white/[0.08] hover:border-white/[0.2] transition-all"
                >
                  <FiPlay size={14} />
                  Get a Quote
                </Link>
              </div>

              {/* Stats — BACKEND SE */}
              <div className="flex gap-8 md:gap-12 pt-6">
                <div>
                  <div className="text-3xl md:text-4xl font-black text-white tracking-tight">
                    {stats.projectsDone}+
                  </div>
                  <div className="text-slate-500 text-xs uppercase tracking-wider mt-1">
                    Projects Done
                  </div>
                </div>
                <div className="w-px bg-white/[0.08]" />
                <div>
                  <div className="text-3xl md:text-4xl font-black text-cyan-400 tracking-tight">
                    {stats.happyClients}+
                  </div>
                  <div className="text-slate-500 text-xs uppercase tracking-wider mt-1">
                    Happy Clients
                  </div>
                </div>
                <div className="w-px bg-white/[0.08]" />
                <div>
                  <div className="text-3xl md:text-4xl font-black text-white tracking-tight">
                    {stats.yearsExperience}+
                  </div>
                  <div className="text-slate-500 text-xs uppercase tracking-wider mt-1">
                    Years Exp.
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — Floating Card */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative">

                {/* Glow behind card */}
                <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-transparent rounded-3xl blur-2xl" />

                {/* Card */}
                <div className="relative rounded-3xl border border-white/[0.08] bg-slate-950/60 backdrop-blur-2xl p-7 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)]">

                  {/* Card header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-violet-500 flex items-center justify-center shadow-[0_0_30px_-6px_rgba(34,211,238,0.6)]">
                      <FiTool className="text-white" size={22} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base">Custom Fabrication</h3>
                      <p className="text-slate-400 text-xs">End-to-end solutions</p>
                    </div>
                  </div>

                  {/* Feature list */}
                  <div className="space-y-3">
                    {[
                      { icon: <FiShield size={16} />, text: 'Quality Craftsmanship', color: 'cyan' },
                      { icon: <FiStar size={16} />, text: 'Premium Materials', color: 'amber' },
                      { icon: <FiTool size={16} />, text: 'Custom Designs', color: 'indigo' },
                    ].map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all"
                      >
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            f.color === 'cyan'
                              ? 'bg-cyan-400/[0.1] text-cyan-400 border border-cyan-400/20'
                              : f.color === 'amber'
                              ? 'bg-amber-400/[0.1] text-amber-400 border border-amber-400/20'
                              : 'bg-indigo-400/[0.1] text-indigo-400 border border-indigo-400/20'
                          }`}
                        >
                          {f.icon}
                        </span>
                        <span className="text-slate-200 text-sm font-medium">{f.text}</span>
                        <FiCheckCircle className="ml-auto text-emerald-400/60" size={14} />
                      </div>
                    ))}
                  </div>

                  {/* Footer CTA */}
                  <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <FiTrendingUp className="text-emerald-400" size={13} />
                      <span>98% satisfaction</span>
                    </div>
                    <Link
                      to="/contact"
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Learn more →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-slate-500">
            <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
            <div className="w-5 h-8 rounded-full border border-slate-600 flex justify-center pt-1.5">
              <span className="w-1 h-2 rounded-full bg-cyan-400 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* FEATURES SECTION */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32">
        {/* Ambient */}
        <div className="pointer-events-none absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/[0.05] blur-[120px] rounded-full" />

        <div className="relative container-custom">
          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-cyan-400 border border-cyan-400/20 bg-cyan-400/[0.05] rounded-full mb-4">
              Why Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                Lohari
              </span>
              ?
            </h2>
            <p className="text-slate-400 text-lg">
              We combine craftsmanship with innovation to deliver quality at every step.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🎨',
                title: 'Custom Design',
                desc: 'Tailor-made solutions for your specific needs, from sketch to installation.',
                accent: 'from-cyan-500/10 to-cyan-500/0',
              },
              {
                icon: '⚡',
                title: 'Quality Craftsmanship',
                desc: 'Precision fabrication with premium materials and expert hands.',
                accent: 'from-amber-500/10 to-amber-500/0',
              },
              {
                icon: '📦',
                title: 'End-to-End Service',
                desc: 'From design consultation to final delivery — we handle everything.',
                accent: 'from-indigo-500/10 to-indigo-500/0',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-900/40 backdrop-blur-xl p-7 hover:border-white/[0.12] hover:bg-slate-900/60 transition-all duration-300"
              >
                {/* Ambient hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${f.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-3xl mb-5 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>

                  <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore</span>
                    <FiArrowRight size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home