import React from 'react'
import { NavLink } from 'react-router-dom'
import { FiHome, FiPackage, FiShoppingBag, FiUsers, FiTag, FiMail } from 'react-icons/fi'

function AdminSidebar() {
  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/admin/products', label: 'Products', icon: FiPackage },
    { path: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
    { path: '/admin/categories', label: 'Categories', icon: FiTag },
    { path: '/admin/users', label: 'Users', icon: FiUsers },
    { path: '/admin/inquiries', label: 'Inquiries', icon: FiMail },
  ]

  return (
    <div className="fixed left-0 top-0 h-full w-64 glass-dark border-r border-white/10 p-6">
      <div className="text-2xl font-bold text-white mb-8">⚙️ Admin</div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all ${
                isActive ? 'bg-white/10 text-white' : ''
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default AdminSidebar