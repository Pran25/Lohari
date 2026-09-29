import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

const COLORS = ['#22d3ee', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#f43f5e', '#14b8a6']

function CategorySalesChart({ data = [], loading = false }) {
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
        <h3 className="text-lg font-semibold text-white mb-4">Category-wise Sales</h3>
        <div className="h-64 flex items-center justify-center text-white/40 text-sm">
          No category data available
        </div>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null
    const item = payload[0].payload

    return (
      <div className="bg-[#1a1a2e] border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-white font-semibold text-sm mb-1">{item.category}</p>
        <p className="text-cyan-400 text-sm">
          Orders: <span className="font-bold">{item.orderCount}</span>
        </p>
        <p className="text-emerald-400 text-sm">
          Revenue: <span className="font-bold">₹{Number(item.revenue).toLocaleString('en-IN')}</span>
        </p>
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
        <h3 className="text-lg font-semibold text-white">Category Sales</h3>
        <span className="text-xs text-white/40">{data.length} categories</span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
          <XAxis
            dataKey="category"
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
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
          <Bar dataKey="revenue" name="Revenue" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CategorySalesChart