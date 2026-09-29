import React, { useState } from 'react'
import { FiTag, FiX, FiCheck, FiLoader } from 'react-icons/fi'
import axios from '../../api/axios'
import toast from 'react-hot-toast'

/**
 * Coupon Input Component
 *
 * Props:
 *   - orderAmount: number — cart subtotal
 *   - customerEmail: string — logged-in user email
 *   - appliedCoupon: object | null — currently applied coupon
 *   - onApply: (couponData) => void — called when coupon applied
 *   - onRemove: () => void — called when coupon removed
 */
function CouponInput({
  orderAmount = 0,
  customerEmail = '',
  appliedCoupon = null,
  onApply,
  onRemove,
}) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showInput, setShowInput] = useState(!appliedCoupon)

  // ============================================
  // APPLY COUPON
  // ============================================
  const handleApply = async () => {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) {
      setError('Please enter a coupon code')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await axios.post('/coupons/validate', {
        code: trimmed,
        orderAmount: Number(orderAmount),
        customerEmail: customerEmail || null,
      })

      const data = res.data

      if (data.valid) {
        // Success
        onApply?.({
          code: data.code,
          type: data.type,
          discountAmount: Number(data.discountAmount) || 0,
          originalAmount: Number(data.originalAmount) || orderAmount,
          finalAmount: Number(data.finalAmount) || orderAmount,
        })
        setShowInput(false)
        toast.success(`Coupon applied! You saved ₹${Number(data.discountAmount).toLocaleString('en-IN')}`)
      } else {
        // Failed
        setError(data.message || 'Invalid coupon code')
        toast.error(data.message || 'Invalid coupon')
      }
    } catch (err) {
      console.error('Coupon validation error:', err)
      const msg = err.response?.data?.message || 'Failed to validate coupon'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  // ============================================
  // REMOVE COUPON
  // ============================================
  const handleRemove = () => {
    setCode('')
    setError('')
    setShowInput(true)
    onRemove?.()
    toast.success('Coupon removed')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleApply()
    }
  }

  // ============================================
  // RENDER — APPLIED COUPON
  // ============================================
  if (appliedCoupon && !showInput) {
    return (
      <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/[0.06] p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
              <FiCheck size={16} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-mono font-bold text-sm">
                  {appliedCoupon.code}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300">
                  Applied
                </span>
              </div>
              <p className="text-emerald-300/80 text-xs mt-0.5">
                You saved ₹{Number(appliedCoupon.discountAmount || 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <button
            onClick={handleRemove}
            className="p-2 rounded-lg text-emerald-400 hover:text-rose-400 hover:bg-rose-500/[0.08] transition-all shrink-0"
            title="Remove coupon"
          >
            <FiX size={16} />
          </button>
        </div>
      </div>
    )
  }

  // ============================================
  // RENDER — INPUT FORM
  // ============================================
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 mb-2.5">
        <FiTag className="text-cyan-400" size={14} />
        <span className="text-[11px] uppercase tracking-wider font-bold text-slate-300">
          Have a coupon code?
        </span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase())
            if (error) setError('')
          }}
          onKeyDown={handleKeyDown}
          placeholder="Enter code (e.g., SAVE10)"
          disabled={loading}
          className={`flex-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border text-white text-sm font-mono uppercase tracking-wide placeholder-slate-500 placeholder:tracking-normal placeholder:font-sans focus:outline-none transition-all ${
            error
              ? 'border-rose-500/50 focus:border-rose-400'
              : 'border-white/[0.08] focus:border-cyan-400/40 focus:bg-white/[0.05]'
          }`}
        />
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_-6px_rgba(34,211,238,0.6)] hover:shadow-[0_0_28px_-4px_rgba(99,102,241,0.8)] hover:scale-[1.03] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin" size={14} />
              <span className="hidden sm:inline">Checking...</span>
            </>
          ) : (
            <>
              <FiCheck size={14} />
              <span>Apply</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="text-rose-400 text-xs mt-2 flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-rose-400" />
          {error}
        </p>
      )}

      <p className="text-slate-500 text-[11px] mt-2">
        💡 Try public coupons like <span className="font-mono text-slate-400">SAVE10</span>
      </p>
    </div>
  )
}

export default CouponInput