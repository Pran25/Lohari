import { useState } from 'react'
import { FiUser, FiCpu, FiChevronDown, FiChevronUp, FiClock } from 'react-icons/fi'

function ChatMessage({ message }) {
  const [showSources, setShowSources] = useState(false)
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} mb-4`}>
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
          isUser ? 'bg-secondary/20 text-secondary' : 'bg-blue-500/20 text-blue-400'
        }`}
      >
        {isUser ? <FiUser /> : <FiCpu />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-secondary text-white'
              : 'glass text-white/90 border border-white/10'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>

          {/* Response time for AI */}
          {!isUser && message.responseTimeMs && (
            <div className="flex items-center gap-1 mt-2 text-xs text-white/40">
              <FiClock size={10} />
              <span>{(message.responseTimeMs / 1000).toFixed(1)}s</span>
            </div>
          )}
        </div>

        {/* Sources (only AI) */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-2 w-full">
            <button
              onClick={() => setShowSources(!showSources)}
              className="text-xs text-white/50 hover:text-white/80 transition-colors flex items-center gap-1"
            >
              {showSources ? <FiChevronUp /> : <FiChevronDown />}
              {message.sources.length} source{message.sources.length > 1 ? 's' : ''}
            </button>

            {showSources && (
              <div className="mt-2 space-y-2">
                {message.sources.map((src, idx) => (
                  <div
                    key={idx}
                    className="text-xs bg-white/5 border border-white/10 rounded-lg p-3 text-white/60"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-secondary font-semibold">
                        {src.type || 'UNKNOWN'}
                      </span>
                      <span className="text-white/30">#{idx + 1}</span>
                    </div>
                    <p className="line-clamp-4 whitespace-pre-wrap">{src.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage