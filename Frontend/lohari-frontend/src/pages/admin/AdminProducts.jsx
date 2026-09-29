import React, { useState, useEffect } from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiX, FiSave } from 'react-icons/fi'
import axios from '../../api/axios'
import toast from 'react-hot-toast'
import Loading from '../../components/common/Loading'

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const emptyForm = {
    // Basic
    name: '',
    slug: '',
    basePrice: '',
    shortDescription: '',
    longDescription: '',
    categoryId: '',
    defaultMaterialId: '',
    defaultFinishId: '',

    // Dimensions
    defaultWidth: '',
    defaultHeight: '',
    defaultDepth: '',
    unit: 'ft',

    // Weight
    weightKg: '',

    // ===== QUOTATION SETTINGS =====
    defaultRatePerKg: 100,
    defaultLabourCharges: 2000,
    defaultDesignCharges: 500,
    defaultTransportCharges: 0,
    defaultProfitPercent: 15,
    defaultGstPercent: 18,
    defaultAdvancePercent: 30,
    defaultValidityDays: 15,

    // Status
    isActive: true,
    isFeatured: false,
    isNew: false,
    isBestSeller: false,
    isCustomizable: true,

    // Stock
    stockQuantity: 0,
    isInStock: true,
    isMadeToOrder: true,
    leadTimeDays: 15,

    // Images
    thumbnailUrl: '',
    mainImageUrl: '',
  }

  const [formData, setFormData] = useState(emptyForm)
  const [categories, setCategories] = useState([])
  const [materials, setMaterials] = useState([])
  const [finishes, setFinishes] = useState([])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchMaterials()
    fetchFinishes()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/products')
      setProducts(res.data.content || res.data || [])
    } catch (error) {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/categories')
      setCategories(res.data.content || res.data || [])
    } catch {}
  }

  const fetchMaterials = async () => {
    try {
      const res = await axios.get('/materials')
      setMaterials(res.data.content || res.data || [])
    } catch {}
  }

  const fetchFinishes = async () => {
    try {
      const res = await axios.get('/finishes')
      setFinishes(res.data.content || res.data || [])
    } catch {}
  }

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
      // Convert strings to numbers where needed
      const payload = {
        ...formData,
        basePrice: formData.basePrice ? Number(formData.basePrice) : null,
        categoryId: formData.categoryId ? Number(formData.categoryId) : null,
        defaultMaterialId: formData.defaultMaterialId ? Number(formData.defaultMaterialId) : null,
        defaultFinishId: formData.defaultFinishId ? Number(formData.defaultFinishId) : null,
        defaultWidth: formData.defaultWidth ? Number(formData.defaultWidth) : null,
        defaultHeight: formData.defaultHeight ? Number(formData.defaultHeight) : null,
        defaultDepth: formData.defaultDepth ? Number(formData.defaultDepth) : null,
        weightKg: formData.weightKg ? Number(formData.weightKg) : null,

        // Quotation settings
        defaultRatePerKg: Number(formData.defaultRatePerKg) || 100,
        defaultLabourCharges: Number(formData.defaultLabourCharges) || 2000,
        defaultDesignCharges: Number(formData.defaultDesignCharges) || 500,
        defaultTransportCharges: Number(formData.defaultTransportCharges) || 0,
        defaultProfitPercent: Number(formData.defaultProfitPercent) || 15,
        defaultGstPercent: Number(formData.defaultGstPercent) || 18,
        defaultAdvancePercent: Number(formData.defaultAdvancePercent) || 30,
        defaultValidityDays: Number(formData.defaultValidityDays) || 15,

        stockQuantity: Number(formData.stockQuantity) || 0,
        leadTimeDays: Number(formData.leadTimeDays) || 15,
      }

      if (editing) {
        await axios.put(`/admin/products/${editing}`, payload)
        toast.success('Product updated!')
      } else {
        await axios.post('/admin/products', payload)
        toast.success('Product created!')
      }

      setShowForm(false)
      setEditing(null)
      setFormData(emptyForm)
      fetchProducts()
    } catch (error) {
      console.error('Save error:', error)
      toast.error(error.response?.data?.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (p) => {
    setEditing(p.id)
    setFormData({
      name: p.name || '',
      slug: p.slug || '',
      basePrice: p.basePrice || '',
      shortDescription: p.shortDescription || '',
      longDescription: p.longDescription || '',
      categoryId: p.category?.id || '',
      defaultMaterialId: p.defaultMaterial?.id || '',
      defaultFinishId: p.defaultFinish?.id || '',
      defaultWidth: p.dimensions?.defaultWidth || '',
      defaultHeight: p.dimensions?.defaultHeight || '',
      defaultDepth: p.dimensions?.defaultDepth || '',
      unit: p.dimensions?.unit || 'ft',
      weightKg: p.weightKg || '',

      // Quotation settings
      defaultRatePerKg: p.defaultRatePerKg || 100,
      defaultLabourCharges: p.defaultLabourCharges || 2000,
      defaultDesignCharges: p.defaultDesignCharges || 500,
      defaultTransportCharges: p.defaultTransportCharges || 0,
      defaultProfitPercent: p.defaultProfitPercent || 15,
      defaultGstPercent: p.defaultGstPercent || 18,
      defaultAdvancePercent: p.defaultAdvancePercent || 30,
      defaultValidityDays: p.defaultValidityDays || 15,

      isActive: p.isActive ?? true,
      isFeatured: p.isFeatured ?? false,
      isNew: p.isNew ?? false,
      isBestSeller: p.isBestSeller ?? false,
      isCustomizable: p.isCustomizable ?? true,
      stockQuantity: p.stockQuantity || 0,
      isInStock: p.isInStock ?? true,
      isMadeToOrder: p.isMadeToOrder ?? true,
      leadTimeDays: p.leadTimeDays || 15,
      thumbnailUrl: p.thumbnailUrl || '',
      mainImageUrl: p.mainImageUrl || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return
    try {
      await axios.delete(`/admin/products/${id}`)
      toast.success('Product deleted!')
      fetchProducts()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditing(null)
    setFormData(emptyForm)
  }

  if (loading) return <Loading />

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-cyan-400/[0.1] border border-cyan-400/20 flex items-center justify-center text-cyan-400">
              📦
            </span>
            Products
          </h1>
          <p className="text-slate-400 text-sm mt-1">{products.length} products</p>
        </div>
        <button
          onClick={() => {
            if (showForm) handleCancel()
            else setShowForm(true)
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 font-bold text-sm shadow-[0_0_24px_-6px_rgba(34,211,238,0.7)] hover:shadow-[0_0_32px_-4px_rgba(99,102,241,0.9)] hover:scale-[1.03] active:scale-[0.98] transition-all"
        >
          {showForm ? <FiX size={16} /> : <FiPlus size={16} />}
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="glass p-6 rounded-2xl mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            {editing ? 'Edit Product' : 'Add Product'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ===== BASIC INFO ===== */}
            <Section title="Basic Information" icon="📝">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Base Price (₹)"
                  name="basePrice"
                  type="number"
                  value={formData.basePrice}
                  onChange={handleChange}
                  required
                />
                <Select
                  label="Category"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  options={categories}
                  required
                />
                <Select
                  label="Default Material"
                  name="defaultMaterialId"
                  value={formData.defaultMaterialId}
                  onChange={handleChange}
                  options={materials}
                />
                <Select
                  label="Default Finish"
                  name="defaultFinishId"
                  value={formData.defaultFinishId}
                  onChange={handleChange}
                  options={finishes}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Short Description"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <Textarea
                    label="Long Description"
                    name="longDescription"
                    value={formData.longDescription}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </div>
            </Section>

            {/* ===== DIMENSIONS & WEIGHT ===== */}
            <Section title="Dimensions & Weight" icon="📐">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  label="Width"
                  name="defaultWidth"
                  type="number"
                  value={formData.defaultWidth}
                  onChange={handleChange}
                />
                <Input
                  label="Height"
                  name="defaultHeight"
                  type="number"
                  value={formData.defaultHeight}
                  onChange={handleChange}
                />
                <Input
                  label="Depth"
                  name="defaultDepth"
                  type="number"
                  value={formData.defaultDepth}
                  onChange={handleChange}
                />
                <Input
                  label="Unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                />
                <Input
                  label="Weight per item (kg)"
                  name="weightKg"
                  type="number"
                  value={formData.weightKg}
                  onChange={handleChange}
                  placeholder="e.g., 25"
                />
              </div>
            </Section>

            {/* ===== QUOTATION SETTINGS ===== */}
            <Section title="Quotation Settings" icon="⚙️" subtitle="Auto-fill values for quotation generation">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  label="Rate per kg (₹)"
                  name="defaultRatePerKg"
                  type="number"
                  value={formData.defaultRatePerKg}
                  onChange={handleChange}
                />
                <Input
                  label="Labour Charges (₹)"
                  name="defaultLabourCharges"
                  type="number"
                  value={formData.defaultLabourCharges}
                  onChange={handleChange}
                />
                <Input
                  label="Design Charges (₹)"
                  name="defaultDesignCharges"
                  type="number"
                  value={formData.defaultDesignCharges}
                  onChange={handleChange}
                />
                <Input
                  label="Transport Charges (₹)"
                  name="defaultTransportCharges"
                  type="number"
                  value={formData.defaultTransportCharges}
                  onChange={handleChange}
                />
                <Input
                  label="Profit %"
                  name="defaultProfitPercent"
                  type="number"
                  value={formData.defaultProfitPercent}
                  onChange={handleChange}
                />
                <Input
                  label="GST %"
                  name="defaultGstPercent"
                  type="number"
                  value={formData.defaultGstPercent}
                  onChange={handleChange}
                />
                <Input
                  label="Advance %"
                  name="defaultAdvancePercent"
                  type="number"
                  value={formData.defaultAdvancePercent}
                  onChange={handleChange}
                />
                <Input
                  label="Validity (days)"
                  name="defaultValidityDays"
                  type="number"
                  value={formData.defaultValidityDays}
                  onChange={handleChange}
                />
              </div>
            </Section>

            {/* ===== STOCK & STATUS ===== */}
            <Section title="Stock & Status" icon="📦">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Stock Quantity"
                  name="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                />
                <Input
                  label="Lead Time (days)"
                  name="leadTimeDays"
                  type="number"
                  value={formData.leadTimeDays}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <Checkbox
                  label="Active"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <Checkbox
                  label="Featured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                />
                <Checkbox
                  label="New"
                  name="isNew"
                  checked={formData.isNew}
                  onChange={handleChange}
                />
                <Checkbox
                  label="Best Seller"
                  name="isBestSeller"
                  checked={formData.isBestSeller}
                  onChange={handleChange}
                />
                <Checkbox
                  label="Customizable"
                  name="isCustomizable"
                  checked={formData.isCustomizable}
                  onChange={handleChange}
                />
                <Checkbox
                  label="In Stock"
                  name="isInStock"
                  checked={formData.isInStock}
                  onChange={handleChange}
                />
                <Checkbox
                  label="Made to Order"
                  name="isMadeToOrder"
                  checked={formData.isMadeToOrder}
                  onChange={handleChange}
                />
              </div>
            </Section>

            {/* ===== IMAGES ===== */}
            <Section title="Images" icon="🖼️">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Thumbnail URL"
                  name="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
                <Input
                  label="Main Image URL"
                  name="mainImageUrl"
                  value={formData.mainImageUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </Section>

            {/* SUBMIT */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 font-bold text-sm shadow-[0_0_24px_-6px_rgba(34,211,238,0.7)] hover:shadow-[0_0_32px_-4px_rgba(99,102,241,0.9)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all"
              >
                <FiSave size={15} />
                {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 rounded-xl border border-white/[0.1] bg-white/[0.02] text-slate-300 font-semibold text-sm hover:bg-white/[0.05] hover:text-white transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE */}
      <div className="rounded-2xl border border-white/[0.06] bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.03] border-b border-white/[0.08]">
              <tr>
                <th className="text-left text-[11px] uppercase tracking-wider text-slate-400 font-semibold p-4">Name</th>
                <th className="text-left text-[11px] uppercase tracking-wider text-slate-400 font-semibold p-4">Price</th>
                <th className="text-left text-[11px] uppercase tracking-wider text-slate-400 font-semibold p-4">Weight</th>
                <th className="text-left text-[11px] uppercase tracking-wider text-slate-400 font-semibold p-4">Rate/kg</th>
                <th className="text-left text-[11px] uppercase tracking-wider text-slate-400 font-semibold p-4">Category</th>
                <th className="text-right text-[11px] uppercase tracking-wider text-slate-400 font-semibold p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="text-white font-medium text-sm">{p.name}</div>
                    <div className="text-slate-500 text-xs font-mono">{p.slug}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300 font-bold text-sm">
                      ₹{(p.basePrice || 0).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 text-sm">
                    {p.weightKg ? `${p.weightKg} kg` : '-'}
                  </td>
                  <td className="p-4 text-slate-300 text-sm">
                    {p.defaultRatePerKg ? `₹${p.defaultRatePerKg}/kg` : '-'}
                  </td>
                  <td className="p-4 text-slate-400 text-sm">
                    {p.category?.name || '-'}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-2 rounded-lg text-cyan-400 hover:text-white hover:bg-cyan-400/[0.15] border border-cyan-400/30 transition-all"
                        title="Edit"
                      >
                        <FiEdit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
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
    </div>
  )
}

/* ============================================
   HELPER COMPONENTS
   ============================================ */

function Section({ title, icon, subtitle, children }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="mb-4">
        <h3 className="text-white text-sm font-bold flex items-center gap-2">
          <span>{icon}</span>
          {title}
        </h3>
        {subtitle && <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function Input({ label, name, value, onChange, type = 'text', required, placeholder }) {
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
        className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.05] transition-all"
      />
    </div>
  )
}

function Textarea({ label, name, value, onChange, rows = 3 }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.05] resize-none transition-all"
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
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  )
}

function Checkbox({ label, name, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-white/[0.2] bg-white/[0.03] text-cyan-400 focus:ring-cyan-400/40 focus:ring-offset-0 cursor-pointer"
      />
      <span className="text-slate-300 text-sm group-hover:text-white transition-colors">
        {label}
      </span>
    </label>
  )
}

export default AdminProducts