import { useState, useEffect, useCallback } from 'react'
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiTag, FiCheck,
  FiToggleLeft, FiToggleRight, FiSearch, FiCopy,
} from 'react-icons/fi'
import axios from '../../api/axios'
import toast from 'react-hot-toast'
import Loading from '../../components/common/Loading'

function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL') // ALL | ACTIVE | INACTIVE | EXPIRED

  const emptyForm = {
    code: '',
    description: '',
    type: 'PERCENTAGE',
    value: '',
    minOrderAmount: '',
    maxDiscount: '',
    validFrom: '',
    validTo: '',
    usageLimit: '',
    perUserLimit: 1,
    customerEmail: '',
    isActive: true,
  }

  const [formData, setFormData] = useState(emptyForm)

  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true)
      const res = await axios.get('/coupons/admin')
      setCoupons(res.data || [])
    } catch (error) {
      console.error('Failed to load coupons:', error)
      toast.error('Failed to load coupons')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    axios.get('/coupons/admin')
      .then((response) => {
        if (active) setCoupons(response.data || [])
      })
      .catch((error) => {
        if (!active) return
        console.error('Failed to load coupons:', error)
        toast.error('Failed to load coupons')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Build payload
      const payload = {
        code: formData.code.trim().toUpperCase(),
        description: formData.description,
        type: formData.type,
        value: Number(formData.value),
        minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : null,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
        validFrom: formData.validFrom ? formData.validFrom + 'T00:00:00' : null,
        validTo: formData.validTo ? formData.validTo + 'T23:59:59' : null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        perUserLimit: formData.perUserLimit ? Number(formData.perUserLimit) : 1,
        customerEmail: formData.customerEmail?.trim() || null,
        isActive: formData.isActive,
      }

      if (editing) {
        await axios.put(`/coupons/admin/${editing}`, payload)
        toast.success('Coupon updated!')
      } else {
        await axios.post('/coupons/admin', payload)
        toast.success('Coupon created!')
      }

      setShowForm(false)
      setEditing(null)
      setFormData(emptyForm)
      fetchCoupons()
    } catch (error) {
      console.error('Save error:', error)
      toast.error(error.response?.data?.message || 'Failed to save coupon')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (coupon) => {
    setEditing(coupon.id)
    setFormData({
      code: coupon.code || '',
      description: coupon.description || '',
      type: coupon.type || 'PERCENTAGE',
      value: coupon.value || '',
      minOrderAmount: coupon.minOrderAmount || '',
      maxDiscount: coupon.maxDiscount || '',
      validFrom: coupon.validFrom ? coupon.validFrom.slice(0, 10) : '',
      validTo: coupon.validTo ? coupon.validTo.slice(0, 10) : '',
      usageLimit: coupon.usageLimit || '',
      perUserLimit: coupon.perUserLimit || 1,
      customerEmail: coupon.customerEmail || '',
      isActive: coupon.isActive ?? true,
    })
    setShowForm(true)
  }

  const handleDelete = async (id, code) => {
    if (!confirm(`Delete coupon "${code}"? This cannot be undone.`)) return
    try {
      await axios.delete(`/coupons/admin/${id}`)
      toast.success('Coupon deleted!')
      fetchCoupons()
    } catch {
      toast.error('Failed to delete coupon')
    }
  }

  const handleToggle = async (id) => {
    try {
      await axios.put(`/coupons/admin/${id}/toggle`)
      toast.success('Coupon status updated!')
      fetchCoupons()
    } catch {
      toast.error('Failed to toggle coupon')
    }
  }

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code)
    toast.success(`Copied: ${code}`)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditing(null)
    setFormData(emptyForm)
  }

  // ============================================
  // FILTERS + SEARCH
  // ============================================
  const filteredCoupons = coupons.filter((c) => {
    // Filter
    if (filter === 'ACTIVE' && !c.isActive) return false
    if (filter === 'INACTIVE' && c.isActive) return false
    if (filter === 'EXPIRED' && !c.isExpired) return false

    // Search
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      const searchable = [c.code, c.description]
        .filter(Boolean)
        .map((v) => String(v).toLowerCase())
        .join(' ')
      if (!searchable.includes(q)) return false
    }

    return true
  })

  if (loading) return <Loading />

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-cyan-400/[0.1] border border-cyan-400/20 flex items-center justify-center text-cyan-400">
              <FiTag size={18} />
            </span>
            Coupons
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {filteredCoupons.length} of {coupons.length} coupons
          </p>
        </div>

        <button
          onClick={() => {
            if (showForm) handleCancel()
            else setShowForm(true)
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 font-bold text-sm shadow-[0_0_24px_-6px_rgba(34,211,238,0.7)] hover:shadow-[0_0_32px_-4px_rgba(99,102,241,0.9)] hover:scale-[1.03] active:scale-[0.98] transition-all"
        >
          {showForm ? <FiX size={16} /> : <FiPlus size={16} />}
          {showForm ? 'Cancel' : 'Add Coupon'}
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            size={16}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coupons..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400/40 transition-all"
          />
        </div>

        <div className="flex gap-2">
          {[
            { key: 'ALL', label: 'All' },
            { key: 'ACTIVE', label: 'Active' },
            { key: 'INACTIVE', label: 'Inactive' },
            { key: 'EXPIRED', label: 'Expired' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${
                filter === f.key
                  ? 'text-cyan-400 bg-cyan-400/[0.08] border-cyan-400/30'
                  : 'text-slate-400 bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="glass p-6 rounded-2xl mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            {editing ? 'Edit Coupon' : 'Add Coupon'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: Code + Type */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Coupon Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                placeholder="SAVE10"
                disabled={editing}
              />

              <Select
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={[
                  { value: 'PERCENTAGE', label: 'Percentage (%)' },
                  { value: 'FLAT', label: 'Flat Amount (₹)' },
                ]}
              />

              <Input
                label={formData.type === 'PERCENTAGE' ? 'Value (%)' : 'Value (₹)'}
                name="value"
                type="number"
                value={formData.value}
                onChange={handleChange}
                required
                placeholder={formData.type === 'PERCENTAGE' ? '10' : '500'}
              />
            </div>

            {/* Row 2: Description */}
            <Input
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="10% off on all orders"
            />

            {/* Row 3: Limits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Min Order Amount (₹)"
                name="minOrderAmount"
                type="number"
                value={formData.minOrderAmount}
                onChange={handleChange}
                placeholder="5000"
              />
              <Input
                label="Max Discount (₹)"
                name="maxDiscount"
                type="number"
                value={formData.maxDiscount}
                onChange={handleChange}
                placeholder="2000"
                disabled={formData.type === 'FLAT'}
              />
              <Input
                label="Total Usage Limit"
                name="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={handleChange}
                placeholder="100"
              />
            </div>

            {/* Row 4: Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Valid From"
                name="validFrom"
                type="date"
                value={formData.validFrom}
                onChange={handleChange}
              />
              <Input
                label="Valid To"
                name="validTo"
                type="date"
                value={formData.validTo}
                onChange={handleChange}
              />
              <Input
                label="Per User Limit"
                name="perUserLimit"
                type="number"
                value={formData.perUserLimit}
                onChange={handleChange}
                placeholder="1"
              />
            </div>

            {/* Row 5: Customer Email (Private Coupon) */}
            <div>
              <Input
                label="Customer Email (leave blank for public coupon)"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                placeholder="customer@email.com"
              />
              <p className="text-xs text-slate-500 mt-1">
                💡 Agar email daala → sirf us customer ke liye valid
              </p>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-white/[0.2] bg-white/[0.03] text-cyan-400 cursor-pointer"
                />
                <span className="text-slate-300 text-sm">Active</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 font-bold text-sm shadow-[0_0_24px_-6px_rgba(34,211,238,0.7)] hover:scale-[1.02] disabled:opacity-50 transition-all"
              >
                {saving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiCheck size={16} />
                    {editing ? 'Update Coupon' : 'Create Coupon'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 rounded-xl border border-white/[0.1] bg-white/[0.02] text-slate-300 font-semibold text-sm hover:bg-white/[0.05] transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE */}
      {coupons.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-slate-900/40 backdrop-blur-xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
            <FiTag className="text-slate-500" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Coupons Yet</h3>
          <p className="text-slate-400 text-sm">
            Create your first coupon to start offering discounts.
          </p>
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-slate-900/40 backdrop-blur-xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
            <FiSearch className="text-slate-500" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No matching coupons</h3>
          <p className="text-slate-400 text-sm">Try a different filter or search.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] bg-slate-900/40 backdrop-blur-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/[0.03] border-b border-white/[0.08]">
                <tr>
                  <th className="text-left text-[11px] uppercase tracking-wider text-slate-400 font-semibold p-4">Code</th>
                  <th className="text-left text-[11px] uppercase tracking-wider text-slate-400 font-semibold p-4">Discount</th>
                  <th className="text-left text-[11px] uppercase tracking-wider text-slate-400 font-semibold p-4">Min Order</th>
                  <th className="text-left text-[11px] uppercase tracking-wider text-slate-400 font-semibold p-4">Usage</th>
                  <th className="text-left text-[11px] uppercase tracking-wider text-slate-400 font-semibold p-4">Validity</th>
                  <th className="text-left text-[11px] uppercase tracking-wider text-slate-400 font-semibold p-4">Status</th>
                  <th className="text-right text-[11px] uppercase tracking-wider text-slate-400 font-semibold p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((c) => (
                  <tr key={c.id} className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-mono font-bold text-sm">
                          {c.code}
                        </span>
                        <button
                          onClick={() => handleCopy(c.code)}
                          className="p-1 rounded text-slate-500 hover:text-cyan-400 hover:bg-cyan-400/[0.08] transition-all"
                          title="Copy code"
                        >
                          <FiCopy size={12} />
                        </button>
                      </div>
                      {c.description && (
                        <div className="text-slate-500 text-xs mt-0.5">{c.description}</div>
                      )}
                      {c.customerEmail && (
                        <div className="text-amber-400 text-[10px] mt-0.5 font-semibold">
                          🔒 Private — {c.customerEmail}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-white font-semibold text-sm">
                        {c.type === 'PERCENTAGE' ? `${c.value}%` : `₹${c.value}`}
                      </span>
                      {c.maxDiscount && c.type === 'PERCENTAGE' && (
                        <div className="text-slate-500 text-xs">Max ₹{c.maxDiscount}</div>
                      )}
                    </td>
                    <td className="p-4 text-slate-300 text-sm">
                      {c.minOrderAmount ? `₹${c.minOrderAmount}` : '—'}
                    </td>
                    <td className="p-4">
                      <div className="text-white text-sm font-semibold">
                        {c.usedCount || 0}
                        {c.usageLimit ? ` / ${c.usageLimit}` : ''}
                      </div>
                      {c.remainingUses !== null && c.usageLimit && (
                        <div className="text-slate-500 text-xs">
                          {c.remainingUses} left
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-slate-300 text-xs">
                        {c.validFrom ? new Date(c.validFrom).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
                        {' → '}
                        {c.validTo ? new Date(c.validTo).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '∞'}
                      </div>
                    </td>
                    <td className="p-4">
                      {c.isExpired ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-400/10 border border-rose-400/20">
                          Expired
                        </span>
                      ) : c.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/20">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/5 border border-white/10">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleToggle(c.id)}
                          className={`p-2 rounded-lg border transition-all ${
                            c.isActive
                              ? 'text-emerald-400 hover:bg-emerald-400/[0.08] border-emerald-400/30'
                              : 'text-slate-400 hover:bg-white/[0.06] border-white/[0.08]'
                          }`}
                          title={c.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {c.isActive ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
                        </button>
                        <button
                          onClick={() => handleEdit(c)}
                          className="p-2 rounded-lg text-cyan-400 hover:text-white hover:bg-cyan-400/[0.15] border border-cyan-400/30 transition-all"
                          title="Edit"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.code)}
                          className="p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/[0.08] border border-white/[0.06] hover:border-rose-400/30 transition-all"
                          title="Delete"
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
    </div>
  )
}

/* ============================================
   HELPER COMPONENTS
   ============================================ */

function Input({ label, name, value, onChange, type = 'text', required, placeholder, disabled }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
        {label}
        {required && <span className="text-cyan-400 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        min={type === 'number' ? '0' : undefined}
        step={type === 'number' ? '0.01' : undefined}
        className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.05] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      />
    </div>
  )
}

function Select({ label, name, value, onChange, options, required }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
        {label}
        {required && <span className="text-cyan-400 ml-0.5">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-cyan-400/40 transition-all cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default AdminCoupons