import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

function RevenueGrowthChart({ data = [], loading = false }) {
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
        <h3 className="text-lg font-semibold text-white mb-4">Revenue Growth (MoM %)</h3>
        <div className="h-64 flex items-center justify-center text-white/40 text-sm">
          No growth data
        </div>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null

    const revenue = payload.find((p) => p.dataKey === 'revenue')?.value || 0
    const growth = payload.find((p) => p.dataKey === 'growthPercent')?.value

    return (
      <div className="bg-[#1a1a2e] border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-white font-semibold text-sm mb-2">{label}</p>
        <p className="text-cyan-400 text-sm">
          Revenue:{' '}
          <span className="font-bold">
            ₹{Number(revenue).toLocaleString('en-IN')}
          </span>
        </p>
        {growth !== null && growth !== undefined && (
          <p
            className={
              growth >= 0 ? 'text-emerald-400 text-sm' : 'text-rose-400 text-sm'
            }
          >
            Growth:{' '}
            <span className="font-bold">
              {growth >= 0 ? '+' : ''}
              {growth.toFixed(1)}%
            </span>
          </p>
        )}
      </div>
    )
  }

  const formatCurrency = (val) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`
    return `₹${val}`
  }

  return (
    <div className="glass p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Revenue Growth %</h3>
        <span className="text-xs text-white/40">Month-over-Month</span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
          <XAxis
            dataKey="month"
            stroke="#ffffff60"
            style={{ fontSize: '11px' }}
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
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RevenueGrowthChart