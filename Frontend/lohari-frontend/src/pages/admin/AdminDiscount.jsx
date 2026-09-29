import React, { useState, useEffect } from 'react'
import axios from '../../api/axios'
import toast from 'react-hot-toast'
import { FiX, FiTag, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'

function AdminDiscount({ isOpen, onClose, order, onSuccess }) {
  const [discountAmount, setDiscountAmount] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Order change hone pe form reset karo
  useEffect(() => {
    if (isOpen) {
      setDiscountAmount('')
      setReason('')
      setError('')
    }
  }, [isOpen, order])

  if (!isOpen || !order) return null

  // Pricing calculations
  const baseAmount = Number(order.originalAmount ?? order.totalAmount ?? 0)
  const couponDiscount = Number(order.discountAmount ?? 0)
  const existingManual = Number(order.manualDiscount ?? 0)
  const currentTotal = Number(order.totalAmount ?? 0)

  const enteredAmount = parseFloat(discountAmount) || 0
  const maxAllowed = baseAmount - couponDiscount
  const newTotal = Math.max(0, baseAmount - couponDiscount - enteredAmount)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const amount = parseFloat(discountAmount)

    if (!amount || amount <= 0) {
      setError('Discount amount 0 se bada hona chahiye')
      return
    }

    if (amount > maxAllowed) {
      setError(`Discount ₹${maxAllowed.toLocaleString()} se zyada nahi ho sakta`)
      return
    }

    try {
      setLoading(true)

      const response = await axios.put(
        `/orders/admin/${order.id}/discount`,
        {
          discountAmount: amount,
          reason: reason.trim() || 'Special discount from admin',
        }
      )

      toast.success(`Discount ₹${amount.toLocaleString()} applied!`)
      onSuccess?.(response.data)
      onClose?.()
    } catch (err) {
      console.error('❌ Discount apply failed:', err)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to apply discount'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-gradient-to-r from-emerald-400/[0.08] to-cyan-400/[0.08]">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-emerald-400/[0.12] border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <FiTag size={18} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">Apply Discount</h2>
              <p className="text-slate-400 text-xs font-mono">
                {order.orderNumber || `#${order.id}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all disabled:opacity-50"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* PRICING SUMMARY */}
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Base Amount</span>
              <span className="text-white font-medium">
                ₹{baseAmount.toLocaleString()}
              </span>
            </div>

            {couponDiscount > 0 && (
              <div className="flex justify-between text-slate-400">
                <span>Coupon Discount</span>
                <span className="text-emerald-400 font-medium">
                  − ₹{couponDiscount.toLocaleString()}
                </span>
              </div>
            )}

            {existingManual > 0 && (
              <div className="flex justify-between text-slate-400">
                <span>Existing Manual Discount</span>
                <span className="text-amber-400 font-medium">
                  − ₹{existingManual.toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex justify-between pt-2 border-t border-white/[0.06]">
              <span className="text-slate-300 font-semibold">Current Total</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300 font-bold">
                ₹{currentTotal.toLocaleString()}
              </span>
            </div>

            {enteredAmount > 0 && (
              <div className="flex justify-between pt-2 border-t border-white/[0.06]">
                <span className="text-slate-300 font-semibold">New Total</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300 font-bold text-base">
                  ₹{newTotal.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* DISCOUNT AMOUNT */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
              Discount Amount (₹) <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              min="1"
              step="0.01"
              max={maxAllowed}
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value)}
              placeholder={`Max ₹${maxAllowed.toLocaleString()}`}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400/40 focus:bg-white/[0.05] transition-all"
              required
              disabled={loading}
              autoFocus
            />
            <p className="mt-1.5 text-[11px] text-slate-500">
              Max allowed: <span className="text-emerald-400 font-semibold">₹{maxAllowed.toLocaleString()}</span>
            </p>
          </div>

          {/* REASON */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
              Reason (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Loyal customer, Festival offer, Bulk order..."
              rows={2}
              maxLength={255}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400/40 focus:bg-white/[0.05] transition-all resize-none"
              disabled={loading}
            />
            <p className="mt-1 text-[11px] text-slate-500 text-right">
              {reason.length}/255
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-rose-500/[0.08] border border-rose-400/30 text-rose-300 text-xs">
              <FiAlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.05] hover:text-white disabled:opacity-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !discountAmount}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_20px_-6px_rgba(52,211,153,0.7)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent" />
                  Applying...
                </>
              ) : (
                <>
                  <FiCheckCircle size={14} />
                  Apply Discount
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminDiscount