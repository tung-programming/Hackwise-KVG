'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Loader2, Lock, Clock, BookOpen, ArrowRight, Download } from 'lucide-react'
import { mockRoadmap } from '@/lib/mock-data'

const PRIMARY = '#1a3d2c'

const fade = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } }
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }

const phaseColors = ['#4f46e5', '#0891b2', '#0d9488']

const statusConfig = {
  completed: {
    Icon: CheckCircle2,
    label: 'Completed',
    cardBorder: '#bbf7d0',
    cardBg: '#f0fdf4',
    badgeBg: '#dcfce7',
    badgeText: '#15803d',
    iconColor: '#16a34a',
  },
  'in-progress': {
    Icon: Loader2,
    label: 'In Progress',
    cardBorder: PRIMARY + '40',
    cardBg: PRIMARY + '06',
    badgeBg: PRIMARY + '15',
    badgeText: PRIMARY,
    iconColor: PRIMARY,
    spin: true,
  },
  todo: {
    Icon: Lock,
    label: 'Locked',
    cardBorder: 'var(--border)',
    cardBg: 'transparent',
    badgeBg: 'var(--secondary)',
    badgeText: 'var(--muted-foreground)',
    iconColor: 'var(--muted-foreground)',
    dim: true,
  },
}

export default function RoadmapPage({ params }: { params: { id: string } }) {
  const roadmap = mockRoadmap
  const totalCourses = roadmap.phases.reduce((s, p) => s + p.courses.length, 0)
  const doneCourses = roadmap.phases.reduce((s, p) => s + p.courses.filter(c => c.status === 'completed').length, 0)
  const pct = Math.round((doneCourses / totalCourses) * 100)

  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6">

      {/* Back */}
      <motion.div variants={fade}>
        <Link href="/dashboard/interests">
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Interests
          </button>
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{roadmap.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">Complete courses in sequence to master this field</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-border hover:bg-secondary transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </motion.div>

      {/* Progress stat card */}
      <motion.div
        variants={fade}
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{ background: PRIMARY }}
      >
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/8" />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <p className="text-white/70 text-xs font-medium">Overall Progress</p>
            <p className="text-5xl font-black mt-1">{pct}%</p>
            <p className="text-white/60 text-xs mt-2">{doneCourses} of {totalCourses} courses completed</p>
          </div>
          <div className="text-right">
            <p className="text-white/50 text-xs mb-1">{roadmap.phases.length} phases</p>
            <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Phases */}
      <motion.div variants={stagger} className="space-y-8">
        {roadmap.phases.map((phase, pi) => (
          <motion.div key={phase.phase} variants={fade} className="space-y-4">
            {/* Phase header */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0"
                style={{ background: phaseColors[pi % phaseColors.length] }}
              >
                {phase.phase}
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-base">{phase.title}</h2>
                <p className="text-xs text-muted-foreground">{phase.courses.length} courses</p>
              </div>
              {/* Dot progress */}
              <div className="hidden sm:flex gap-1.5">
                {phase.courses.map((c, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: c.status === 'completed' ? '#16a34a' : c.status === 'in-progress' ? PRIMARY : 'var(--border)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Courses grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:ml-13">
              {phase.courses.map((course) => {
                const cfg = statusConfig[course.status as keyof typeof statusConfig] || statusConfig.todo
                const StatusIcon = cfg.Icon
                return (
                  <div
                    key={course.id}
                    className={`rounded-2xl p-5 space-y-4 border transition-all ${cfg.dim ? 'opacity-55' : ''}`}
                    style={{ background: cfg.cardBg, borderColor: cfg.cardBorder }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0"
                        style={{ background: cfg.badgeBg, color: cfg.badgeText }}
                      >
                        {cfg.label}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm leading-snug">{course.title}</h3>
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    <button
                      disabled={course.status === 'todo'}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                      style={
                        course.status === 'completed'
                          ? { background: '#dcfce7', color: '#15803d' }
                          : course.status === 'in-progress'
                          ? { background: PRIMARY, color: '#fff' }
                          : { background: 'var(--secondary)', color: 'var(--muted-foreground)' }
                      }
                    >
                      {course.status === 'completed' && <><CheckCircle2 className="w-4 h-4" /> Completed</>}
                      {course.status === 'in-progress' && <>Continue <ArrowRight className="w-4 h-4" /></>}
                      {course.status === 'todo' && <><Lock className="w-4 h-4" /> Locked</>}
                    </button>
                  </div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div variants={fade} className="bg-card border border-border/50 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-bold">Ready to start learning?</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Enroll in the first course to begin your journey</p>
        </div>
        <Link href="/dashboard/courses">
          <button
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-colors"
            style={{ background: PRIMARY }}
          >
            Explore Courses <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </motion.div>
    </motion.div>
  )
}
