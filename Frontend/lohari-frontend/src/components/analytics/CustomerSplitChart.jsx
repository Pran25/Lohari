import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#22d3ee', '#8b5cf6']

function CustomerSplitChart({ data, loading = false }) {
  if (loading) {
    return (
      <div className="glass p-6 rounded-2xl animate-pulse">
        <div className="h-6 w-48 bg-white/10 rounded mb-6" />
        <div className="h-64 bg-white/5 rounded-full mx-auto w-48" />
      </div>
    )
  }

  const newC = data?.newCustomers || 0
  const retC = data?.returningCustomers || 0
  const total = newC + retC

  if (total === 0) {
    return (
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Customer Type</h3>
        <div className="h-64 flex items-center justify-center text-white/40 text-sm">
          No customer data
        </div>
      </div>
    )
  }

  const chartData = [
    { name: 'New Customers', value: newC, color: COLORS[0] },
    { name: 'Returning', value: retC, color: COLORS[1] },
  ]

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null
    const item = payload[0]

    return (
      <div className="bg-[#1a1a2e] border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-white font-semibold text-sm mb-1">{item.name}</p>
        <p className="text-cyan-400 text-sm font-bold">
          {item.value} ({((item.value / total) * 100).toFixed(1)}%)
        </p>
      </div>
    )
  }

  return (
    <div className="glass p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Customer Type</h3>
        <span className="text-xs text-white/40">{total} total</span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={50}
            paddingAngle={3}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            labelLine={false}
            style={{ fontSize: '11px', fill: '#fff' }}
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} stroke="#1a1a2e" strokeWidth={2} />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[0] }} />
          <span className="text-white/70">New ({newC})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[1] }} />
          <span className="text-white/70">Returning ({retC})</span>
        </div>
      </div>
    </div>
  )
}

export default CustomerSplitChart