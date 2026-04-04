'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, ArrowRight, Plus, Download, TrendingUp, BookOpen, Target, Flame, Sparkles, Heart, Zap, Lock, Loader2 } from 'lucide-react'
import { mockInterests } from '@/lib/mock-data'
import { useAppStore } from '@/lib/store'

const PRIMARY = '#172b44'
const ACCENT = '#f97316'
const PRIMARY_LIGHT = '#e8f1f8'

const fade = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }

// Soft, professional colors instead of heavy gradients
const interestColors = [
  '#4f46e5', // Indigo
  '#0891b2', // Cyan
  '#ea580c', // Orange
  '#be185d', // Pink
  '#0d9488', // Teal
  '#7c3aed', // Violet
]

export default function InterestsPage() {
  const router = useRouter()
  const { interests, addInterest, updateInterest, uploadedHistory } = useAppStore()
  const [mounted, setMounted] = useState(false)
  const [redirectingInterest, setRedirectingInterest] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    if (interests.length === 0) {
      mockInterests.forEach((i) => addInterest({ id: i.id, name: i.name, status: 'pending' }))
    }
  }, [])

  if (!mounted) return null

  const accepted = interests.filter((i) => i.status === 'accepted')
  const pending = interests.filter((i) => i.status === 'pending')

  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6">

      {/* ── Header ── */}
      <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: PRIMARY }}>Your Interests</h1>
            {uploadedHistory && (
              <span className="flex items-center gap-1 bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-full">
                <Sparkles className="w-3 h-3" /> Personalized
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            {uploadedHistory 
              ? 'Tailored recommendations based on your learning history.' 
              : 'Select topics to build completely personalized learning paths.'}
          </p>
        </div>
      </motion.div>

      {/* ── Stat cards ── */}
      <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <motion.div
          variants={fade}
          className="rounded-2xl p-5 relative overflow-hidden col-span-1 shadow-lg"
          style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #2c4a6a 100%)` }}
        >
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
          <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
            <Target className="w-3.5 h-3.5 text-white" />
          </div>
          <p className="text-white/70 text-xs font-medium mt-1">Total Interests</p>
          <p className="text-white text-4xl font-black mt-1">{interests.length}</p>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="flex items-center gap-1 bg-white/15 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Tracked Topics
            </span>
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div variants={fade} className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 relative shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
            <Flame className="w-3.5 h-3.5 text-orange-600" />
          </div>
          <p className="text-muted-foreground text-xs font-medium mt-1">Active Paths</p>
          <p className="text-3xl font-black mt-1" style={{ color: PRIMARY }}>{accepted.length}</p>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-semibold">
              <TrendingUp className="w-2.5 h-2.5" /> Getting started
            </span>
          </div>
        </motion.div>

        {/* Card 3 */}
        <motion.div variants={fade} className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 relative shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <p className="text-muted-foreground text-xs font-medium mt-1">Recommended</p>
          <p className="text-3xl font-black mt-1" style={{ color: PRIMARY }}>{pending.length}</p>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="flex items-center gap-1 text-blue-600 text-[10px] font-semibold">
              New suggestions
            </span>
          </div>
        </motion.div>
        
        {/* Card 4 */}
        <motion.div variants={fade} className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 relative shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="text-muted-foreground text-xs font-medium mt-1">Completed</p>
          <p className="text-3xl font-black mt-1" style={{ color: PRIMARY }}>0</p>
          <p className="text-muted-foreground text-[10px] font-medium mt-3">Keep it up!</p>
        </motion.div>
      </motion.div>

      {/* ── Active Learning Paths Removed ── */}

      {/* ── Curated for You ── */}
      {pending.length > 0 && (
        <motion.div variants={stagger} className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-base" style={{ color: PRIMARY }}>Curated for You</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Recommendations to explore next</p>
            </div>
            <span className="text-[10px] font-semibold text-muted-foreground/70 uppercase">
              {pending.length} Topics
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pending.slice(0, 4).map((interest, idx) => {
              const details = mockInterests.find((m) => m.id === interest.id)
              const gIdx = (idx + accepted.length) % interestColors.length
              const color = interestColors[gIdx]
              const Icon = (() => {
                try { return require('lucide-react')[details?.icon || 'Heart'] || Heart } catch { return Heart }
              })()
              const isUnlocked = idx === 0
              
              return (
                <motion.div
                  key={interest.id}
                  variants={fade}
                  className={`group relative rounded-xl border border-border/50 bg-white shadow-sm p-4 flex flex-col transition-all ${
                    isUnlocked ? 'hover:shadow-md border-orange-200' : 'opacity-50 grayscale select-none pointer-events-none scale-95'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div 
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-transform ${isUnlocked ? 'group-hover:scale-105' : ''}`}
                      style={{ background: color + '15' }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    
                    {!isUnlocked ? (
                      <Lock className="w-4 h-4 text-slate-400" />
                    ) : (
                      <span className="text-[10px] bg-orange-50 text-orange-600 font-bold px-2.5 py-0.5 rounded-full border border-orange-100 flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3" /> Unlocked
                      </span>
                    )}
                  </div>
                  
                  <div className="mb-4 flex-1">
                    <h3 className={`font-bold text-sm mb-1 ${isUnlocked ? 'text-[#172b44]' : 'text-slate-500'}`}>{interest.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{details?.description}</p>
                  </div>
                  
                  {/* Action Area */}
                  <div className="mt-auto border-t border-slate-100 pt-3">
                    {isUnlocked ? (
                      <div className="flex flex-col gap-2">
                        <p className="text-[11px] font-extrabold text-center text-[#172b44] mb-0.5">Is this your correct interest?</p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              setRedirectingInterest(interest.name)
                              updateInterest(interest.id, 'accepted')
                              setTimeout(() => router.push('/dashboard/courses'), 1500)
                            }}
                            className="py-1.5 flex items-center justify-center rounded-lg text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 transition-all hover:bg-emerald-500 hover:text-white shadow-sm"
                          >
                            YES
                          </button>
                          <button
                            onClick={() => updateInterest(interest.id, 'rejected')}
                            className="py-1.5 flex items-center justify-center rounded-lg text-xs font-black text-rose-700 bg-rose-50 border border-rose-200 transition-all hover:bg-rose-500 hover:text-white shadow-sm"
                          >
                            NO
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2 text-center text-[10px] font-bold text-slate-400 bg-slate-50 rounded-lg flex items-center justify-center gap-1.5 uppercase tracking-wider">
                        <Lock className="w-3 h-3" /> Complete previous to unlock
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}
      
      {/* ── Empty state & Add Interest (Shown when curated topics are done) ── */}
      {interests.length === 0 || pending.length === 0 ? (
        <motion.div 
          variants={fade}
          className="text-center py-12 px-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm mt-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: ACCENT + '15' }}>
            <Sparkles className="w-8 h-8" style={{ color: ACCENT }} />
          </div>
          <h3 className="text-xl font-extrabold mb-1" style={{ color: PRIMARY }}>All caught up!</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            You've gone through all curated recommendations. Add a completely customized interest to build a new personalized learning path.
          </p>
          <button
            className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: ACCENT, boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)' }}
          >
            <Plus className="w-5 h-5" /> Add New Interest
          </button>
        </motion.div>
      ) : null}

      {/* ── Redirecting Popup ── */}
      <AnimatePresence>
        {redirectingInterest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-[#172b44]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#f97316] animate-pulse" />
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-100 shadow-inner">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-[#172b44] mb-3">Interest Confirmed!</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                We are generating an ultra-personalized learning path for <span className="font-bold text-[#f97316] px-1 bg-orange-50 rounded">{redirectingInterest}</span>...
              </p>
              <div className="flex justify-center">
                <Loader2 className="w-8 h-8 text-[#f97316] animate-spin" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}
