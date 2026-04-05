'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Loader2, Lock, Clock, BookOpen, ArrowRight, Download } from 'lucide-react'
import { useInterestDetail, useCourseCompletion } from '@/hooks/use-api'

const PRIMARY = 'var(--primary)'
const ACCENT = 'var(--accent)'

const fade = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } }
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }

const phaseColors = ['#4f46e5', '#0891b2', '#0d9488']

interface StatusConfig {
  Icon: React.ElementType
  label: string
  cardBorder: string
  cardBg: string
  badgeBg: string
  badgeText: string
  iconColor: string
  spin?: boolean
  dim?: boolean
}

const statusConfig: Record<string, StatusConfig> = {
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
    cardBorder: ACCENT + '40',
    cardBg: ACCENT + '06',
    badgeBg: ACCENT + '15',
    badgeText: ACCENT,
    iconColor: ACCENT,
    spin: true,
  },
  todo: {
    Icon: Lock,
    label: 'Locked',
    cardBorder: 'rgba(23, 43, 68, 0.15)',
    cardBg: 'transparent',
    badgeBg: 'rgba(255,255,255,0.8)',
    badgeText: '#3d5f80',
    iconColor: '#3d5f80',
    dim: true,
  },
}

export default function RoadmapPage({ params }: { params: { id: string } }) {
  const { data: interestData, loading, refetch } = useInterestDetail(params.id)
  const { complete, loading: completing } = useCourseCompletion(refetch)

  const roadmap = useMemo(() => {
    if (!interestData) return null

    const { interest, courses } = interestData
    const sortedCourses = [...courses].sort((a, b) => a.node_order - b.node_order)

    const coursesPerPhase = 3
    const phases: Array<{
      phase: number
      title: string
      courses: Array<{
        id: string
        title: string
        duration: string
        status: 'completed' | 'in-progress' | 'todo'
        resource_url: string
      }>
    }> = []

    for (let i = 0; i < sortedCourses.length; i += coursesPerPhase) {
      const phaseCourses = sortedCourses.slice(i, i + coursesPerPhase)
      const phaseNum = Math.floor(i / coursesPerPhase) + 1

      phases.push({
        phase: phaseNum,
        title: phaseNum === 1 ? 'Fundamentals' : phaseNum === 2 ? 'Intermediate' : 'Advanced',
        courses: phaseCourses.map(c => ({
          id: c.id,
          title: c.name,
          duration: c.roadmap_data?.duration || '2 hours',
          status: c.is_completed ? 'completed' : c.is_locked ? 'todo' : 'in-progress',
          resource_url: c.resource_url,
        })),
      })
    }

    return { title: interest.name, phases }
  }, [interestData])

  if (loading || !roadmap) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
      </div>
    )
  }

  const totalCourses = roadmap.phases.reduce((s, p) => s + p.courses.length, 0)
  const doneCourses = roadmap.phases.reduce((s, p) => s + p.courses.filter(c => c.status === 'completed').length, 0)
  const pct = totalCourses > 0 ? Math.round((doneCourses / totalCourses) * 100) : 0

  const handleCourseClick = (course: { id: string; status: string; resource_url: string }) => {
    if (course.status === 'in-progress' && course.resource_url) {
      window.open(course.resource_url, '_blank')
    }
  }

  const handleMarkComplete = async (courseId: string) => {
    await complete(courseId)
  }

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
        className="rounded-2xl p-5 text-white relative overflow-hidden shadow-lg"
        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, var(--primary) 100%)` }}
      >
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-card/50 " />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <p className="text-white/70 text-xs font-medium">Overall Progress</p>
            <p className="text-5xl font-black mt-1">{pct}%</p>
            <p className="text-white/60 text-xs mt-2">{doneCourses} of {totalCourses} courses completed</p>
          </div>
          <div className="text-right">
            <p className="text-white/50 text-xs mb-1">{roadmap.phases.length} phases</p>
            <div className="w-32 h-2 bg-card/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className="h-full rounded-full"
                style={{ background: ACCENT }}
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
                const cfg = statusConfig[course.status] ?? statusConfig.todo
                const StatusIcon = cfg.Icon
                return (
                  <div
                    key={course.id}
                    className={`rounded-2xl p-5 space-y-4 border transition-all backdrop-blur-sm ${cfg.dim ? 'opacity-55' : 'bg-card/50 shadow-sm hover:shadow-md'}`}
                    style={{ background: cfg.cardBg, borderColor: cfg.cardBorder }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-9 h-9 bg-card/50 rounded-xl flex items-center justify-center shrink-0">
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
                      <h3 className="font-bold text-sm leading-snug" style={{ color: PRIMARY }}>{course.title}</h3>
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    <button
                      disabled={course.status === 'todo' || completing}
                      onClick={() => handleCourseClick(course)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                      style={
                        course.status === 'completed'
                          ? { background: '#dcfce7', color: '#15803d' }
                          : course.status === 'in-progress'
                          ? { background: ACCENT, color: '#fff' }
                          : { background: 'rgba(255,255,255,0.8)', color: '#3d5f80' }
                      }
                    >
                      {course.status === 'completed' && <><CheckCircle2 className="w-4 h-4" /> Completed</>}
                      {course.status === 'in-progress' && <>Continue <ArrowRight className="w-4 h-4" /></>}
                      {course.status === 'todo' && <><Lock className="w-4 h-4" /> Locked</>}
                    </button>

                    {course.status === 'in-progress' && (
                      <button
                        onClick={() => handleMarkComplete(course.id)}
                        disabled={completing}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg--900/20 text-emerald-700 dark:text--400 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                      >
                        {completing ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                        Mark Complete
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div variants={fade} className="bg-card/50 backdrop-blur-sm border border-border/ rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm">
        <div>
          <h3 className="font-bold" style={{ color: PRIMARY }}>Ready to start learning?</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Enroll in the first course to begin your journey</p>
        </div>
        <Link href="/dashboard/courses">
          <button
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:shadow-lg hover:-translate-y-0.5 transition-all"
            style={{ background: ACCENT, boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)' }}
          >
            Explore Courses <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </motion.div>

    </motion.div>
  )
}