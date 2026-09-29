import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

/**
 * Monthly Revenue Line Chart
 *
 * @param {Array} data - [{ month: "Jan 2026", revenue: 50000, orderCount: 3 }, ...]
 * @param {boolean} loading
 */
function RevenueChart({ data = [], loading = false }) {
  if (loading) {
    return (
      <div className="glass p-6 rounded-2xl animate-pulse">
        <div className="h-6 w-48 bg-white/10 rounded mb-6" />
        <div className="h-64 bg-white/5 rounded" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Monthly Revenue</h3>
        <div className="h-64 flex items-center justify-center text-white/40 text-sm">
          No revenue data available
        </div>
      </div>
    )
  }

  // Format currency for tooltip
  const formatCurrency = (value) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`
    return `₹${value}`
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null

    const revenue = payload.find((p) => p.dataKey === 'revenue')?.value || 0
    const orders = payload.find((p) => p.dataKey === 'orderCount')?.value || 0

    return (
      <div className="bg-[#1a1a2e] border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-white font-semibold text-sm mb-2">{label}</p>
        <p className="text-orange-400 text-sm">
          Revenue: <span className="font-bold">₹{Number(revenue).toLocaleString('en-IN')}</span>
        </p>
        <p className="text-blue-400 text-sm">
          Orders: <span className="font-bold">{orders}</span>
        </p>
      </div>
    )
  }

  return (
    <div className="glass p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Monthly Revenue</h3>
        <span className="text-xs text-white/40">Last {data.length} months</span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E67E22" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#E67E22" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />

          <XAxis
            dataKey="month"
            stroke="#ffffff60"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#ffffff80' }}
          />

          <YAxis
            stroke="#ffffff60"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#ffffff80' }}
            tickFormatter={formatCurrency}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{ fontSize: '12px', color: '#ffffff80' }}
            iconType="circle"
          />

          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#E67E22"
            strokeWidth={3}
            dot={{ fill: '#E67E22', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#E67E22', stroke: '#fff', strokeWidth: 2 }}
            fill="url(#revenueGradient)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RevenueChart