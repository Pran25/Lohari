import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

function DailyOrdersChart({ data = [], loading = false }) {
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
        <h3 className="text-lg font-semibold text-white mb-4">Daily Orders (Last 30 Days)</h3>
        <div className="h-64 flex items-center justify-center text-white/40 text-sm">
          No daily data available
        </div>
      </div>
    )
  }

  const filteredData = data.map((d, i) => ({
    ...d,
    showLabel: i % 5 === 0 || i === data.length - 1,
  }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null
    const orders = payload.find((p) => p.dataKey === 'orderCount')?.value || 0
    const revenue = payload.find((p) => p.dataKey === 'revenue')?.value || 0

    return (
      <div className="bg-[#1a1a2e] border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-white font-semibold text-sm mb-2">{label}</p>
        <p className="text-cyan-400 text-sm">
          Orders: <span className="font-bold">{orders}</span>
        </p>
        <p className="text-emerald-400 text-sm">
          Revenue: <span className="font-bold">₹{Number(revenue).toLocaleString('en-IN')}</span>
        </p>
      </div>
    )
  }

  return (
    <div className="glass p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Daily Orders</h3>
        <span className="text-xs text-white/40">Last {data.length} days</span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={filteredData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
          <XAxis
            dataKey="date"
            stroke="#ffffff60"
            style={{ fontSize: '11px' }}
            tick={{ fill: '#ffffff80' }}
          />
          <YAxis
            stroke="#ffffff60"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#ffffff80' }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px', color: '#ffffff80' }}
            iconType="circle"
          />
          <Line
            type="monotone"
            dataKey="orderCount"
            name="Orders"
            stroke="#22d3ee"
            strokeWidth={3}
            dot={{ fill: '#22d3ee', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 6, fill: '#22d3ee', stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DailyOrdersChart