import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

function CityChart({ data = [], loading = false }) {
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
        <h3 className="text-lg font-semibold text-white mb-4">City-wise Distribution</h3>
        <div className="h-64 flex items-center justify-center text-white/40 text-sm">
          No city data
        </div>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null
    const item = payload[0].payload

    return (
      <div className="bg-[#1a1a2e] border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-white font-semibold text-sm mb-1">{item.city}</p>
        <p className="text-cyan-400 text-sm">
          Orders: <span className="font-bold">{item.orderCount}</span>
        </p>
        <p className="text-emerald-400 text-sm">
          Revenue: <span className="font-bold">₹{Number(item.revenue).toLocaleString('en-IN')}</span>
        </p>
      </div>
    )
  }

  return (
    <div className="glass p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">City-wise Orders</h3>
        <span className="text-xs text-white/40">Top {data.length}</span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
          <XAxis
            type="number"
            stroke="#ffffff60"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#ffffff80' }}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="city"
            stroke="#ffffff60"
            style={{ fontSize: '11px' }}
            tick={{ fill: '#ffffff80' }}
            width={80}
          />
          <Tooltip content={CustomTooltip} cursor={{ fill: '#ffffff05' }} />
          <Bar
            dataKey="orderCount"
            name="Orders"
            fill="#6366f1"
            radius={[0, 6, 6, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CityChart