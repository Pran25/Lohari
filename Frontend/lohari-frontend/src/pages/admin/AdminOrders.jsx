import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import toast from 'react-hot-toast'
import Loading from '../../components/common/Loading'
import SendQuotationModal from '../../components/admin/SendQuotationModal'
import AdminDiscount from './AdminDiscount'
import {
  exportToExcel,
  formatDate,
  formatCurrency,
  formatStatus,
  generateFilename,
} from '../../utils/excelExport'
import {
  FiEye, FiRefreshCw, FiTrash2, FiSearch,
  FiFilter, FiX, FiPackage, FiChevronDown, FiSend, FiDownload, FiTag,
} from 'react-icons/fi'

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const [quotationOrder, setQuotationOrder] = useState(null)
  const [showQuotationModal, setShowQuotationModal] = useState(false)

  // ✅ NEW: Discount modal state
  const [discountOrder, setDiscountOrder] = useState(null)
  const [showDiscountModal, setShowDiscountModal] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get('/orders')

      let orderList = []
      if (response.data?.content && Array.isArray(response.data.content)) {
        orderList = response.data.content
      } else if (Array.isArray(response.data)) {
        orderList = response.data
      }

      setOrders(orderList)
    } catch (error) {
      console.error('❌ Error fetching orders:', error)
      setError(error.message)
      if (error.response?.status !== 404) {
        toast.error('Failed to load orders')
      }
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/orders/admin/${id}/status-simple`, null, {
        params: {
          status: status,
          location: 'Admin Panel',
          description: `Status updated to ${status.replace(/_/g, ' ')}`,
        },
      })
      toast.success('Status updated!')
      fetchOrders()
    } catch (error) {
      console.error('❌ Failed to update status:', error)
      toast.error(error.response?.data?.error || 'Failed to update status')
    }
  }

  const deleteOrder = async (id, orderNumber) => {
    if (!confirm(`Are you sure you want to delete order ${orderNumber}?`)) return

    try {
      await axios.delete(`/orders/admin/${id}`)
      toast.success('Order deleted successfully!')
      fetchOrders()
    } catch (error) {
      console.error('❌ Failed to delete order:', error)
      toast.error(error.response?.data?.error || 'Failed to delete order')
    }
  }

  const openQuotationModal = (order) => {
    setQuotationOrder(order)
    setShowQuotationModal(true)
  }

  const closeQuotationModal = () => {
    setShowQuotationModal(false)
    setQuotationOrder(null)
  }

  // ✅ NEW: Discount modal handlers
  const openDiscountModal = (order) => {
    setDiscountOrder(order)
    setShowDiscountModal(true)
  }

  const closeDiscountModal = () => {
    setShowDiscountModal(false)
    setDiscountOrder(null)
  }

  // ============================================
  // EXPORT TO EXCEL
  // ============================================
  const handleExport = async () => {
    if (filteredOrders.length === 0) {
      toast.error('No orders to export')
      return
    }

    const columns = [
      { key: 'orderNumber', label: 'Order #', format: (v) => v || '' },
      { key: 'orderDate', label: 'Order Date', format: (v) => formatDate(v) },
      { key: 'customerName', label: 'Customer', format: (v) => v || 'N/A' },
      { key: 'customerEmail', label: 'Email', format: (v) => v || '' },
      { key: 'customerPhone', label: 'Phone', format: (v) => v || '' },
      { key: 'productName', label: 'Product', format: (v) => v || 'N/A' },
      { key: 'material', label: 'Material', format: (v) => v || 'Standard' },
      { key: 'finish', label: 'Finish', format: (v) => v || 'Standard' },
      { key: 'quantity', label: 'Qty', format: (v) => v || 0 },
      { key: 'totalAmount', label: 'Total (Rs)', format: (v) => formatCurrency(v) },
      { key: 'advanceAmount', label: 'Advance (Rs)', format: (v) => formatCurrency(v) },
      { key: 'balanceAmount', label: 'Balance (Rs)', format: (v) => formatCurrency(v) },
      { key: 'status', label: 'Status', format: (v) => formatStatus(v) },
    ]

    const summaryFields = [
      {
        key: 'totalAmount',
        label: 'Total Revenue',
        format: (v) => `Rs ${formatCurrency(v)}`,
      },
      {
        key: 'advanceAmount',
        label: 'Advance Paid',
        format: (v) => `Rs ${formatCurrency(v)}`,
      },
      {
        key: 'balanceAmount',
        label: 'Balance Due',
        format: (v) => `Rs ${formatCurrency(v)}`,
      },
      { key: 'quantity', label: 'Total Items', format: (v) => String(v) },
      {
        label: 'Average Order',
        calculate: (d) =>
          d.length
            ? d.reduce((s, o) => s + (Number(o.totalAmount) || 0), 0) / d.length
            : 0,
        format: (v) => `Rs ${formatCurrency(v)}`,
      },
      {
        label: 'Pending Orders',
        calculate: (d) => d.filter((o) => o.status === 'PENDING').length,
        format: (v) => String(v),
      },
    ]

    const activeFilters = {}
    if (search) activeFilters['Search'] = search
    if (statusFilter !== 'ALL') activeFilters['Status'] = formatStatus(statusFilter)
    if (dateFrom) activeFilters['From Date'] = dateFrom
    if (dateTo) activeFilters['To Date'] = dateTo

    const filename = generateFilename('Orders-Report')

    try {
      toast.loading('Generating Excel file...', { id: 'excel' })
      await exportToExcel(filteredOrders, filename, columns, {
        title: 'LOHARI FABRICATION - ORDERS REPORT',
        subtitle: 'Custom Metal Fabrication & Design',
        summaryFields,
        filters: activeFilters,
        sheetName: 'Orders',
      })
      toast.success(`Exported ${filteredOrders.length} orders to Excel!`, {
        id: 'excel',
      })
    } catch (err) {
      console.error('Excel export error:', err)
      toast.error('Failed to export Excel', { id: 'excel' })
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'QUOTE_SENT': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'QUOTE_ACCEPTED': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
      case 'SITE_VISIT_SCHEDULED': return 'text-purple-400 bg-purple-400/10 border-purple-400/20'
      case 'SITE_VISIT_COMPLETED': return 'text-purple-500 bg-purple-500/10 border-purple-500/20'
      case 'ADVANCE_PAID': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
      case 'FABRICATION_STARTED': return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
      case 'FABRICATION_IN_PROGRESS': return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
      case 'FABRICATION_COMPLETE': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
      case 'DELIVERY_SCHEDULED': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'DELIVERED': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20'
      case 'COMPLETED': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
      case 'CANCELLED': return 'text-rose-400 bg-rose-400/10 border-rose-400/20'
      default: return 'text-slate-400 bg-white/5 border-white/10'
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (search.trim()) {
        const q = search.toLowerCase().trim()
        const searchable = [
          o.orderNumber, o.id, o.customerName, o.customerEmail,
          o.customerPhone, o.productName,
        ]
          .filter(Boolean)
          .map((v) => String(v).toLowerCase())
          .join(' ')
        if (!searchable.includes(q)) return false
      }

      if (statusFilter !== 'ALL' && o.status !== statusFilter) return false

      const orderDate = o.orderDate || o.createdAt
      if (dateFrom && orderDate) {
        if (new Date(orderDate) < new Date(dateFrom)) return false
      }
      if (dateTo && orderDate) {
        const toDate = new Date(dateTo)
        toDate.setHours(23, 59, 59, 999)
        if (new Date(orderDate) > toDate) return false
      }

      return true
    })
  }, [orders, search, statusFilter, dateFrom, dateTo])

  const resetFilters = () => {
    setSearch('')
    setStatusFilter('ALL')
    setDateFrom('')
    setDateTo('')
  }

  const activeFiltersCount =
    (search ? 1 : 0) +
    (statusFilter !== 'ALL' ? 1 : 0) +
    (dateFrom ? 1 : 0) +
    (dateTo ? 1 : 0)

  if (loading) return <Loading />

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-cyan-400/[0.1] border border-cyan-400/20 flex items-center justify-center text-cyan-400">
              <FiPackage size={18} />
            </span>
            Orders
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {filteredOrders.length} of {orders.length} orders
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={filteredOrders.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-emerald-400 bg-emerald-400/[0.08] border border-emerald-400/30 hover:bg-emerald-400/[0.15] hover:border-emerald-400/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Export to Excel"
          >
            <FiDownload size={14} />
            <span className="hidden sm:inline">Export Excel</span>
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              showFilters || activeFiltersCount > 0
                ? 'text-cyan-400 bg-cyan-400/[0.08] border-cyan-400/30'
                : 'text-slate-300 bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05]'
            }`}
          >
            <FiFilter size={14} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-br from-cyan-400 to-indigo-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.05] hover:text-white transition-all"
          >
            <FiRefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative mb-4">
        <FiSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          size={16}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order #, customer name, email, phone, product..."
          className="w-full pl-11 pr-10 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.05] transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all"
          >
            <FiX size={14} />
          </button>
        )}
      </div>

      {/* FILTERS */}
      {showFilters && (
        <div className="mb-6 p-4 rounded-2xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
                Status
              </label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-cyan-400/40 hover:bg-white/[0.05] transition-all cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="ADVANCE_PAID">Advance Paid</option>
                  <option value="FABRICATION_STARTED">Fabrication Started</option>
                  <option value="FABRICATION_COMPLETE">Fabrication Complete</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <FiChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                  size={14}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-cyan-400/40 transition-all [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-cyan-400/40 transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <p className="text-xs text-slate-400">
                <span className="font-bold text-cyan-400">{activeFiltersCount}</span> filter
                {activeFiltersCount > 1 ? 's' : ''} active
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
              >
                <FiX size={12} /> Clear all
              </button>
            </div>
          )}
        </div>
      )}

      {/* CONTENT */}
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-slate-900/40 backdrop-blur-xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
            <FiPackage className="text-slate-500" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Orders Yet</h3>
          <p className="text-slate-400 text-sm">
            Orders will appear here once customers place them.
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-slate-900/40 backdrop-blur-xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
            <FiSearch className="text-slate-500" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No matching orders</h3>
          <p className="text-slate-400 text-sm mb-4">
            Try adjusting your search or filters.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_-6px_rgba(34,211,238,0.7)] hover:scale-[1.02] transition-all"
          >
            <FiX size={14} /> Reset Filters
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] bg-slate-900/40 backdrop-blur-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/[0.03] border-b border-white/[0.08]">
                <tr>
                  <th className="text-left text-[11px] uppercase tracking-wider text-slate-400 font-semibold p-4">Order #</th>
                  <th className="text-left text-[11px] uppercase tracking-wider text-slate-400 font-semibold p-4">Customer</th>
                  <th className="text-left text-[11px] uppercase tracking-wider text-slate-400 font-semibold p-4">Product</th>
                  <th className="text-left text-[11px] uppercase tracking-wider text-slate-400 font-semibold p-4">Total</th>
                  <th className="text-left text-[11px] uppercase tracking-wider text-slate-400 font-semibold p-4">Status</th>
                  <th className="text-left text-[11px] uppercase tracking-wider text-slate-400 font-semibold p-4">Change</th>
                  <th className="text-right text-[11px] uppercase tracking-wider text-slate-400 font-semibold p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4">
                      <span className="text-white font-mono text-sm font-semibold">
                        {o.orderNumber || o.id}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-white text-sm font-medium">
                        {o.customerName || 'N/A'}
                      </div>
                      <div className="text-slate-500 text-xs">{o.customerPhone}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-300 text-sm max-w-[200px] truncate">
                        {o.productName || 'N/A'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300 font-bold text-sm">
                          ₹{(o.totalAmount || 0).toLocaleString()}
                        </span>
                        {Number(o.manualDiscount) > 0 && (
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            🎁 ₹{Number(o.manualDiscount).toLocaleString()} off
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap border ${getStatusColor(
                          o.status
                        )}`}
                      >
                        {o.status?.replace(/_/g, ' ') || 'PENDING'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="relative inline-block">
                        <select
                          className="appearance-none pl-3 pr-8 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-xs min-w-[160px] focus:outline-none focus:border-cyan-400/40 hover:bg-white/[0.06] transition-all cursor-pointer"
                          value={o.status || 'PENDING'}
                          onChange={(e) => updateStatus(o.id, e.target.value)}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="ADVANCE_PAID">Advance Paid</option>
                          <option value="FABRICATION_STARTED">Fabrication Started</option>
                          <option value="FABRICATION_COMPLETE">Fabrication Complete</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                        <FiChevronDown
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                          size={12}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-end">
                        {/* ✅ NEW: Discount button */}
                        <button
                          onClick={() => openDiscountModal(o)}
                          className="p-2 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-400/[0.15] border border-emerald-400/30 hover:border-emerald-400/60 transition-all"
                          title="Apply Discount"
                        >
                          <FiTag size={15} />
                        </button>

                        <button
                          onClick={() => openQuotationModal(o)}
                          className="p-2 rounded-lg text-cyan-400 hover:text-white hover:bg-cyan-400/[0.15] border border-cyan-400/30 hover:border-cyan-400/60 transition-all"
                          title="Send Quotation"
                        >
                          <FiSend size={15} />
                        </button>
                        <button
                          onClick={() => navigate(`/orders/${o.id}`)}
                          className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-400/[0.08] border border-white/[0.06] hover:border-cyan-400/30 transition-all"
                          title="View Order"
                        >
                          <FiEye size={15} />
                        </button>
                        <button
                          onClick={() => deleteOrder(o.id, o.orderNumber || o.id)}
                          className="p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/[0.08] border border-white/[0.06] hover:border-rose-400/30 transition-all"
                          title="Delete Order"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <SendQuotationModal
        isOpen={showQuotationModal}
        onClose={closeQuotationModal}
        order={quotationOrder}
      />

      {/* ✅ NEW: Discount Modal */}
      <AdminDiscount
        isOpen={showDiscountModal}
        onClose={closeDiscountModal}
        order={discountOrder}
        onSuccess={() => fetchOrders()}
      />
    </div>
  )
}

export default AdminOrders