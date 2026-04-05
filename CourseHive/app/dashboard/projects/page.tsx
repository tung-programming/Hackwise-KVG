'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  Lock,
  UploadCloud,
} from 'lucide-react'
import Link from 'next/link'
import { useActiveInterest, useCourses, useProjects, useProjectSubmit } from '@/hooks/use-api'

const PRIMARY = 'var(--primary)'
const ACCENT = 'var(--accent)'

const fade = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}

export default function ProjectsPage() {
  const { data: activeInterest, loading: interestLoading } = useActiveInterest()
  const interestId = activeInterest?.id || null
  const { data: courses, loading: coursesLoading, refetch: refetchCourses } = useCourses(interestId)
  const { data: projects, loading: projectsLoading, refetch: refetchProjects } = useProjects(interestId)
  const { submit, submitting, progress, error: submitError } = useProjectSubmit(async () => {
    await refetchProjects()
    await refetchCourses()
  })

  const [urls, setUrls] = useState<Record<string, string>>({})
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)

  const loading = interestLoading || coursesLoading || projectsLoading
  const totalCourses = courses?.length || 0
  const completedCourses = courses?.filter((c) => c.is_completed).length || 0
  const allCoursesCompleted = totalCourses > 0 && completedCourses === totalCourses
  const courseProgress = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0

  const sortedProjects = useMemo(() => {
    if (!projects) return []
    return [...projects].sort((a, b) => a.created_at.localeCompare(b.created_at))
  }, [projects])

  const completedProjects = sortedProjects.filter((p) => p.is_completed).length

  const handleSubmit = async (projectId: string) => {
    const url = (urls[projectId] || '').trim()
    if (!url) return

    const result = await submit(projectId, { repo_url: url })
    if (result.success) {
      setSubmitMessage('Project submitted. AI validation is in progress.')
      setTimeout(() => setSubmitMessage(null), 2500)
      setUrls((prev) => ({ ...prev, [projectId]: '' }))
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#f97316]" />
      </div>
    )
  }

  if (!activeInterest) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-10 w-10 text-amber-500" />
        <p className="text-sm text-muted-foreground">No active interest found. Accept an interest first.</p>
        <Link href="/dashboard/interests" className="text-sm font-semibold" style={{ color: ACCENT }}>
          Go to Interests
        </Link>
      </div>
    )
  }

  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6">
      <motion.div variants={fade} className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight" style={{ color: PRIMARY }}>Projects</h1>
        <p className="text-sm text-muted-foreground">
          Active interest: <span className="font-semibold text-foreground">{activeInterest.name}</span>
        </p>
      </motion.div>

      <motion.div variants={fade} className="rounded-2xl border border-border/ bg-card/50 p-5 shadow-sm">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-muted-foreground">Course completion gate</span>
          <span className="font-bold" style={{ color: PRIMARY }}>{courseProgress}%</span>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full" style={{ width: `${courseProgress}%`, background: ACCENT }} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {allCoursesCompleted
            ? 'All courses completed. Projects are unlocked.'
            : 'Complete all courses in the roadmap to unlock project submissions.'}
        </p>
      </motion.div>

      {submitMessage && (
        <motion.div variants={fade} className="rounded-xl border border-emerald-200 bg-emerald-50 dark:bg--900/20 px-4 py-2 text-sm font-semibold text-emerald-700 dark:text--400">
          {submitMessage}
        </motion.div>
      )}

      {submitError && (
        <motion.div variants={fade} className="rounded-xl border border-red-200 bg-red-50 dark:bg--900/20 px-4 py-2 text-sm text-red-700">
          {submitError}
        </motion.div>
      )}

      <motion.div variants={stagger} className="grid gap-4 md:grid-cols-2">
        {sortedProjects.length === 0 && (
          <motion.div variants={fade} className="rounded-2xl border border-slate-200 bg-card p-6 text-sm text-muted-foreground">
            No projects generated yet for this interest.
          </motion.div>
        )}

        {sortedProjects.map((project) => {
          const isLocked = project.is_locked || !allCoursesCompleted
          const isCompleted = project.is_completed
          const isValidated = project.is_validated
          const statusText = isCompleted
            ? 'Completed'
            : isValidated
            ? 'Validated (needs improvement)'
            : project.submission_url
            ? 'Submitted'
            : 'Pending'

          return (
            <motion.div key={project.id} variants={fade} className={`rounded-2xl border p-5 ${isCompleted ? 'border-emerald-200 bg-emerald-50 dark:bg--900/20' : 'border-slate-200 bg-card'}`}>
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    background: project.difficulty === 'hard' ? '#fee2e2' : project.difficulty === 'medium' ? '#fffbeb' : '#ecfdf5',
                    color: project.difficulty === 'hard' ? '#b91c1c' : project.difficulty === 'medium' ? '#b45309' : '#15803d',
                  }}>
                  {project.difficulty}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">{statusText}</span>
              </div>

              <h3 className="text-lg font-bold" style={{ color: PRIMARY }}>{project.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>

              {project.submission_url && (
                <a
                  href={project.submission_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                  style={{ color: ACCENT }}
                >
                  <ExternalLink className="h-4 w-4" />
                  View Submission
                </a>
              )}

              {project.validation_feedback && (
                <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                  {project.validation_feedback}
                </p>
              )}

              {!isCompleted && (
                <div className="mt-4 space-y-2">
                  {isLocked ? (
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                      <Lock className="h-4 w-4" />
                      Project locked until all courses are completed
                    </div>
                  ) : (
                    <>
                      <label className="text-xs font-semibold text-muted-foreground">
                        Repository / Demo URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={urls[project.id] || ''}
                          onChange={(e) => setUrls((prev) => ({ ...prev, [project.id]: e.target.value }))}
                          placeholder="https://github.com/username/project"
                          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-300"
                        />
                        <button
                          onClick={() => handleSubmit(project.id)}
                          disabled={submitting || !(urls[project.id] || '').trim()}
                          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
                          style={{ background: ACCENT }}
                        >
                          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                          Submit
                        </button>
                      </div>
                      {submitting && (
                        <p className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {progress || 'Submitting...'}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              {isCompleted && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700 dark:text--400">
                  <CheckCircle2 className="h-4 w-4" />
                  Completed (+{project.xp_awarded || 0} XP)
                </div>
              )}
            </motion.div>
          )
        })}
      </motion.div>

      <motion.div variants={fade} className="text-sm text-muted-foreground">
        Completed projects: <span className="font-semibold text-foreground">{completedProjects}</span> / {sortedProjects.length}
      </motion.div>
    </motion.div>
  )
}
