'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  FolderOpen,
  Loader2,
  Lock,
} from 'lucide-react'
import { useCourseCompletion, useInterestDetail } from '@/hooks/use-api'

const PRIMARY = '#172b44'
const ACCENT = '#f97316'

const fade = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}

export default function CourseRoadmapPage({ params }: { params: { id: string } }) {
  const { data, loading, error, refetch } = useInterestDetail(params.id)
  const { complete, loading: completing } = useCourseCompletion(refetch)
  const [feedback, setFeedback] = useState<string | null>(null)

  const sortedCourses = useMemo(() => {
    if (!data?.courses) return []
    return [...data.courses].sort((a, b) => a.node_order - b.node_order)
  }, [data?.courses])

  const completedCourses = sortedCourses.filter((c) => c.is_completed).length
  const totalCourses = sortedCourses.length
  const progressPct = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0
  const projectsUnlocked = totalCourses > 0 && sortedCourses.every((c) => c.is_completed)

  const handleComplete = async (courseId: string) => {
    const result = await complete(courseId)
    if (result.success && 'xpAwarded' in result) {
      setFeedback(`Course completed. +${result.xpAwarded || 0} XP`)
      setTimeout(() => setFeedback(null), 2500)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#f97316]" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-sm text-muted-foreground">{error || 'Roadmap not found'}</p>
        <Link href="/dashboard/interests" className="text-sm font-semibold" style={{ color: ACCENT }}>
          Back to Interests
        </Link>
      </div>
    )
  }

  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6">
      <motion.div variants={fade} className="flex items-center justify-between">
        <Link href="/dashboard/interests" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Interests
        </Link>
        <Link href="/dashboard/projects" className="text-sm font-semibold" style={{ color: ACCENT }}>
          View Projects
        </Link>
      </motion.div>

      <motion.div variants={fade} className="rounded-3xl border border-white/10 p-6 text-white shadow-xl" style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #2c4a6a 100%)` }}>
        <h1 className="text-3xl font-black tracking-tight">{data.interest.name}</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/70">{data.interest.description}</p>
        <div className="mt-5 flex items-center gap-6 text-sm text-white/80">
          <span>{completedCourses} / {totalCourses} courses completed</span>
          <span>{data.projects.length} projects</span>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full" style={{ width: `${progressPct}%`, background: ACCENT }} />
        </div>
      </motion.div>

      {feedback && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          {feedback}
        </motion.div>
      )}

      <motion.div variants={stagger} className="space-y-4">
        <motion.h2 variants={fade} className="text-lg font-extrabold" style={{ color: PRIMARY }}>
          Course Roadmap
        </motion.h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedCourses.map((course, index) => {
            const isCompleted = course.is_completed
            const isLocked = course.is_locked
            const isActive = !isCompleted && !isLocked

            return (
              <motion.div
                key={course.id}
                variants={fade}
                className={`rounded-2xl border p-5 ${
                  isLocked
                    ? 'border-slate-200 bg-slate-50 opacity-70'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-orange-200 bg-white shadow-sm'
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">Course {index + 1}</span>
                  {isCompleted && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700"><CheckCircle2 className="h-3 w-3" /> Completed</span>}
                  {isLocked && <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600"><Lock className="h-3 w-3" /> Locked</span>}
                  {isActive && <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">Active</span>}
                </div>

                <h3 className="text-base font-bold" style={{ color: PRIMARY }}>{course.name}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{course.description}</p>

                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{course.roadmap_data?.duration || '1-2 hours'}</span>
                  <span>-</span>
                  <span>{course.roadmap_data?.difficulty || 'beginner'}</span>
                </div>

                {course.resource_url ? (
                  <a
                    href={course.resource_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                    style={{ color: ACCENT }}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Course Link
                  </a>
                ) : (
                  <p className="mt-4 text-sm text-red-600">Missing course link</p>
                )}

                {isActive && (
                  <button
                    onClick={() => handleComplete(course.id)}
                    disabled={completing}
                    className="mt-4 w-full rounded-xl py-2.5 text-sm font-bold text-white disabled:opacity-60"
                    style={{ background: ACCENT }}
                  >
                    {completing ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Mark as Complete'}
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <motion.div variants={fade} className="rounded-2xl border border-white/50 bg-white/70 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold" style={{ color: PRIMARY }}>Projects</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {projectsUnlocked ? 'Projects unlocked. Submit them from the Projects page.' : 'Projects unlock after all courses are completed.'}
            </p>
          </div>
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors hover:bg-slate-50"
            style={{ borderColor: PRIMARY, color: PRIMARY }}
          >
            <FolderOpen className="h-4 w-4" />
            Go to Projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}
