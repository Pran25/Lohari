import React, { useState, useEffect } from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiX, FiCheck } from 'react-icons/fi'
import axios from '../../api/axios'
import toast from 'react-hot-toast'
import Loading from '../../components/common/Loading'

function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      console.log('📊 Fetching categories...')
      const response = await axios.get('/categories')
      console.log('📦 Categories response:', response.data)

      let categoryList = []
      if (Array.isArray(response.data)) {
        categoryList = response.data
      } else if (response.data && response.data.content && Array.isArray(response.data.content)) {
        categoryList = response.data.content
      } else {
        categoryList = []
      }

      setCategories(categoryList)
    } catch (error) {
      console.error('❌ Error fetching categories:', error)
      toast.error('Failed to load categories')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        // ✅ FIXED: /admin added
        await axios.put(`/categories/admin/${editing}`, formData)
        toast.success('Category updated!')
      } else {
        // ✅ FIXED: /admin added
        await axios.post('/categories/admin', formData)
        toast.success('Category created!')
      }
      setShowForm(false)
      setEditing(null)
      setFormData({ name: '', slug: '', description: '' })
      fetchCategories()
    } catch (error) {
      console.error('❌ Save error:', error)
      toast.error(error.response?.data?.error || 'Failed to save category')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    try {
      // ✅ FIXED: /admin added
      await axios.delete(`/categories/admin/${id}`)
      toast.success('Category deleted!')
      fetchCategories()
    } catch (error) {
      console.error('❌ Delete error:', error)
      toast.error(error.response?.data?.error || 'Failed to delete category')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditing(null)
    setFormData({ name: '', slug: '', description: '' })
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-cyan-400/[0.1] border border-cyan-400/20 flex items-center justify-center text-cyan-400">
              📂
            </span>
            Categories
          </h1>
          <p className="text-slate-400 text-sm mt-1">{categories.length} categories</p>
        </div>
        <button
          onClick={() => {
            if (showForm) handleCancel()
            else setShowForm(true)
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 font-bold text-sm shadow-[0_0_24px_-6px_rgba(34,211,238,0.7)] hover:scale-[1.03] transition-all"
        >
          {showForm ? <FiX size={16} /> : <FiPlus size={16} />}
          {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {showForm && (
        <div className="glass p-6 rounded-2xl mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editing ? 'Edit Category' : 'Add Category'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="input-field"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              className="input-field"
              placeholder="Slug (e.g., gates, railings)"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
            <textarea
              className="input-field col-span-2"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="2"
            />
            <div className="col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary inline-flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiCheck size={16} />
                    {editing ? 'Update' : 'Create'}
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center">
          <div className="text-6xl mb-4">📂</div>
          <h3 className="text-2xl font-semibold text-white mb-2">No Categories Found</h3>
          <p className="text-white/50">Click "Add Category" to create your first category.</p>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left text-white/60 p-4">Name</th>
                <th className="text-left text-white/60 p-4">Slug</th>
                <th className="text-left text-white/60 p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 text-white">{c.name}</td>
                  <td className="p-4 text-white/70 font-mono text-sm">{c.slug}</td>
                  <td className="p-4 flex gap-2">
                    <button
                      className="text-blue-400 hover:text-blue-300"
                      onClick={() => {
                        setEditing(c.id)
                        setFormData({
                          name: c.name,
                          slug: c.slug,
                          description: c.description || '',
                        })
                        setShowForm(true)
                      }}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDelete(c.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminCategories