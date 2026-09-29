import React from 'react'

/**
 * Reusable stat card.
 *
 * @param {string} title  - Card title (e.g., "Total Orders")
 * @param {string|number} value - Main value (e.g., 25 or "₹4,50,000")
 * @param {ReactNode} icon - Icon component from react-icons
 * @param {string} color  - Tailwind color prefix (e.g., "blue", "green", "orange")
 * @param {string} subtitle - Optional subtitle (e.g., "+12% from last month")
 * @param {boolean} loading - Show skeleton
 */
function StatCard({ title, value, icon, color = 'blue', subtitle, loading = false }) {
  // Color mapping for Tailwind (avoid dynamic class purge issues)
  const colorMap = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
    red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
    yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
    teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20' },
    pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20' },
  }

  const c = colorMap[color] || colorMap.blue

  if (loading) {
    return (
      <div className="glass p-5 rounded-2xl animate-pulse">
        <div className="h-4 w-24 bg-white/10 rounded mb-3" />
        <div className="h-8 w-32 bg-white/10 rounded mb-2" />
        <div className="h-3 w-20 bg-white/10 rounded" />
      </div>
    )
  }

  return (
    <div className={`glass p-5 rounded-2xl border ${c.border} hover:scale-[1.02] transition-transform`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-white/50 text-sm font-medium">{title}</p>
        {icon && (
          <div className={`${c.bg} ${c.text} p-2 rounded-lg text-xl`}>
            {icon}
          </div>
        )}
      </div>

      <h3 className={`text-2xl font-bold ${c.text} mb-1`}>{value}</h3>

      {subtitle && (
        <p className="text-white/40 text-xs">{subtitle}</p>
      )}
    </div>
  )
}

export default StatCard