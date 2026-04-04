'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ArrowRight, ArrowLeft, Code2, Scale, Briefcase, Stethoscope } from 'lucide-react'
import { useAppStore } from '@/lib/store'
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
  { x: 5, y: 12, size: 3, dur: 3.2, delay: 0 },
  { x: 18, y: 25, size: 2, dur: 4.1, delay: 0.4 },
  { x: 82, y: 8, size: 3, dur: 3.7, delay: 0.8 },
  { x: 92, y: 22, size: 2, dur: 4.5, delay: 1.2 },
  { x: 55, y: 6, size: 2, dur: 3.0, delay: 0.6 },
]

const fields = [
  { 
    id: 'engineering', 
    label: 'Engineering', 
    icon: Code2,
    color: '#2563eb',
    bgColor: '#2563eb15',
    description: 'Software, AI, Web Dev & more'
  },
  { 
    id: 'law', 
    label: 'Law', 
    icon: Scale,
    color: '#7c3aed',
    bgColor: '#7c3aed15',
    description: 'Legal studies & practice'
  },
  { 
    id: 'business', 
    label: 'Business', 
    icon: Briefcase,
    color: '#f97316',
    bgColor: '#f9731615',
    description: 'Finance, Marketing & MBA'
  },
  { 
    id: 'medical', 
    label: 'Medical', 
    icon: Stethoscope,
    color: '#059669',
    bgColor: '#05966915',
    description: 'Healthcare & Life Sciences'
  },
]

export default function FieldSelectionPage() {
  const router = useRouter()
  const { field, setField } = useAppStore()
  const [selected, setSelected] = useState<string | null>(field)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleSelect = (fieldId: string) => {
    setSelected(fieldId)
  }

  const handleContinue = () => {
    if (selected) {
      const selectedField = fields.find((f) => f.id === selected)
      if (selectedField) {
        setField(selectedField.label)
        router.push('/onboarding/type')
      }
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
            <div className="w-8 h-1 bg-[#172b44]/20 rounded-full" />
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-2xl"
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
              Step 1 of 2
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-4xl sm:text-5xl font-extrabold text-[#172b44] tracking-tight mb-4"
            >
              Choose Your Field
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="text-[#3d5f80] text-lg max-w-md mx-auto"
            >
              Select your area of interest to get personalized learning paths
            </motion.p>
          </div>

          {/* Field Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10"
          >
            {fields.map((f, index) => {
              const Icon = f.icon
              return (
                <motion.button
                  key={f.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + index * 0.08, duration: 0.4 }}
                  onClick={() => handleSelect(f.id)}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 flex items-center gap-5 text-left group ${
                    selected === f.id
                      ? 'bg-white/90 border-[#172b44] shadow-xl shadow-black/10'
                      : 'bg-white/60 backdrop-blur-sm border-white/60 hover:bg-white/80 hover:border-white/80 hover:shadow-lg'
                  }`}
                >
                  {/* Icon */}
                  <div 
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                      selected === f.id ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                    style={{ backgroundColor: f.bgColor }}
                  >
                    <Icon className="w-7 h-7" style={{ color: f.color }} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-[#172b44] text-lg block mb-1">{f.label}</span>
                    <span className="text-sm text-[#3d5f80]">{f.description}</span>
                  </div>

                  {/* Checkmark */}
                  {selected === f.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 w-6 h-6 bg-[#172b44] rounded-full flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link href="/" className="sm:w-auto">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/60 backdrop-blur-sm hover:bg-white/80 text-[#172b44] font-semibold py-4 px-6 rounded-2xl border border-white/60 transition-all hover:-translate-y-0.5">
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </Link>
            
            <button
              onClick={handleContinue}
              disabled={!selected}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 font-semibold py-4 px-8 rounded-2xl transition-all ${
                selected
                  ? 'bg-[#f97316] hover:bg-[#ea6c0a] text-white shadow-lg shadow-orange-300/40 hover:-translate-y-0.5 hover:shadow-xl'
                  : 'bg-[#172b44]/20 text-[#172b44]/40 cursor-not-allowed'
              }`}
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Side clouds LEFT */}
      <div className="absolute left-0 top-0 bottom-0 hidden lg:block pointer-events-none z-0" style={{ width: '280px' }}>
        <motion.div
          className="absolute"
          style={{ top: '18%', left: '-30px' }}
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div style={{ filter: 'blur(14px)', opacity: 0.4 }}>
            <Cloud style={{ width: 300, height: 'auto', color: '#ffffff' }} />
          </div>
        </motion.div>
      </div>

      {/* Side clouds RIGHT */}
      <div className="absolute right-0 top-0 bottom-0 hidden lg:block pointer-events-none z-0" style={{ width: '280px' }}>
        <motion.div
          className="absolute"
          style={{ top: '35%', right: '-35px' }}
          animate={{ x: [0, -10, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        >
          <div style={{ filter: 'blur(14px)', opacity: 0.4 }}>
            <Cloud style={{ width: 320, height: 'auto', color: '#ffffff' }} />
          </div>
        </motion.div>
      </div>

      {/* Bottom clouds */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none overflow-hidden z-0">
        <Cloud style={{ position: 'absolute', width: 360, height: 'auto', bottom: -22, left: '-2%', color: '#efe3d0', opacity: 0.88 }} />
        <Cloud style={{ position: 'absolute', width: 400, height: 'auto', bottom: 8, left: '22%', color: '#f5e8d8', opacity: 0.72 }} />
        <Cloud style={{ position: 'absolute', width: 380, height: 'auto', bottom: -12, left: '48%', color: '#ecdcc8', opacity: 0.9 }} />
        <Cloud style={{ position: 'absolute', width: 340, height: 'auto', bottom: -20, right: '-2%', color: '#f3e9da', opacity: 0.78 }} />
      </div>
    </div>
  )
}
