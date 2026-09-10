import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-900">
      <AdminSidebar />
      <div className="flex-1 p-8 ml-64">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout