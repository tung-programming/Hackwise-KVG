'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, ArrowRight, Plus, Download, TrendingUp, BookOpen, Target, Flame, Sparkles, Heart, Zap } from 'lucide-react'
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
  const { interests, addInterest, updateInterest, uploadedHistory } = useAppStore()
  const [mounted, setMounted] = useState(false)

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
        <div className="flex items-center gap-2 shrink-0">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5 shadow-md"
            style={{ background: ACCENT, boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)' }}
          >
            <Plus className="w-4 h-4" /> Add Interest
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/70 border border-border/50 hover:bg-white transition-all backdrop-blur-sm shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
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

      {/* ── Active Learning Paths ── */}
      {accepted.length > 0 && (
        <motion.div variants={stagger} className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-base" style={{ color: PRIMARY }}>Active Learning Paths</h2>
            <span className="bg-orange-50 text-orange-700 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-orange-100">
              {accepted.length} Active
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accepted.map((interest, idx) => {
              const details = mockInterests.find((m) => m.id === interest.id)
              const color = interestColors[idx % interestColors.length]
              
              return (
                <motion.div
                  key={interest.id}
                  variants={fade}
                  className="group relative rounded-xl border border-border/50 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden p-4 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{ background: color + '15' }}
                    >
                      <BookOpen className="w-4 h-4" style={{ color }} />
                    </div>
                  </div>
                  
                  <div className="mb-4 flex-1">
                    <h3 className="font-semibold text-sm mb-1 text-slate-900 line-clamp-1">{interest.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{details?.description}</p>
                  </div>
                  
                  {/* Progress indicator */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground font-medium">Progress</span>
                      <span className="font-bold text-slate-700">42%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full"
                        style={{ background: color }}
                        initial={{ width: 0 }}
                        animate={{ width: '42%' }}
                        transition={{ duration: 1, delay: 0.1 }}
                      />
                    </div>
                  </div>
                  
                  <Link href={`/dashboard/interests/${interest.id}`} className="mt-auto">
                    <button
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-white transition-all shadow-sm hover:opacity-90"
                      style={{ background: PRIMARY }}
                    >
                      View Roadmap <ArrowRight className="w-3 h-3" />
                    </button>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pending.map((interest, idx) => {
              const details = mockInterests.find((m) => m.id === interest.id)
              const gIdx = (idx + accepted.length) % interestColors.length
              const color = interestColors[gIdx]
              const Icon = (() => {
                try { return require('lucide-react')[details?.icon || 'Heart'] || Heart } catch { return Heart }
              })()
              
              return (
                <motion.div
                  key={interest.id}
                  variants={fade}
                  className="group relative rounded-xl border border-border/50 bg-white shadow-sm hover:shadow-md transition-all p-4 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div 
                      className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{ background: color + '15' }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    
                    <span className="text-[10px] bg-slate-50 text-slate-500 font-semibold px-2 py-0.5 rounded-full border border-border">
                      Explore
                    </span>
                  </div>
                  
                  <div className="mb-4 flex-1">
                    <h3 className="font-semibold text-sm mb-1 text-slate-900">{interest.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{details?.description}</p>
                  </div>
                  
                  {/* Meta info */}
                  <div className="flex items-center gap-2 mb-4 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 text-slate-500">
                      <BookOpen className="w-3 h-3" /> 12 modules
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-slate-500">~4 weeks avg.</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-auto">
                    <button
                      onClick={() => updateInterest(interest.id, 'accepted')}
                      className="flex-1 py-2 flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 shadow-sm"
                      style={{ background: PRIMARY }}
                    >
                      <Plus className="w-3.5 h-3.5" /> Start Learning
                    </button>
                    <button
                      onClick={() => updateInterest(interest.id, 'rejected')}
                      className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors border border-border/50"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}
      
      {/* ── Empty state ── */}
      {interests.length === 0 && (
        <motion.div 
          variants={fade}
          className="text-center py-12 px-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: ACCENT + '15' }}>
            <Sparkles className="w-8 h-8" style={{ color: ACCENT }} />
          </div>
          <h3 className="text-base font-bold mb-1" style={{ color: PRIMARY }}>No interests yet</h3>
          <p className="text-xs text-muted-foreground mb-5">Start by exploring topics to get personalized recommendations</p>
          <button
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
            style={{ background: ACCENT }}
          >
            Get Started
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}
