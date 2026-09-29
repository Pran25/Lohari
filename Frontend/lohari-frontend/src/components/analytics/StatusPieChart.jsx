import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

/**
 * Orders by Status - Pie Chart
 *
 * @param {Array} data - [{ status: "PENDING", count: 8 }, ...]
 * @param {boolean} loading
 */
function StatusPieChart({ data = [], loading = false }) {
  if (loading) {
    return (
      <div className="glass p-6 rounded-2xl animate-pulse">
        <div className="h-6 w-40 bg-white/10 rounded mb-6" />
        <div className="h-64 bg-white/5 rounded-full mx-auto w-48" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Orders by Status</h3>
        <div className="h-64 flex items-center justify-center text-white/40 text-sm">
          No orders data available
        </div>
      </div>
    )
  }

  // Color per status — matches tumhare getStatusColor in OrderDetail.jsx
  const STATUS_COLORS = {
    PENDING: '#facc15',              // yellow
    QUOTE_SENT: '#60a5fa',           // blue
    QUOTE_ACCEPTED: '#4ade80',       // green
    SITE_VISIT_SCHEDULED: '#c084fc', // purple
    SITE_VISIT_COMPLETED: '#a855f7', // purple-500
    ADVANCE_PAID: '#4ade80',         // green
    FABRICATION_STARTED: '#fb923c',  // orange
    FABRICATION_IN_PROGRESS: '#f97316', // orange-500
    FABRICATION_COMPLETE: '#4ade80', // green
    DELIVERY_SCHEDULED: '#60a5fa',   // blue
    DELIVERED: '#4ade80',            // green
    COMPLETED: '#22c55e',            // green-500
    CANCELLED: '#f87171',            // red
  }

  const getColor = (status, index) => {
    if (STATUS_COLORS[status]) return STATUS_COLORS[status]
    // Fallback palette
    const fallback = ['#E67E22', '#3498DB', '#9B59B6', '#1ABC9C', '#E74C3C', '#F39C12']
    return fallback[index % fallback.length]
  }

  // Format status label (PENDING → Pending, FABRICATION_STARTED → Fabrication Started)
  const formatLabel = (status) => {
    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase())
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null

    const item = payload[0]
    return (
      <div className="bg-[#1a1a2e] border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-white font-semibold text-sm mb-1">
          {formatLabel(item.name)}
        </p>
        <p className="text-white/70 text-sm">
          Orders: <span className="font-bold text-white">{item.value}</span>
        </p>
      </div>
    )
  }

  // Custom legend
  const renderLegend = (props) => {
    const { payload } = props
    return (
      <ul className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-4 text-xs">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-white/70">
              {formatLabel(entry.value)} ({entry.payload.count})
            </span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="glass p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Orders by Status</h3>
        <span className="text-xs text-white/40">
          {data.reduce((sum, d) => sum + d.count, 0)} total
        </span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={45}
            paddingAngle={2}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            labelLine={false}
            style={{ fontSize: '11px', fill: '#fff' }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getColor(entry.status, index)}
                stroke="#1a1a2e"
                strokeWidth={2}
              />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />

          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default StatusPieChart