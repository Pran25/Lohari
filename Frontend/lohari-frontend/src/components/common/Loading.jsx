function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/[0.08] rounded-full blur-[120px]" />
      </div>

      <div className="relative flex flex-col items-center gap-5">
        {/* Spinner with gradient */}
        <div className="relative">
          {/* Outer ring */}
          <div className="w-16 h-16 rounded-full border-2 border-white/[0.06]" />
          {/* Inner spinning ring */}
          <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-t-cyan-400 border-r-indigo-400 animate-spin" />
          {/* Glow */}
          <div className="absolute inset-0 w-16 h-16 rounded-full bg-cyan-400/20 blur-xl animate-pulse" />
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-white font-semibold tracking-wide text-sm uppercase">
            Loading
          </p>
          <div className="flex gap-1">
            <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loading