'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ArrowRight, ArrowLeft } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { fieldTypes } from '@/lib/mock-data'
import { BrandLogo } from '@/components/brand-logo'

function Cloud({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 320 100" className={className} style={style} xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <circle cx="80" cy="72" r="52" />
      <circle cx="140" cy="58" r="58" />
      <circle cx="205" cy="68" r="48" />
      <circle cx="252" cy="76" r="42" />
      <rect x="38" y="72" width="256" height="28" />
    </svg>
  )
}

const particles = [
  { x: 8, y: 10, size: 3, dur: 3.5, delay: 0.2 },
  { x: 20, y: 22, size: 2, dur: 4.0, delay: 0.6 },
  { x: 78, y: 12, size: 3, dur: 3.6, delay: 0.4 },
  { x: 90, y: 25, size: 2, dur: 4.2, delay: 1.0 },
  { x: 50, y: 5, size: 2, dur: 3.3, delay: 0.8 },
]

export default function TypeSelectionPage() {
  const router = useRouter()
  const { field, type, setType } = useAppStore()
  const [selected, setSelected] = useState<string | null>(type)
  const [customOther, setCustomOther] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!field) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ 
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          background: 'linear-gradient(180deg,#a8c8e8 0%,#c0d9f0 14%,#d8edf8 30%,#edf5fb 48%,#f3e9da 72%,#ecdcc8 100%)'
        }}
      >
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-xl shadow-black/5 border border-white/60 text-center">
          <p className="text-xl font-bold text-[#172b44] mb-4">Please select a field first</p>
          <button 
            onClick={() => router.push('/onboarding/field')}
            className="flex items-center justify-center gap-2 bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold py-3 px-6 rounded-2xl shadow-lg shadow-orange-300/40 transition-all hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const types = fieldTypes[field as keyof typeof fieldTypes] || []

  const handleSelect = (typeId: string) => {
    setSelected(typeId)
    setShowCustom(false)
  }

  const handleCustom = () => {
    setShowCustom(true)
    setSelected('custom')
  }

  const handleContinue = () => {
    if (selected === 'custom' && customOther) {
      setType(customOther)
      router.push('/signup')
    } else if (selected && selected !== 'custom') {
      setType(selected)
      router.push('/signup')
    }
  }

  return (
    <div 
      className="min-h-screen flex flex-col overflow-hidden"
      style={{ 
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        background: 'linear-gradient(180deg,#a8c8e8 0%,#c0d9f0 14%,#d8edf8 30%,#edf5fb 48%,#f3e9da 72%,#ecdcc8 100%)'
      }}
    >
      {/* Floating particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/60 pointer-events-none"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ opacity: [0.25, 0.75, 0.25], y: [0, -12, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* Navbar */}
      <nav className="relative z-50 px-6 lg:px-14 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <BrandLogo href="/" width={184} height={38} className="rounded-lg object-cover object-center" />
          
          {/* Progress indicator */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-1 bg-[#f97316] rounded-full" />
            <div className="w-8 h-1 bg-[#f97316] rounded-full" />
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-4xl"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/65 backdrop-blur-sm text-[#172b44] text-xs font-semibold px-4 py-2 rounded-full border border-white/50 shadow-sm mb-6"
            >
              <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full animate-pulse" />
              Step 2 of 2 · {field}
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-4xl sm:text-5xl font-extrabold text-[#172b44] tracking-tight mb-4"
            >
              Choose Your Specialization
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="text-[#3d5f80] text-lg max-w-lg mx-auto"
            >
              Pick the area that interests you most for tailored content
            </motion.p>
          </div>

          {/* Type Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8"
          >
            {types.map((t, index) => (
              <motion.button
                key={t}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.32 + index * 0.04, duration: 0.3 }}
                onClick={() => handleSelect(t)}
                className={`relative p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 min-h-[100px] group ${
                  selected === t
                    ? 'bg-white/90 border-[#172b44] shadow-xl shadow-black/10'
                    : 'bg-white/60 backdrop-blur-sm border-white/60 hover:bg-white/80 hover:border-white/80 hover:shadow-lg'
                }`}
              >
                <span className={`font-semibold text-sm text-center transition-colors ${
                  selected === t ? 'text-[#172b44]' : 'text-[#3d5f80] group-hover:text-[#172b44]'
                }`}>{t}</span>

                {/* Checkmark */}
                {selected === t && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2.5 right-2.5 w-5 h-5 bg-[#172b44] rounded-full flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </motion.button>
            ))}

            {/* Other Option */}
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.32 + types.length * 0.04, duration: 0.3 }}
              onClick={handleCustom}
              className={`relative p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 min-h-[100px] group ${
                selected === 'custom'
                  ? 'bg-white/90 border-[#172b44] shadow-xl shadow-black/10'
                  : 'bg-white/60 backdrop-blur-sm border-white/60 hover:bg-white/80 hover:border-white/80 hover:shadow-lg'
              }`}
            >
              <span className={`font-semibold text-sm transition-colors ${
                selected === 'custom' ? 'text-[#172b44]' : 'text-[#3d5f80] group-hover:text-[#172b44]'
              }`}>Other</span>

              {/* Checkmark */}
              {selected === 'custom' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2.5 right-2.5 w-5 h-5 bg-[#172b44] rounded-full flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </motion.button>
          </motion.div>

          {/* Custom Input */}
          {showCustom && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <label className="text-sm font-semibold text-[#172b44] block mb-3">Enter your specialization</label>
              <input
                type="text"
                placeholder="e.g., Cybersecurity, DevOps, Quantum Computing..."
                value={customOther}
                onChange={(e) => setCustomOther(e.target.value)}
                autoFocus
                className="w-full px-5 py-4 rounded-2xl bg-white/70 backdrop-blur-sm border-2 border-white/60 text-[#172b44] placeholder-[#8aaac8] text-sm outline-none focus:bg-white/90 focus:border-[#172b44]/30 transition-all shadow-sm"
              />
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <button 
              onClick={() => router.push('/onboarding/field')}
              className="sm:w-auto flex items-center justify-center gap-2 bg-white/60 backdrop-blur-sm hover:bg-white/80 text-[#172b44] font-semibold py-4 px-6 rounded-2xl border border-white/60 transition-all hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            
            <button
              onClick={handleContinue}
              disabled={!selected || (selected === 'custom' && !customOther)}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 font-semibold py-4 px-8 rounded-2xl transition-all ${
                selected && (selected !== 'custom' || customOther)
                  ? 'bg-[#f97316] hover:bg-[#ea6c0a] text-white shadow-lg shadow-orange-300/40 hover:-translate-y-0.5 hover:shadow-xl'
                  : 'bg-[#172b44]/20 text-[#172b44]/40 cursor-not-allowed'
              }`}
            >
              Complete Setup
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Side clouds LEFT */}
      <div className="absolute left-0 top-0 bottom-0 hidden lg:block pointer-events-none z-0" style={{ width: '250px' }}>
        <motion.div
          className="absolute"
          style={{ top: '22%', left: '-35px' }}
          animate={{ x: [0, 8, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div style={{ filter: 'blur(14px)', opacity: 0.38 }}>
            <Cloud style={{ width: 280, height: 'auto', color: '#ffffff' }} />
          </div>
        </motion.div>
      </div>

      {/* Side clouds RIGHT */}
      <div className="absolute right-0 top-0 bottom-0 hidden lg:block pointer-events-none z-0" style={{ width: '250px' }}>
        <motion.div
          className="absolute"
          style={{ top: '38%', right: '-40px' }}
          animate={{ x: [0, -8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          <div style={{ filter: 'blur(14px)', opacity: 0.38 }}>
            <Cloud style={{ width: 290, height: 'auto', color: '#ffffff' }} />
          </div>
        </motion.div>
      </div>

      {/* Bottom clouds */}
      <div className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none overflow-hidden z-0">
        <Cloud style={{ position: 'absolute', width: 340, height: 'auto', bottom: -24, left: '-2%', color: '#efe3d0', opacity: 0.85 }} />
        <Cloud style={{ position: 'absolute', width: 380, height: 'auto', bottom: 6, left: '28%', color: '#f5e8d8', opacity: 0.7 }} />
        <Cloud style={{ position: 'absolute', width: 360, height: 'auto', bottom: -16, right: '18%', color: '#ecdcc8', opacity: 0.88 }} />
        <Cloud style={{ position: 'absolute', width: 320, height: 'auto', bottom: -20, right: '-2%', color: '#f3e9da', opacity: 0.75 }} />
      </div>
    </div>
  )
}
