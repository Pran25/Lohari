import React, { useState, useEffect } from 'react'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'
import axios from '../../api/axios'
import toast from 'react-hot-toast'
import Loading from '../../components/common/Loading'

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    basePrice: '',
    description: '',
    categoryId: '',
  })

  useEffect(() => {
    fetchProducts()
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await axios.put(`/admin/products/${editing}`, formData)
        toast.success('Product updated!')
      } else {
        await axios.post('/admin/products', formData)
        toast.success('Product created!')
      }
      setShowForm(false)
      setEditing(null)
      setFormData({ name: '', slug: '', basePrice: '', description: '', categoryId: '' })
      fetchProducts()
    } catch (error) {
      toast.error('Failed to save product')
    }
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

  if (loading) return <Loading />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Products</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="glass p-6 rounded-2xl mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editing ? 'Edit Product' : 'Add Product'}
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
              placeholder="Slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
            <input
              className="input-field"
              placeholder="Price"
              type="number"
              value={formData.basePrice}
              onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
              required
            />
            <input
              className="input-field"
              placeholder="Category ID"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
            />
            <textarea
              className="input-field col-span-2"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
            />
            <div className="col-span-2 flex gap-3">
              <button type="submit" className="btn-primary">
                {editing ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setShowForm(false)
                  setEditing(null)
                  setFormData({ name: '', slug: '', basePrice: '', description: '', categoryId: '' })
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="text-left text-white/60 p-4">Name</th>
              <th className="text-left text-white/60 p-4">Price</th>
              <th className="text-left text-white/60 p-4">Category</th>
              <th className="text-left text-white/60 p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-4 text-white">{p.name}</td>
                <td className="p-4 text-white">₹{p.basePrice}</td>
                <td className="p-4 text-white/70">{p.category?.name || '-'}</td>
                <td className="p-4 flex gap-2">
                  <button
                    className="text-blue-400 hover:text-blue-300"
                    onClick={() => {
                      setEditing(p.id)
                      setFormData({
                        name: p.name,
                        slug: p.slug,
                        basePrice: p.basePrice,
                        description: p.description || '',
                        categoryId: p.category?.id || '',
                      })
                      setShowForm(true)
                    }}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleDelete(p.id)}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminProducts