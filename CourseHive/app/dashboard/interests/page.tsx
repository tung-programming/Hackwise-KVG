'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, CheckCircle2, XCircle, ArrowRight, Plus, Download, TrendingUp, ArrowUpRight, BookOpen } from 'lucide-react'
import { mockInterests } from '@/lib/mock-data'
import { useAppStore } from '@/lib/store'

const PRIMARY = '#1a3d2c'

const fade = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } }
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }

const interestColors = ['#4f46e5', '#0891b2', '#b45309', '#be185d', '#0d9488', '#7c3aed']

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

  const stats = [
    { label: 'Total Interests', value: interests.length, primary: true },
    { label: 'Active Paths', value: accepted.length, primary: false },
    { label: 'Recommended', value: pending.length, primary: false },
  ]

  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6">

      {/* Header */}
      <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Interests</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {uploadedHistory ? 'Based on your learning history' : 'Select topics to get personalized recommendations'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-colors"
            style={{ background: PRIMARY }}
          >
            <Plus className="w-4 h-4" /> Add Interest
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-border hover:bg-secondary transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={stagger} className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, primary }) => (
          <motion.div
            key={label}
            variants={fade}
            className={`rounded-2xl p-5 border border-border/50 ${!primary ? 'bg-card' : ''}`}
            style={primary ? { background: PRIMARY } : {}}
          >
            {!primary && (
              <button className="float-right w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
            <p className={`text-xs font-medium ${primary ? 'text-white/70' : 'text-muted-foreground'}`}>{label}</p>
            <p className={`text-3xl font-black mt-1 ${primary ? 'text-white' : ''}`}>{value}</p>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className={`w-3 h-3 ${primary ? 'text-white/60' : 'text-emerald-600'}`} />
              <span className={`text-[10px] font-medium ${primary ? 'text-white/60' : 'text-emerald-600'}`}>
                {primary ? 'Increased from last month' : 'Active'}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Active Learning Paths */}
      {accepted.length > 0 && (
        <motion.div variants={stagger} className="space-y-3">
          <motion.div variants={fade} className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-base">Active Learning Paths</h2>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2 py-0.5 rounded-full">
              {accepted.length}
            </span>
          </motion.div>

          <motion.div variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accepted.map((interest, idx) => {
              const details = mockInterests.find((m) => m.id === interest.id)
              const color = interestColors[idx % interestColors.length]
              return (
                <motion.div
                  key={interest.id}
                  variants={fade}
                  whileHover={{ y: -2, transition: { duration: 0.18 } }}
                  className="bg-card border border-border/50 rounded-2xl overflow-hidden"
                >
                  <div className="h-1" style={{ background: color }} />
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: color + '18' }}>
                        <BookOpen className="w-4 h-4" style={{ color }} />
                      </div>
                      <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-1 rounded-full">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Active
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{interest.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{details?.description}</p>
                    </div>
                    <Link href={`/dashboard/interests/${interest.id}`}>
                      <button
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                        style={{ background: PRIMARY + '12', color: PRIMARY, border: `1px solid ${PRIMARY}25` }}
                      >
                        View Roadmap <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      )}

      {/* Recommended */}
      {pending.length > 0 && (
        <motion.div variants={stagger} className="space-y-3">
          <motion.div variants={fade} className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <h2 className="font-bold text-base">Recommended for You</h2>
            <span className="bg-secondary text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full border border-border">
              {pending.length}
            </span>
          </motion.div>

          <motion.div variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  whileHover={{ y: -2, transition: { duration: 0.18 } }}
                  className="bg-card border border-border/50 rounded-2xl overflow-hidden group"
                >
                  <div className="h-1 opacity-40 group-hover:opacity-100 transition-opacity" style={{ background: color }} />
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: color + '18' }}>
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <span className="text-[10px] font-semibold bg-secondary text-muted-foreground px-2.5 py-1 rounded-full border border-border">
                        Recommended
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{interest.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{details?.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateInterest(interest.id, 'accepted')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-colors"
                        style={{ background: PRIMARY }}
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" /> Interested
                      </button>
                      <button
                        onClick={() => updateInterest(interest.id, 'rejected')}
                        className="w-10 h-10 flex items-center justify-center bg-secondary hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors text-muted-foreground"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
