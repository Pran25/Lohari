import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#22d3ee', '#6366f1', '#f59e0b', '#ec4899', '#10b981']

function PaymentMethodsChart({ data = [], loading = false }) {
  if (loading) {
    return (
      <div className="glass p-6 rounded-2xl animate-pulse">
        <div className="h-6 w-48 bg-white/10 rounded mb-6" />
        <div className="h-64 bg-white/5 rounded-full mx-auto w-48" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Payment Methods</h3>
        <div className="h-64 flex items-center justify-center text-white/40 text-sm">
          No payment data
        </div>
      </div>
    )
  }

  const total = data.reduce((sum, d) => sum + d.count, 0)

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null
    const item = payload[0].payload

    return (
      <div className="bg-[#1a1a2e] border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-white font-semibold text-sm mb-1">{item.method}</p>
        <p className="text-cyan-400 text-sm">
          Count: <span className="font-bold">{item.count}</span>
        </p>
        <p className="text-emerald-400 text-sm">
          Amount: <span className="font-bold">₹{Number(item.amount).toLocaleString('en-IN')}</span>
        </p>
      </div>
    )
  }

  return (
    <div className="glass p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Payment Methods</h3>
        <span className="text-xs text-white/40">{total} orders</span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="method"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={50}
            paddingAngle={3}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            labelLine={false}
            style={{ fontSize: '11px', fill: '#fff' }}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
                stroke="#1a1a2e"
                strokeWidth={2}
              />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs">
        {data.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
            />
            <span className="text-white/70">
              {entry.method} ({entry.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PaymentMethodsChart