import { useEffect, useState } from 'react'
import {
  FiPackage,
  FiUsers,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiTrendingUp,
  FiAlertCircle,
  FiBarChart2,
  FiDownload,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import {
  getDashboard,
  getDailyOrders,
  getCategorySales,
  getCustomerSplit,
  getPaymentMethods,
  getCityDistribution,
  getRevenueGrowth,
} from '../api/analyticsApi'
import { exportAnalyticsToExcel, generateFilename } from '../utils/excelExport'
import StatCard from '../components/analytics/StatCard'
import RevenueChart from '../components/analytics/RevenueChart'
import StatusPieChart from '../components/analytics/StatusPieChart'
import DailyOrdersChart from '../components/analytics/DailyOrdersChart'
import CategorySalesChart from '../components/analytics/CategorySalesChart'
import CustomerSplitChart from '../components/analytics/CustomerSplitChart'
import PaymentMethodsChart from '../components/analytics/PaymentMethodsChart'
import CityChart from '../components/analytics/CityChart'
import RevenueGrowthChart from '../components/analytics/RevenueGrowthChart'
import Loading from '../components/common/Loading'

const fetchAnalyticsData = () => Promise.all([
  getDashboard(),
  getDailyOrders(30).catch(() => []),
  getCategorySales().catch(() => []),
  getCustomerSplit().catch(() => null),
  getPaymentMethods().catch(() => []),
  getCityDistribution(10).catch(() => []),
  getRevenueGrowth(6).catch(() => []),
])

function AnalyticsDashboard() {
  const [data, setData] = useState(null)
  const [extras, setExtras] = useState({
    dailyOrders: [],
    categorySales: [],
    customerSplit: null,
    paymentMethods: [],
    cities: [],
    revenueGrowth: [],
  })
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    let active = true
    fetchAnalyticsData()
      .then(([dashboard, daily, cat, split, pay, city, growth]) => {
        if (!active) return
        setData(dashboard)
        setExtras({
          dailyOrders: daily,
          categorySales: cat,
          customerSplit: split,
          paymentMethods: pay,
          cities: city,
          revenueGrowth: growth,
        })
      })
      .catch((error) => {
        if (!active) return
        console.error('Analytics fetch error:', error)
        toast.error('Failed to load analytics')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [dashboard, daily, cat, split, pay, city, growth] = await fetchAnalyticsData()
      setData(dashboard)
      setExtras({
        dailyOrders: daily,
        categorySales: cat,
        customerSplit: split,
        paymentMethods: pay,
        cities: city,
        revenueGrowth: growth,
      })
    } catch (error) {
      console.error('Analytics fetch error:', error)
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  // ============================================
  // EXPORT TO EXCEL
  // ============================================
  const handleExportExcel = async () => {
    if (!data) {
      toast.error('No data to export')
      return
    }

    setExporting(true)
    toast.loading('Generating Analytics Excel...', { id: 'analytics-excel' })

    try {
      const filename = generateFilename('Analytics-Report')

      await exportAnalyticsToExcel(
        {
          summary: data.summary,
          monthlyRevenue: data.monthlyRevenue,
          ordersByStatus: data.ordersByStatus,
          topProducts: data.topProducts,
          topCustomers: data.topCustomers,
        },
        filename
      )

      toast.success('Analytics Excel exported! 📊', { id: 'analytics-excel' })
    } catch (err) {
      console.error('Analytics export error:', err)
      toast.error('Failed to export Analytics', { id: 'analytics-excel' })
    } finally {
      setExporting(false)
    }
  }

  const formatCurrency = (value) => {
    const num = Number(value) || 0
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)}Cr`
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`
    return `₹${num.toLocaleString('en-IN')}`
  }

  const formatFullCurrency = (value) => {
    return `₹${(Number(value) || 0).toLocaleString('en-IN')}`
  }

  if (loading) return <Loading />

  if (!data) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl text-white mb-4">No analytics data available</h2>
        <button onClick={fetchAll} className="btn-primary">
          Retry
        </button>
      </div>
    )
  }

  const { summary, monthlyRevenue, ordersByStatus, topProducts, topCustomers } = data

  return (
    <div className="container-custom py-12 pt-28">
      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-cyan-400/[0.1] border border-cyan-400/20 flex items-center justify-center text-cyan-400">
              <FiBarChart2 size={18} />
            </span>
            Sales Analytics
          </h1>
          <p className="text-slate-400 mt-1">Business overview & insights</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            disabled={exporting || !data}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-emerald-400 bg-emerald-400/[0.08] border border-emerald-400/30 hover:bg-emerald-400/[0.15] hover:border-emerald-400/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {exporting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">Exporting...</span>
              </>
            ) : (
              <>
                <FiDownload size={14} />
                <span className="hidden sm:inline">Export Excel</span>
              </>
            )}
          </button>

          <button
            onClick={fetchAll}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.05] hover:text-white transition-all"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* STAT CARDS ROW 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Orders" value={summary.totalOrders} icon={<FiPackage />} color="blue" subtitle={`${summary.activeOrders} active`} />
        <StatCard title="Total Customers" value={summary.totalCustomers} icon={<FiUsers />} color="purple" />
        <StatCard title="Total Revenue" value={formatCurrency(summary.totalRevenue)} icon={<FiDollarSign />} color="green" subtitle={formatFullCurrency(summary.totalRevenue)} />
        <StatCard title="Pending Payments" value={formatCurrency(summary.pendingPayments)} icon={<FiClock />} color="orange" subtitle={formatFullCurrency(summary.pendingPayments)} />
      </div>

      {/* STAT CARDS ROW 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Avg Order Value" value={formatCurrency(summary.avgOrderValue)} icon={<FiTrendingUp />} color="teal" />
        <StatCard title="Completed" value={summary.completedOrders} icon={<FiCheckCircle />} color="green" />
        <StatCard title="Active Orders" value={summary.activeOrders} icon={<FiAlertCircle />} color="yellow" />
        <StatCard title="Cancelled" value={summary.cancelledOrders} icon={<FiAlertCircle />} color="red" />
      </div>

      {/* EXISTING CHARTS — Monthly Revenue + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <RevenueChart data={monthlyRevenue} />
        </div>
        <div className="lg:col-span-1">
          <StatusPieChart data={ordersByStatus} />
        </div>
      </div>

      {/* ✅ NEW: DAILY ORDERS — Full Width */}
      <div className="mb-8">
        <DailyOrdersChart data={extras.dailyOrders} />
      </div>

      {/* ✅ NEW: CATEGORY SALES + PAYMENT METHODS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <CategorySalesChart data={extras.categorySales} />
        <PaymentMethodsChart data={extras.paymentMethods} />
      </div>

      {/* ✅ NEW: CUSTOMER SPLIT + CITY DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <CustomerSplitChart data={extras.customerSplit} />
        <CityChart data={extras.cities} />
      </div>

      {/* ✅ NEW: REVENUE GROWTH — Full Width */}
      <div className="mb-8">
        <RevenueGrowthChart data={extras.revenueGrowth} />
      </div>

      {/* TOP PRODUCTS + TOP CUSTOMERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TOP PRODUCTS */}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            🏆 Top Products
          </h3>

          {topProducts?.length === 0 ? (
            <p className="text-white/40 text-sm text-center py-8">No products data</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center font-bold text-sm shrink-0">
                      #{idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium text-sm truncate">
                        {product.productName}
                      </p>
                      <p className="text-white/40 text-xs">
                        {product.orderCount} order{product.orderCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <p className="text-green-400 font-semibold text-sm whitespace-nowrap ml-2">
                    {formatFullCurrency(product.totalRevenue)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TOP CUSTOMERS */}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            👑 Top Customers
          </h3>

          {topCustomers?.length === 0 ? (
            <p className="text-white/40 text-sm text-center py-8">No customers data</p>
          ) : (
            <div className="space-y-3">
              {topCustomers.map((customer, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {(customer.customerName || '?')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium text-sm truncate">
                        {customer.customerName || 'Unknown'}
                      </p>
                      <p className="text-white/40 text-xs truncate">
                        {customer.customerEmail}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-2 shrink-0">
                    <p className="text-green-400 font-semibold text-sm">
                      {formatFullCurrency(customer.totalSpent)}
                    </p>
                    <p className="text-white/40 text-xs">
                      {customer.orderCount} order{customer.orderCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard