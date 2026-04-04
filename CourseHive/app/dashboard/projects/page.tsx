'use client'

import { motion } from 'framer-motion'
import { FolderOpen, Plus, Download, ArrowUpRight, Clock, CheckCircle2, TrendingUp } from 'lucide-react'
import { mockProjects } from '@/lib/mock-data'

const PRIMARY = '#172b44'
const ACCENT = '#f97316'

const fade = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } }
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }

const difficultyStyle: Record<string, { bg: string; text: string }> = {
  Easy:   { bg: '#f0fdf4', text: '#15803d' },
  Medium: { bg: '#fffbeb', text: '#b45309' },
  Hard:   { bg: '#fef2f2', text: '#b91c1c' },
}

const projectColors = ['#4f46e5', '#0891b2', '#b45309', '#be185d', '#0d9488', '#7c3aed']

export default function ProjectsPage() {
  const inProgress = mockProjects.filter((p) => p.status === 'In Progress')
  const completed = mockProjects.filter((p) => p.status === 'Completed')

  const stats = [
    { label: 'Total Projects', value: mockProjects.length, primary: true },
    { label: 'Completed', value: completed.length, primary: false },
    { label: 'In Progress', value: inProgress.length, primary: false },
  ]

  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6">

      {/* Header */}
      <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">Build real-world projects to strengthen your portfolio</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:shadow-lg hover:-translate-y-0.5 transition-all"
            style={{ background: ACCENT, boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)' }}
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/70 border border-border/50 hover:bg-white transition-all backdrop-blur-sm">
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
            className={`rounded-2xl p-5 border border-white/50 shadow-sm ${!primary ? 'bg-white/70 backdrop-blur-sm' : ''}`}
            style={primary ? { background: `linear-gradient(135deg, ${PRIMARY} 0%, #2c4a6a 100%)` } : {}}
          >
            {!primary && (
              <button className="float-right w-7 h-7 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors">
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
            <p className={`text-xs font-medium ${primary ? 'text-white/70' : 'text-muted-foreground'}`}>{label}</p>
            <p className={`text-3xl font-black mt-1 ${primary ? 'text-white' : ''}`} style={!primary ? { color: PRIMARY } : {}}>{value}</p>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className={`w-3 h-3 ${primary ? 'text-white/60' : 'text-emerald-600'}`} />
              <span className={`text-[10px] font-medium ${primary ? 'text-white/60' : 'text-emerald-600'}`}>
                Increased from last month
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* In Progress */}
      {inProgress.length > 0 && (
        <motion.div variants={stagger} className="space-y-3">
          <motion.div variants={fade} className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <h2 className="font-bold text-base">In Progress</h2>
            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-2 py-0.5 rounded-full">
              {inProgress.length}
            </span>
          </motion.div>

          <motion.div variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgress.map((project, idx) => {
              const ds = difficultyStyle[project.difficulty] || difficultyStyle.Medium
              const color = projectColors[idx % projectColors.length]
              return (
                <motion.div
                  key={project.id}
                  variants={fade}
                  whileHover={{ y: -2, transition: { duration: 0.18 } }}
                  className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className="h-1" style={{ background: color }} />
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{ background: color + '20' }}
                      >
                        <FolderOpen className="w-4 h-4" style={{ color }} />
                      </div>
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: ds.bg, color: ds.text }}>
                        {project.difficulty}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm" style={{ color: PRIMARY }}>{project.title}</h3>
                      <p className="text-xs font-semibold mt-1" style={{ color: ACCENT }}>{project.progress}% complete</p>
                    </div>
                    <div className="h-1.5 bg-white/80 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${project.progress}%` }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="h-full rounded-full"
                        style={{ background: ACCENT }}
                      />
                    </div>
                    <button
                      className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
                      style={{ background: ACCENT + '12', color: ACCENT, border: `1px solid ${ACCENT}25` }}
                    >
                      Continue Project
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <motion.div variants={stagger} className="space-y-3">
          <motion.div variants={fade} className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-base">Completed</h2>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2 py-0.5 rounded-full">
              {completed.length}
            </span>
          </motion.div>

          <motion.div variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completed.map((project, idx) => {
              const ds = difficultyStyle[project.difficulty] || difficultyStyle.Medium
              const color = projectColors[(idx + inProgress.length) % projectColors.length]
              return (
                <motion.div
                  key={project.id}
                  variants={fade}
                  whileHover={{ y: -2, transition: { duration: 0.18 } }}
                  className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl overflow-hidden opacity-80 hover:opacity-100 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="h-1 bg-emerald-500" />
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: color + '20' }}>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: ds.bg, color: ds.text }}>
                        {project.difficulty}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm" style={{ color: PRIMARY }}>{project.title}</h3>
                      <p className="text-xs font-semibold text-emerald-600 mt-1">Completed</p>
                    </div>
                    <div className="h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-emerald-500 rounded-full" />
                    </div>
                    <button className="w-full py-2.5 rounded-xl text-sm font-semibold bg-white/80 hover:bg-white text-muted-foreground transition-all">
                      View Certificate
                    </button>
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
