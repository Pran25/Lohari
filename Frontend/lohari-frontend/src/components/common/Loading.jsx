import React from 'react'

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white/70 text-lg">Loading...</p>
      </div>
    </div>
  )
}

export default Loading