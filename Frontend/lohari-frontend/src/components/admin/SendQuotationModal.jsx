import React, { useState, useEffect } from 'react'
import {
  FiX, FiSend, FiPackage, FiDollarSign,
  FiTrendingUp, FiInfo,
} from 'react-icons/fi'
import { generateQuotation } from '../../api/quotationApi'
import toast from 'react-hot-toast'

function SendQuotationModal({ isOpen, onClose, order }) {
  const [sending, setSending] = useState(false)

  // Form state
  const [form, setForm] = useState({
    weightPerItemKg: 25,
    ratePerKg: 100,
    labourCharges: 2000,
    designCharges: 500,
    transportCharges: 0,
    profitPercent: 15,
    gstPercent: 18,
    advancePercent: 30,
    validityDays: 15,
    notes: '',
  })

  // Reset on open
  useEffect(() => {
    if (isOpen && order) {
      setForm({
        weightPerItemKg: 25,
        ratePerKg: 100,
        labourCharges: 2000,
        designCharges: 500,
        transportCharges: 0,
        profitPercent: 15,
        gstPercent: 18,
        advancePercent: 30,
        validityDays: 15,
        notes: '',
      })
    }
  }, [isOpen, order])

  // Real-time calculation
  const calc = (() => {
    const qty = order?.quantity || 1
    const weightPer = Number(form.weightPerItemKg) || 0
    const rate = Number(form.ratePerKg) || 0
    const labour = Number(form.labourCharges) || 0
    const design = Number(form.designCharges) || 0
    const transport = Number(form.transportCharges) || 0
    const profitPct = Number(form.profitPercent) || 0
    const gstPct = Number(form.gstPercent) || 0
    const advPct = Number(form.advancePercent) || 0

    const totalWeight = weightPer * qty
    const metalCost = totalWeight * rate
    const subtotal = metalCost + labour + design + transport
    const profitAmount = (subtotal * profitPct) / 100
    const beforeGst = subtotal + profitAmount
    const gstAmount = (beforeGst * gstPct) / 100
    const grandTotal = beforeGst + gstAmount
    const advanceAmount = (grandTotal * advPct) / 100
    const balanceAmount = grandTotal - advanceAmount

    return {
      totalWeight,
      metalCost,
      subtotal,
      profitAmount,
      beforeGst,
      gstAmount,
      grandTotal,
      advanceAmount,
      balanceAmount,
    }
  })()

  const formatRs = (val) =>
    `₹${Number(val || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!order?.id) {
      toast.error('Order not found')
      return
    }

    setSending(true)
    toast.loading('Generating & sending quotation...', { id: 'quotation' })

    try {
      const payload = {
        orderId: order.id,
        weightPerItemKg: Number(form.weightPerItemKg),
        ratePerKg: Number(form.ratePerKg),
        labourCharges: Number(form.labourCharges),
        designCharges: Number(form.designCharges),
        transportCharges: Number(form.transportCharges),
        profitPercent: Number(form.profitPercent),
        gstPercent: Number(form.gstPercent),
        advancePercent: Number(form.advancePercent),
        validityDays: Number(form.validityDays),
        notes: form.notes,
      }

      const res = await generateQuotation(payload)
      toast.success(
        `Quotation ${res.quoteNumber} sent to ${order.customerEmail}! 📧`,
        { id: 'quotation' }
      )
      onClose()
    } catch (err) {
      console.error('Quotation error:', err)
      toast.error(
        err.response?.data?.message || 'Failed to send quotation',
        { id: 'quotation' }
      )
    } finally {
      setSending(false)
    }
  }

  if (!isOpen || !order) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900/95 backdrop-blur-2xl shadow-[0_20px_80px_-20px_rgba(0,0,0,0.9)]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-gradient-to-r from-cyan-500/[0.06] to-indigo-500/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center shadow-[0_0_20px_-4px_rgba(34,211,238,0.7)]">
              <FiSend className="text-white" size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Generate Quotation</h2>
              <p className="text-xs text-slate-400">
                Order #{order.orderNumber || order.id} · {order.customerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(92vh-140px)] p-6">

          {/* Order brief */}
          <div className="mb-6 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-400/[0.1] border border-cyan-400/20 flex items-center justify-center text-cyan-400">
              <FiPackage size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">
                {order.productName}
              </p>
              <p className="text-slate-400 text-xs">
                {order.material || 'Standard'} · {order.finish || 'Standard'} ·{' '}
                <span className="text-cyan-400 font-bold">Qty: {order.quantity}</span>
              </p>
            </div>
            {order.width && order.height && (
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                  Size
                </p>
                <p className="text-white text-sm font-bold">
                  {order.width} × {order.height} {order.unit || 'ft'}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ═══════════════ LEFT — Inputs ═══════════════ */}
            <div className="space-y-4">

              {/* Metal Details */}
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold text-cyan-400 mb-3 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-cyan-400" />
                  Metal Details
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Weight per Item (kg)"
                    name="weightPerItemKg"
                    value={form.weightPerItemKg}
                    onChange={handleChange}
                    type="number"
                  />
                  <InputField
                    label="Rate per kg (₹)"
                    name="ratePerKg"
                    value={form.ratePerKg}
                    onChange={handleChange}
                    type="number"
                  />
                </div>
              </div>

              {/* Extra Charges */}
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold text-cyan-400 mb-3 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-cyan-400" />
                  Extra Charges
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Labour (₹)"
                    name="labourCharges"
                    value={form.labourCharges}
                    onChange={handleChange}
                    type="number"
                  />
                  <InputField
                    label="Design (₹)"
                    name="designCharges"
                    value={form.designCharges}
                    onChange={handleChange}
                    type="number"
                  />
                  <InputField
                    label="Transport (₹)"
                    name="transportCharges"
                    value={form.transportCharges}
                    onChange={handleChange}
                    type="number"
                  />
                  <InputField
                    label="Profit %"
                    name="profitPercent"
                    value={form.profitPercent}
                    onChange={handleChange}
                    type="number"
                  />
                </div>
              </div>

              {/* Tax & Payment */}
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold text-cyan-400 mb-3 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-cyan-400" />
                  Tax & Payment
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <InputField
                    label="GST %"
                    name="gstPercent"
                    value={form.gstPercent}
                    onChange={handleChange}
                    type="number"
                  />
                  <InputField
                    label="Advance %"
                    name="advancePercent"
                    value={form.advancePercent}
                    onChange={handleChange}
                    type="number"
                  />
                  <InputField
                    label="Validity (days)"
                    name="validityDays"
                    value={form.validityDays}
                    onChange={handleChange}
                    type="number"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
                  Notes (optional)
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Any special notes for customer..."
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400/40 resize-none transition-all"
                />
              </div>
            </div>

            {/* ═══════════════ RIGHT — Preview ═══════════════ */}
            <div className="space-y-3">

              <div className="rounded-2xl border border-white/[0.06] bg-slate-950/50 p-5">

                <p className="text-[11px] uppercase tracking-wider font-bold text-cyan-400 mb-4 flex items-center gap-1.5">
                  <FiTrendingUp size={12} />
                  Live Preview
                </p>

                <div className="space-y-2.5 text-sm">

                  <PreviewRow
                    label={`Total Weight (${form.weightPerItemKg} × ${order.quantity})`}
                    value={`${calc.totalWeight.toFixed(1)} kg`}
                  />
                  <PreviewRow
                    label="Metal Cost"
                    value={formatRs(calc.metalCost)}
                  />
                  <PreviewRow label="Labour" value={formatRs(form.labourCharges)} />
                  <PreviewRow label="Design" value={formatRs(form.designCharges)} />
                  {Number(form.transportCharges) > 0 && (
                    <PreviewRow
                      label="Transport"
                      value={formatRs(form.transportCharges)}
                    />
                  )}

                  <div className="my-2 border-t border-white/[0.06]" />

                  <PreviewRow
                    label="Subtotal"
                    value={formatRs(calc.subtotal)}
                  />
                  <PreviewRow
                    label={`Profit (${form.profitPercent}%)`}
                    value={formatRs(calc.profitAmount)}
                  />
                  <PreviewRow
                    label="Before GST"
                    value={formatRs(calc.beforeGst)}
                  />
                  <PreviewRow
                    label={`GST (${form.gstPercent}%)`}
                    value={formatRs(calc.gstAmount)}
                  />

                  <div className="my-3 border-t border-white/[0.06]" />

                  {/* Grand Total */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-cyan-500/[0.12] to-indigo-500/[0.12] border border-cyan-400/20">
                    <span className="text-white font-bold text-sm">
                      GRAND TOTAL
                    </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300 font-black text-xl">
                      {formatRs(calc.grandTotal)}
                    </span>
                  </div>

                  <PreviewRow
                    label={`Advance (${form.advancePercent}%)`}
                    value={formatRs(calc.advanceAmount)}
                    accent
                  />
                  <PreviewRow
                    label="Balance Due"
                    value={formatRs(calc.balanceAmount)}
                  />
                </div>

                {/* Info */}
                <div className="mt-4 p-3 rounded-xl bg-amber-500/[0.08] border border-amber-400/20 flex gap-2">
                  <FiInfo
                    className="text-amber-400 shrink-0 mt-0.5"
                    size={14}
                  />
                  <p className="text-[11px] text-amber-200/90 leading-relaxed">
                    Quotation PDF will be generated and sent to{' '}
                    <strong>{order.customerEmail}</strong> with admin as CC.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06] bg-slate-950/50">
          <button
            onClick={onClose}
            disabled={sending}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] disabled:opacity-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={sending}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-indigo-400 shadow-[0_0_24px_-6px_rgba(34,211,238,0.7)] hover:shadow-[0_0_32px_-4px_rgba(99,102,241,0.9)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
          >
            {sending ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <FiSend size={14} />
                Send Quotation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------- Helper: Input Field ---------- */
function InputField({ label, name, value, onChange, type = 'number' }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        min="0"
        step={type === 'number' ? '0.01' : '1'}
        className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.05] transition-all"
      />
    </div>
  )
}

/* ---------- Helper: Preview Row ---------- */
function PreviewRow({ label, value, accent = false }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span
        className={
          accent
            ? 'text-cyan-400 font-bold'
            : 'text-white font-semibold'
        }
      >
        {value}
      </span>
    </div>
  )
}

export default SendQuotationModal