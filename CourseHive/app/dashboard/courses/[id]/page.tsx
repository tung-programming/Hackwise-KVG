'use client'

import { use, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  FilePenLine,
  FolderOpen,
  Loader2,
  Lock,
  Save,
  X,
} from 'lucide-react'
import { useCourseCompletion, useInterestDetail } from '@/hooks/use-api'

const PRIMARY = '#172b44'
const ACCENT = '#f97316'

type RoadNode = {
  id: string
  title: string
  description: string
  duration: string
  difficulty: string
  url: string
  status: 'completed' | 'active' | 'locked'
}

function buildRoadPath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]
    const b = points[i + 1]
    const mx = (a.x + b.x) / 2
    d += ` C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`
  }
  return d
}

export default function CourseRoadmapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, loading, error, refetch } = useInterestDetail(id)
  const { complete, loading: completing } = useCourseCompletion(refetch)

  const [feedback, setFeedback] = useState<string | null>(null)
  const [activeNoteNodeId, setActiveNoteNodeId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})

  const sortedCourses = useMemo(() => {
    if (!data?.courses) return []
    return [...data.courses].sort((a, b) => a.node_order - b.node_order)
  }, [data?.courses])

  const nodes: RoadNode[] = useMemo(
    () =>
      sortedCourses.map((course) => ({
        id: course.id,
        title: course.name,
        description: course.description,
        duration: course.roadmap_data?.duration || '2h',
        difficulty: course.roadmap_data?.difficulty || 'beginner',
        url: course.resource_url,
        status: course.is_completed ? 'completed' : course.is_locked ? 'locked' : 'active',
      })),
    [sortedCourses]
  )

  const completedCount = nodes.filter((n) => n.status === 'completed').length
  const activeCount = nodes.filter((n) => n.status === 'active').length
  const lockedCount = nodes.filter((n) => n.status === 'locked').length
  const progressPct = nodes.length ? Math.round((completedCount / nodes.length) * 100) : 0
  const projectsUnlocked = nodes.length > 0 && completedCount === nodes.length

  const canvasWidth = 1100
  const startY = 120
  const stepY = 230
  const canvasHeight = Math.max(680, startY + (nodes.length - 1) * stepY + 180)
  const centerX = canvasWidth / 2
  const rightX = 770
  const leftX = 330

  const points = nodes.map((_, i) => ({
    x: i % 2 === 0 ? rightX : leftX,
    y: startY + i * stepY,
  }))

  const pathD = buildRoadPath(points)

  useEffect(() => {
    if (!id) return
    try {
      const raw = localStorage.getItem(`course-node-notes:${id}`)
      if (!raw) return
      const parsed = JSON.parse(raw) as Record<string, string>
      setNotes(parsed)
    } catch {
      setNotes({})
    }
  }, [id])

  useEffect(() => {
    if (!id) return
    localStorage.setItem(`course-node-notes:${id}`, JSON.stringify(notes))
  }, [id, notes])

  const handleComplete = async (courseId: string) => {
    const result = await complete(courseId)
    if (result.success && 'xpAwarded' in result) {
      setFeedback(`Course completed. +${result.xpAwarded || 0} XP`)
      setTimeout(() => setFeedback(null), 2400)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#f97316]" />
      </div>
    )
  }

  if (error || !data?.interest) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-sm text-muted-foreground">{error || 'Interest not found'}</p>
        <Link href="/dashboard/interests" className="text-sm font-semibold" style={{ color: ACCENT }}>
          Back to Interests
        </Link>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/interests" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Interests
        </Link>
        <Link href="/dashboard/projects" className="text-sm font-semibold" style={{ color: ACCENT }}>
          View Projects
        </Link>
      </div>

      <div className="rounded-3xl border border-white/10 p-6 text-white shadow-xl" style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #2c4a6a 100%)` }}>
        <h1 className="text-4xl font-black tracking-tight">{data.interest.name}</h1>
        <p className="mt-2 max-w-3xl text-sm text-white/70">{data.interest.description}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider">{completedCount} done</div>
          <div className="rounded-xl bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider">{activeCount} active</div>
          <div className="rounded-xl bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider">{lockedCount} locked</div>
        </div>
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full" style={{ width: `${progressPct}%`, background: ACCENT }} />
        </div>
      </div>

      {feedback && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          {feedback}
        </motion.div>
      )}

      <section className="rounded-3xl border border-slate-200/60 bg-white/70 p-4 shadow-xl backdrop-blur-sm sm:p-6">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-xl font-black" style={{ color: PRIMARY }}>Course Roadmap</h2>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{nodes.length} nodes</p>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="relative" style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}>
            <svg width={canvasWidth} height={canvasHeight} className="absolute inset-0">
              <defs>
                <pattern id="roadGrid" width="36" height="36" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
                  <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#dbe3ee" strokeWidth="1" strokeOpacity="0.5" />
                </pattern>
              </defs>
              <rect x="0" y="0" width={canvasWidth} height={canvasHeight} rx="24" fill="#f5f8fc" />
              <rect x="0" y="0" width={canvasWidth} height={canvasHeight} rx="24" fill="url(#roadGrid)" />

              {pathD && (
                <>
                  <path d={pathD} stroke="#9fb2c9" strokeWidth="98" fill="none" strokeLinecap="round" opacity="0.5" transform="translate(0 8)" />
                  <path d={pathD} stroke="#dce5ef" strokeWidth="88" fill="none" strokeLinecap="round" />
                  <path d={pathD} stroke="#bfcddb" strokeWidth="6" fill="none" strokeDasharray="28 24" strokeLinecap="round" />
                </>
              )}

              <text x={centerX} y={52} textAnchor="middle" className="fill-slate-400 text-[12px] font-bold tracking-[0.45em]">START</text>
              <text x={centerX} y={canvasHeight - 24} textAnchor="middle" className="fill-slate-400 text-[12px] font-bold tracking-[0.45em]">GOAL</text>
            </svg>

            {nodes.map((node, idx) => {
              const point = points[idx]
              const done = node.status === 'completed'
              const active = node.status === 'active'
              const locked = node.status === 'locked'
              const cardLeft = idx % 2 === 0 ? 40 : canvasWidth - 420
              const cardTop = point.y - 92

              return (
                <div key={node.id}>
                  <div className="absolute z-20" style={{ left: `${point.x - 34}px`, top: `${point.y - 34}px` }}>
                    <div
                      className="flex h-[68px] w-[68px] items-center justify-center rounded-full border-4 shadow-lg"
                      style={{
                        background: done ? '#fbbf24' : active ? '#f97316' : '#94a3b8',
                        borderColor: done ? '#b45309' : active ? '#9a3412' : '#64748b',
                      }}
                    >
                      {done && <CheckCircle2 className="h-7 w-7 text-[#7c2d12]" />}
                      {active && <span className="text-xl font-black text-white">{idx + 1}</span>}
                      {locked && <Lock className="h-6 w-6 text-white/90" />}
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    className={`absolute z-10 w-[380px] rounded-2xl border p-4 shadow-md ${
                      locked
                        ? 'border-slate-300 bg-slate-100/90'
                        : active
                        ? 'border-orange-200 bg-white'
                        : 'border-amber-200 bg-amber-50/70'
                    }`}
                    style={{ left: `${cardLeft}px`, top: `${cardTop}px` }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-500">Course {idx + 1}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          done
                            ? 'bg-emerald-100 text-emerald-700'
                            : active
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {done ? 'Done' : active ? 'Active' : 'Locked'}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black leading-tight text-[#172b44]">{node.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-slate-600">{node.description}</p>

                    <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{node.duration}</span>
                      <span>•</span>
                      <span>{node.difficulty}</span>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <a
                        href={node.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 text-sm font-bold ${locked ? 'pointer-events-none text-slate-400' : 'text-orange-600 hover:underline'}`}
                      >
                        <ExternalLink className="h-4 w-4" /> Open link
                      </a>

                      <button
                        onClick={() => setActiveNoteNodeId(activeNoteNodeId === node.id ? null : node.id)}
                        className={`ml-auto inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-bold ${
                          locked
                            ? 'border-slate-300 text-slate-500'
                            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <FilePenLine className="h-3.5 w-3.5" /> Note
                      </button>
                    </div>

                    {active && (
                      <button
                        onClick={() => handleComplete(node.id)}
                        disabled={completing}
                        className="mt-3 w-full rounded-xl py-2.5 text-sm font-bold text-white disabled:opacity-60"
                        style={{ background: ACCENT }}
                      >
                        {completing ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Mark as Complete'}
                      </button>
                    )}
                  </motion.div>

                  {activeNoteNodeId === node.id && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute z-30 w-[300px] rounded-xl border border-slate-200 bg-white p-3 shadow-xl"
                      style={{
                        left: `${idx % 2 === 0 ? cardLeft + 392 : cardLeft - 312}px`,
                        top: `${cardTop + 14}px`,
                      }}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-black uppercase tracking-wider text-slate-500">Node Note</p>
                        <button onClick={() => setActiveNoteNodeId(null)} className="rounded p-1 text-slate-500 hover:bg-slate-100">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <textarea
                        value={notes[node.id] || ''}
                        onChange={(e) => setNotes((prev) => ({ ...prev, [node.id]: e.target.value }))}
                        placeholder="Write your quick note for this node..."
                        className="h-28 w-full resize-none rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-orange-300"
                      />
                      <div className="mt-2 flex items-center justify-end gap-2">
                        <button
                          onClick={() => setNotes((prev) => ({ ...prev, [node.id]: '' }))}
                          className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-50"
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => setActiveNoteNodeId(null)}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-white"
                          style={{ background: ACCENT }}
                        >
                          <Save className="h-3.5 w-3.5" /> Save
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-slate-500">
          <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Completed</span>
          <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> In Progress</span>
          <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-slate-500" /> Locked</span>
        </div>
      </section>

      <section className="rounded-2xl border border-white/50 bg-white/70 p-5 shadow-sm">
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
      </section>
    </motion.div>
  )
}
