import React from 'react'
import { useAuth } from '../context/AuthContext'
import { FiUser, FiMail, FiPhone, FiShield } from 'react-icons/fi'

function Profile() {
  const { user } = useAuth()

  return (
    <div className="container-custom py-20">
      <h1 className="section-title">My Profile</h1>
      
      <div className="max-w-2xl mx-auto">
        <div className="glass p-8 rounded-2xl">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-purple-500 
                          flex items-center justify-center text-3xl font-bold text-white
                          shadow-[0_0_30px_rgba(230,126,34,0.3)]">
              {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.fullName || 'User'}</h2>
              <p className="text-white/50">{user?.role || 'Customer'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 glass p-3 rounded-xl">
              <FiUser className="text-secondary" />
              <div>
                <p className="text-white/50 text-sm">Full Name</p>
                <p className="text-white">{user?.fullName || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 glass p-3 rounded-xl">
              <FiMail className="text-secondary" />
              <div>
                <p className="text-white/50 text-sm">Email</p>
                <p className="text-white">{user?.email || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 glass p-3 rounded-xl">
              <FiPhone className="text-secondary" />
              <div>
                <p className="text-white/50 text-sm">Phone</p>
                <p className="text-white">{user?.phone || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 glass p-3 rounded-xl">
              <FiShield className="text-secondary" />
              <div>
                <p className="text-white/50 text-sm">Role</p>
                <p className="text-white">{user?.role || 'Customer'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile