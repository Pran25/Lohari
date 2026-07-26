import React, { useState, useEffect } from 'react'
import { FiEdit2, FiTrash2, FiUserCheck, FiUserX } from 'react-icons/fi'
import axios from '../../api/axios'
import toast from 'react-hot-toast'
import Loading from '../../components/common/Loading'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      console.log('📊 Fetching admin users...')
      
      // ✅ Use the correct endpoint
      const response = await axios.get('/admin/users')
      console.log('📦 Users response:', response.data)
      
      let userList = []
      if (Array.isArray(response.data)) {
        userList = response.data
      } else if (response.data && response.data.content && Array.isArray(response.data.content)) {
        userList = response.data.content
      } else {
        userList = []
      }
      
      console.log('👤 Users count:', userList.length)
      setUsers(userList)
    } catch (error) {
      console.error('❌ Error fetching users:', error)
      if (error.response?.status === 403) {
        toast.error('Access denied. Admin login required.')
      } else if (error.response?.status !== 404) {
        toast.error('Failed to load users')
      }
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`/admin/users/${id}/toggle-status`)
      toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully!`)
      fetchUsers()
    } catch (error) {
      toast.error('Failed to update user status')
    }
  }

  const changeUserRole = async (id, role) => {
    try {
      await axios.put(`/admin/users/${id}/role`, { role })
      toast.success('User role updated!')
      fetchUsers()
    } catch (error) {
      toast.error('Failed to update role')
    }
  }

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      await axios.delete(`/admin/users/${id}`)
      toast.success('User deleted!')
      fetchUsers()
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Users</h1>

      {users.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center">
          <div className="text-6xl mb-4">👤</div>
          <h3 className="text-2xl font-semibold text-white mb-2">No Users Found</h3>
          <p className="text-white/50">Users will appear here once they register.</p>
          <button 
            onClick={fetchUsers}
            className="btn-primary mt-4 text-sm"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left text-white/60 p-4">Name</th>
                <th className="text-left text-white/60 p-4">Email</th>
                <th className="text-left text-white/60 p-4">Role</th>
                <th className="text-left text-white/60 p-4">Status</th>
                <th className="text-left text-white/60 p-4">Joined</th>
                <th className="text-left text-white/60 p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 text-white">{user.fullName || user.name || 'N/A'}</td>
                  <td className="p-4 text-white/70">{user.email}</td>
                  <td className="p-4">
                    <select
                      className="glass px-3 py-1 rounded-lg text-white text-sm"
                      value={user.role || 'CUSTOMER'}
                      onChange={(e) => changeUserRole(user.id, e.target.value)}
                    >
                      <option value="CUSTOMER">Customer</option>
                      <option value="ADMIN">Admin</option>
                      <option value="STAFF">Staff</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.isActive !== false 
                        ? 'text-green-400 bg-green-400/10' 
                        : 'text-red-400 bg-red-400/10'
                    }`}>
                      {user.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-white/50 text-sm">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    }) : 'N/A'}
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      className={`p-2 rounded-lg transition-colors ${
                        user.isActive !== false
                          ? 'text-red-400 hover:text-red-300 hover:bg-red-400/10'
                          : 'text-green-400 hover:text-green-300 hover:bg-green-400/10'
                      }`}
                      onClick={() => toggleUserStatus(user.id, user.isActive !== false)}
                      title={user.isActive !== false ? 'Deactivate' : 'Activate'}
                    >
                      {user.isActive !== false ? <FiUserX /> : <FiUserCheck />}
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition-colors"
                      onClick={() => deleteUser(user.id)}
                      title="Delete"
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

export default AdminUsers