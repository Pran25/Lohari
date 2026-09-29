import React, { useState, useRef, useEffect } from 'react'
import {
  FiSend, FiRefreshCw, FiCpu, FiDatabase,
  FiZap, FiTrendingUp, FiPackage, FiDollarSign,
  FiClock, FiUsers,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { askQuestion, syncData } from '../api/ragApi'
import ChatMessage from '../components/rag/ChatMessage'

function RagChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm your AI assistant for Lohari Fabrication. Ask me anything about orders, products, or customers.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userQuestion = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userQuestion }])
    setLoading(true)

    try {
      const res = await askQuestion(userQuestion, 5)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.answer,
          sources: res.sources,
          responseTimeMs: res.responseTimeMs,
        },
      ])
    } catch (err) {
      console.error('RAG error:', err)
      toast.error('Failed to get answer')
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    if (syncing) return
    setSyncing(true)
    toast.loading('Syncing data...', { id: 'sync' })

    try {
      const res = await syncData()
      toast.success(`Synced ${res.totalIngested} items`, { id: 'sync' })
    } catch (err) {
      console.error('Sync error:', err)
      toast.error('Sync failed', { id: 'sync' })
    } finally {
      setSyncing(false)
    }
  }

  /* Suggestions with icons */
  const suggestions = [
    {
      icon: <FiPackage size={14} />,
      label: 'Total Orders',
      query: 'How many total orders are there?',
    },
    {
      icon: <FiTrendingUp size={14} />,
      label: 'Latest Order',
      query: 'Tell me about the latest order',
    },
    {
      icon: <FiDollarSign size={14} />,
      label: 'Revenue',
      query: 'What is the total revenue?',
    },
    {
      icon: <FiClock size={14} />,
      label: 'Pending',
      query: 'List all pending orders',
    },
  ]

  return (
    <div className="container-custom py-8 pt-28">

      {/* ═══════════════════════════════ */}
      {/* HEADER */}
      {/* ═══════════════════════════════ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-cyan-400 border border-cyan-400/20 bg-cyan-400/[0.05] rounded-full mb-3">
            <FiZap size={10} />
            AI Powered
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center shadow-[0_0_24px_-6px_rgba(34,211,238,0.7)]">
              <FiCpu className="text-white" size={20} />
            </span>
            AI Assistant
          </h1>
          <p className="text-slate-400 mt-2">
            Ask questions about your business data
          </p>
        </div>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/[0.1] bg-white/[0.04] text-white font-semibold text-sm hover:bg-white/[0.08] hover:border-white/[0.2] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <FiRefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Syncing...' : 'Sync Data'}
        </button>
      </div>

      {/* ═══════════════════════════════ */}
      {/* CHAT CONTAINER */}
      {/* ═══════════════════════════════ */}
      <div className="rounded-3xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-xl overflow-hidden flex flex-col h-[calc(100vh-280px)] min-h-[520px]">

        {/* Chat top bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center">
                <FiCpu className="text-white" size={14} />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
            </div>
            <div>
              <p className="text-white text-[13px] font-bold">Lohari AI</p>
              <p className="text-slate-500 text-[10px] uppercase tracking-wider">
                Online · Powered by Ollama
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <FiDatabase size={11} className="text-cyan-400" />
            <span className="text-[10px] text-slate-400 font-medium">RAG Active</span>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))}

          {loading && (
            <div className="flex gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center shrink-0 shadow-[0_0_16px_-4px_rgba(34,211,238,0.6)]">
                <FiCpu className="text-white" size={14} />
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                <div className="flex gap-1">
                  <span
                    className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0s' }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions — only on fresh chat */}
        {messages.length === 1 && (
          <div className="px-5 md:px-6 pb-4">
            <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-bold mb-2.5">
              Try asking
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(s.query)}
                  className="group flex flex-col items-start gap-1.5 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-cyan-400/30 hover:bg-cyan-400/[0.05] transition-all text-left"
                >
                  <span className="w-7 h-7 rounded-lg bg-cyan-400/[0.1] border border-cyan-400/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    {s.icon}
                  </span>
                  <span className="text-[11px] font-bold text-white truncate w-full">
                    {s.label}
                  </span>
                  <span className="text-[10px] text-slate-500 line-clamp-2">
                    {s.query}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="p-4 border-t border-white/[0.06] bg-slate-950/40"
        >
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your orders, products, customers..."
                className="w-full pl-4 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.05] transition-all"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 font-bold shadow-[0_0_24px_-6px_rgba(34,211,238,0.7)] hover:shadow-[0_0_32px_-4px_rgba(99,102,241,0.9)] hover:scale-[1.03] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
              aria-label="Send"
            >
              <FiSend size={18} />
            </button>
          </div>
          <p className="text-[10px] text-slate-600 text-center mt-2.5">
            AI may make mistakes. Verify important information.
          </p>
        </form>
      </div>
    </div>
  )
}

export default RagChat