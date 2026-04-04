'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, X, PlayCircle, FileText, HelpCircle, Wrench,
  ExternalLink, Clock, CheckCircle2, Lock, Users,
} from 'lucide-react'
import { mockCourseRoadmaps } from '@/lib/mock-data'

const ACCENT = '#f97316'
const PRIMARY = '#172b44'

/* ─── Video recommendations per lesson ─────────────────────────────────── */
type VideoRec = { title: string; channel: string; url: string; views: string }

const VIDEO_RECS: Record<string, VideoRec[]> = {
  /* TypeScript */
  'ts-1-1': [
    { title: 'TypeScript Compiler Options Explained', channel: 'Fireship', url: 'https://www.youtube.com/results?search_query=typescript+compiler+tsconfig', views: '1.2M' },
    { title: 'tsconfig.json Deep Dive', channel: 'Matt Pocock', url: 'https://www.youtube.com/results?search_query=tsconfig+json+deep+dive', views: '450K' },
  ],
  'ts-1-2': [
    { title: 'Advanced TypeScript Types Explained', channel: 'Jack Herrington', url: 'https://www.youtube.com/results?search_query=advanced+typescript+types+intersection', views: '567K' },
    { title: 'TypeScript Intersection & Union Types', channel: 'The Net Ninja', url: 'https://www.youtube.com/results?search_query=typescript+union+intersection+types', views: '210K' },
  ],
  'ts-1-3': [
    { title: 'TypeScript Generics Tutorial', channel: 'Fireship', url: 'https://www.youtube.com/results?search_query=typescript+generics+tutorial', views: '1.1M' },
    { title: 'Generics & Constraints in TypeScript', channel: 'Matt Pocock', url: 'https://www.youtube.com/results?search_query=typescript+generics+constraints', views: '456K' },
  ],
  'ts-1-4': [
    { title: 'TypeScript Type Narrowing Complete Guide', channel: 'Total TypeScript', url: 'https://www.youtube.com/results?search_query=typescript+type+narrowing', views: '234K' },
    { title: 'Type Inference in TypeScript', channel: 'Jack Herrington', url: 'https://www.youtube.com/results?search_query=typescript+type+inference', views: '178K' },
  ],
  'ts-1-5': [
    { title: 'TypeScript Module 1 Practice Questions', channel: 'Academind', url: 'https://www.youtube.com/results?search_query=typescript+beginner+quiz', views: '320K' },
    { title: 'TypeScript Crash Course Quiz Review', channel: 'Traversy Media', url: 'https://www.youtube.com/results?search_query=typescript+crash+course', views: '890K' },
  ],
  'ts-2-1': [
    { title: 'TypeScript Utility Types Crash Course', channel: 'Traversy Media', url: 'https://www.youtube.com/results?search_query=typescript+utility+types', views: '890K' },
    { title: 'Partial, Pick, Omit & More', channel: 'Matt Pocock', url: 'https://www.youtube.com/results?search_query=typescript+partial+pick+omit', views: '340K' },
  ],
  'ts-2-2': [
    { title: 'Custom Utility Types in TypeScript', channel: 'Jack Herrington', url: 'https://www.youtube.com/results?search_query=typescript+custom+utility+types', views: '450K' },
    { title: 'Build Your Own TypeScript Utilities', channel: 'Matt Pocock', url: 'https://www.youtube.com/results?search_query=build+typescript+utilities', views: '280K' },
  ],
  'ts-2-3': [
    { title: 'Mapped & Conditional Types in TypeScript', channel: 'Fireship', url: 'https://www.youtube.com/results?search_query=typescript+mapped+conditional+types', views: '670K' },
    { title: 'TypeScript Conditional Types Deep Dive', channel: 'Total TypeScript', url: 'https://www.youtube.com/results?search_query=typescript+conditional+types+deep+dive', views: '320K' },
  ],
  'ts-2-4': [
    { title: 'Template Literal Types in TypeScript', channel: 'Matt Pocock', url: 'https://www.youtube.com/results?search_query=typescript+template+literal+types', views: '290K' },
    { title: 'String Manipulation with Template Types', channel: 'Jack Herrington', url: 'https://www.youtube.com/results?search_query=typescript+template+string+literal', views: '180K' },
  ],
  'ts-3-1': [
    { title: 'TypeScript Decorators Explained', channel: 'Academind', url: 'https://www.youtube.com/results?search_query=typescript+decorators+tutorial', views: '780K' },
    { title: 'Class & Method Decorators in TypeScript', channel: 'Fireship', url: 'https://www.youtube.com/results?search_query=typescript+class+method+decorators', views: '560K' },
  ],
  'ts-3-2': [
    { title: 'Reflect Metadata API in TypeScript', channel: 'Academind', url: 'https://www.youtube.com/results?search_query=typescript+reflect+metadata', views: '230K' },
    { title: 'Metaprogramming with Reflect Metadata', channel: 'Fireship', url: 'https://www.youtube.com/results?search_query=reflect+metadata+typescript', views: '190K' },
  ],
  /* React */
  'r-1-1': [
    { title: 'Compound Components Pattern in React', channel: 'Kent C. Dodds', url: 'https://www.youtube.com/results?search_query=react+compound+components+pattern', views: '890K' },
    { title: 'Advanced React Patterns - Compound', channel: 'Jack Herrington', url: 'https://www.youtube.com/results?search_query=advanced+react+compound+pattern', views: '670K' },
  ],
  'r-1-2': [
    { title: 'Higher-Order Components in React', channel: 'Traversy Media', url: 'https://www.youtube.com/results?search_query=react+higher+order+components', views: '540K' },
    { title: 'Render Props Pattern Tutorial', channel: 'Fireship', url: 'https://www.youtube.com/results?search_query=react+render+props+pattern', views: '380K' },
  ],
  'r-1-3': [
    { title: 'Controlled vs Uncontrolled Components', channel: 'The Net Ninja', url: 'https://www.youtube.com/results?search_query=react+controlled+uncontrolled+components', views: '430K' },
    { title: 'React Forms Deep Dive', channel: 'Fireship', url: 'https://www.youtube.com/results?search_query=react+controlled+components+forms', views: '290K' },
  ],
  'r-2-1': [
    { title: 'React Custom Hooks Masterclass', channel: 'Jack Herrington', url: 'https://www.youtube.com/results?search_query=react+custom+hooks+masterclass', views: '1.2M' },
    { title: 'Building Reusable Custom Hooks', channel: 'Web Dev Simplified', url: 'https://www.youtube.com/results?search_query=react+reusable+custom+hooks', views: '890K' },
  ],
  'r-2-2': [
    { title: 'useReducer Hook - Complete Guide', channel: 'Web Dev Simplified', url: 'https://www.youtube.com/results?search_query=react+useReducer+hook+tutorial', views: '1.1M' },
    { title: 'State Management with useReducer', channel: 'Fireship', url: 'https://www.youtube.com/results?search_query=usereducer+react+state+management', views: '670K' },
  ],
  /* System Design */
  'sd-1-1': [
    { title: 'CAP Theorem Explained Simply', channel: 'ByteByteGo', url: 'https://www.youtube.com/results?search_query=cap+theorem+system+design+explained', views: '1.5M' },
    { title: 'Scalability in System Design', channel: 'Gaurav Sen', url: 'https://www.youtube.com/results?search_query=scalability+system+design', views: '890K' },
  ],
  'sd-1-2': [
    { title: 'Load Balancing Algorithms Explained', channel: 'ByteByteGo', url: 'https://www.youtube.com/results?search_query=load+balancing+algorithms+system+design', views: '1.2M' },
    { title: 'Load Balancers in System Design', channel: 'Gaurav Sen', url: 'https://www.youtube.com/results?search_query=load+balancer+system+design', views: '780K' },
  ],
  'sd-1-3': [
    { title: 'Caching Strategies Explained', channel: 'ByteByteGo', url: 'https://www.youtube.com/results?search_query=caching+strategies+system+design', views: '980K' },
    { title: 'CDN Explained - Content Delivery', channel: 'Fireship', url: 'https://www.youtube.com/results?search_query=cdn+content+delivery+network+explained', views: '670K' },
  ],
  'sd-2-1': [
    { title: 'SQL vs NoSQL - When to Use Which', channel: 'Fireship', url: 'https://www.youtube.com/results?search_query=sql+vs+nosql+system+design', views: '1.8M' },
    { title: 'Database Selection in System Design', channel: 'ByteByteGo', url: 'https://www.youtube.com/results?search_query=database+selection+system+design', views: '890K' },
  ],
  'sd-2-2': [
    { title: 'Database Sharding Explained', channel: 'ByteByteGo', url: 'https://www.youtube.com/results?search_query=database+sharding+replication+explained', views: '1.1M' },
    { title: 'Horizontal vs Vertical Scaling', channel: 'Gaurav Sen', url: 'https://www.youtube.com/results?search_query=horizontal+vertical+scaling+database', views: '760K' },
  ],
  /* DS&A */
  'ds-1-1': [
    { title: 'Sliding Window Technique Explained', channel: 'NeetCode', url: 'https://www.youtube.com/results?search_query=sliding+window+technique+arrays', views: '2.1M' },
    { title: 'Array Problems - Blind 75 Walkthrough', channel: 'NeetCode', url: 'https://www.youtube.com/results?search_query=neetcode+array+problems+blind+75', views: '1.5M' },
  ],
  'ds-1-2': [
    { title: 'Linked List Complete Guide', channel: 'NeetCode', url: 'https://www.youtube.com/results?search_query=linked+list+two+pointers', views: '1.8M' },
    { title: 'Two Pointer Technique Explained', channel: 'Back To Back SWE', url: 'https://www.youtube.com/results?search_query=two+pointer+technique+algorithm', views: '890K' },
  ],
  'ds-1-3': [
    { title: 'Stacks & Queues - Complete Guide', channel: 'NeetCode', url: 'https://www.youtube.com/results?search_query=stacks+queues+monotonic+stack', views: '1.3M' },
    { title: 'Monotonic Stack Problems', channel: 'Back To Back SWE', url: 'https://www.youtube.com/results?search_query=monotonic+stack+algorithm', views: '750K' },
  ],
  'ds-2-1': [
    { title: 'Binary Tree DFS & BFS Complete Guide', channel: 'NeetCode', url: 'https://www.youtube.com/results?search_query=binary+tree+dfs+bfs', views: '2.3M' },
    { title: 'Tree Traversal Algorithms Explained', channel: 'Back To Back SWE', url: 'https://www.youtube.com/results?search_query=tree+traversal+dfs+bfs+algorithm', views: '1.2M' },
  ],
  'ds-3-1': [
    { title: 'Dynamic Programming - Made Simple', channel: 'NeetCode', url: 'https://www.youtube.com/results?search_query=dynamic+programming+tutorial', views: '3.2M' },
    { title: 'Intro to DP - Memoization & Tabulation', channel: 'Back To Back SWE', url: 'https://www.youtube.com/results?search_query=dynamic+programming+memoization+tabulation', views: '1.8M' },
  ],
}

function getVideos(lesson: LessonNode): VideoRec[] {
  if (VIDEO_RECS[lesson.id]) return VIDEO_RECS[lesson.id]
  const q = encodeURIComponent(lesson.title)
  return [
    { title: `${lesson.title} - Full Tutorial`, channel: 'Traversy Media', url: `https://www.youtube.com/results?search_query=${q}`, views: '500K' },
    { title: `${lesson.title} Explained`, channel: 'Fireship', url: `https://www.youtube.com/results?search_query=${q}+explained`, views: '320K' },
  ]
}

/* ─── Types ─────────────────────────────────────────────────────────────── */
type LessonNode = {
  id: string
  title: string
  type: 'video' | 'article' | 'quiz' | 'project'
  duration: string
  status: 'completed' | 'in-progress' | 'todo'
  phaseNum: number
  phaseTitle: string
}

const typeConfig = {
  video:   { label: 'Video',   Icon: PlayCircle, color: '#6366f1' },
  article: { label: 'Article', Icon: FileText,   color: '#0891b2' },
  quiz:    { label: 'Quiz',    Icon: HelpCircle,  color: ACCENT },
  project: { label: 'Project', Icon: Wrench,      color: '#0d9488' },
}

const phaseColors = ['#4f46e5', '#0891b2', '#0d9488']

/* ─── Road path builder ─────────────────────────────────────────────────── */
function buildPath(
  positions: { x: number; y: number }[],
  cx: number,
  startY: number,
  endY: number,
): string {
  if (!positions.length) return ''
  const first = positions[0]
  let dy = first.y - startY
  let d = `M ${cx} ${startY} C ${cx} ${startY + dy * 0.6}, ${first.x} ${first.y - dy * 0.4}, ${first.x} ${first.y}`
  for (let i = 0; i < positions.length - 1; i++) {
    const a = positions[i], b = positions[i + 1]
    dy = b.y - a.y
    d += ` C ${a.x} ${a.y + dy * 0.55}, ${b.x} ${b.y - dy * 0.55}, ${b.x} ${b.y}`
  }
  const last = positions[positions.length - 1]
  dy = endY - last.y
  d += ` C ${last.x} ${last.y + dy * 0.5}, ${cx} ${endY - dy * 0.35}, ${cx} ${endY}`
  return d
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function CourseRoadmapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const roadmap = mockCourseRoadmaps[id]
  const [activeLesson, setActiveLesson] = useState<LessonNode | null>(null)

  if (!roadmap) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-muted-foreground text-sm">Course not found.</p>
        <Link href="/dashboard/courses">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: ACCENT }}>
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </Link>
      </div>
    )
  }

  /* flatten all lessons */
  const allNodes: LessonNode[] = roadmap.phases.flatMap(phase =>
    phase.lessons.map(lesson => ({ ...lesson, phaseNum: phase.phase, phaseTitle: phase.title }))
  )
  const doneCount = allNodes.filter(n => n.status === 'completed').length
  const pct = Math.round((doneCount / allNodes.length) * 100)

  /* SVG layout */
  const VIEW_W = 560
  const LEFT_X = 128
  const RIGHT_X = 432
  const CX = VIEW_W / 2          // 280
  const SPACING = 145
  const START_Y = 70
  const END_PAD = 90
  const SVG_H = START_Y + (allNodes.length - 1) * SPACING + END_PAD + 80

  const positions = allNodes.map((_, i) => ({
    x: i % 2 === 0 ? RIGHT_X : LEFT_X,
    y: START_Y + i * SPACING,
  }))

  const endY = START_Y + (allNodes.length - 1) * SPACING + END_PAD
  const pathD = buildPath(positions, CX, START_Y - 48, endY)

  /* phase checkpoint indices */
  const phaseStartIdx: number[] = []
  let acc = 0
  roadmap.phases.forEach(p => { phaseStartIdx.push(acc); acc += p.lessons.length })

  const LABEL_W = 148
  const LABEL_H = 84
  const NODE_R  = 25
  const INNER_R = 16

  return (
    <>
      <div className="space-y-5 pb-8">

        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/dashboard/courses">
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Courses
            </button>
          </Link>
        </motion.div>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <h1 className="text-3xl font-extrabold tracking-tight">{roadmap.title}</h1>
          <div className="flex items-center gap-1.5 mt-1.5 text-muted-foreground text-sm">
            <Users className="w-3.5 h-3.5" />
            <span>{roadmap.instructor}</span>
            <span className="mx-1">·</span>
            <Clock className="w-3.5 h-3.5" />
            <span>{roadmap.totalDuration}</span>
          </div>
          <p className="text-muted-foreground text-sm mt-1.5 max-w-xl">{roadmap.description}</p>
        </motion.div>

        {/* Progress hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl p-5 text-white relative overflow-hidden shadow-lg"
          style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #2c4a6a 100%)` }}
        >
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
            <div>
              <p className="text-white/50 text-xs uppercase tracking-widest">Learning Progress</p>
              <p className="text-5xl font-black mt-0.5">{pct}%</p>
              <p className="text-white/40 text-xs mt-1">{doneCount} / {allNodes.length} lessons done</p>
            </div>
            <div className="flex-1 max-w-sm space-y-2">
              <div className="h-2.5 bg-white/15 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.3, ease: 'easeOut', delay: 0.5 }}
                  className="h-full rounded-full"
                  style={{ background: ACCENT }}
                />
              </div>
              <div className="flex gap-4 text-[10px] text-white/40">
                {(['completed', 'in-progress', 'todo'] as const).map(s => {
                  const cnt = allNodes.filter(n => n.status === s).length
                  const col = s === 'completed' ? '#34d399' : s === 'in-progress' ? ACCENT : '#6b7280'
                  return (
                    <span key={s} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: col }} />
                      {cnt} {s === 'completed' ? 'Done' : s === 'in-progress' ? 'Active' : 'Locked'}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Winding Road ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="rounded-3xl overflow-hidden select-none"
          style={{ background: 'linear-gradient(180deg, #060c1c 0%, #0a1628 50%, #060c1c 100%)' }}
        >
          {/* scroll container */}
          <div style={{ maxHeight: '80vh', overflowY: 'auto', overflowX: 'hidden' }}>
            <svg
              viewBox={`0 0 ${VIEW_W} ${SVG_H}`}
              width="100%"
              style={{ display: 'block' }}
            >
              {/* ── Stars ─────────────────────────────────── */}
              {Array.from({ length: 60 }, (_, i) => (
                <circle
                  key={i}
                  cx={(i * 139.7) % VIEW_W}
                  cy={(i * 97.3) % SVG_H}
                  r={i % 5 === 0 ? 1.5 : i % 3 === 0 ? 1.1 : 0.65}
                  fill="white"
                  opacity={0.06 + (i % 7) * 0.035}
                />
              ))}

              {/* ── Road layers ───────────────────────────── */}
              {/* drop shadow */}
              <path d={pathD} stroke="#000" strokeWidth="70" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
              {/* curb */}
              <path d={pathD} stroke="#2a3547" strokeWidth="62" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              {/* asphalt */}
              <path d={pathD} stroke="#18202e" strokeWidth="54" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              {/* subtle surface sheen */}
              <path d={pathD} stroke="#1e2a3d" strokeWidth="50" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              {/* centre dashes */}
              <path d={pathD} stroke="rgba(255,255,255,0.14)" strokeWidth="2.5" fill="none" strokeDasharray="13 12" strokeLinecap="round" />

              {/* ── START ─────────────────────────────────── */}
              {/* flag pole */}
              <line x1={CX} y1={START_Y - 48} x2={CX} y2={START_Y - 12} stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
              {/* flag */}
              <polygon points={`${CX},${START_Y - 48} ${CX + 22},${START_Y - 41} ${CX},${START_Y - 34}`} fill={ACCENT} opacity="0.85" />
              <text x={CX} y={START_Y - 54} textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="system-ui,sans-serif" letterSpacing="3" opacity="0.8">
                START
              </text>

              {/* ── Phase checkpoint banners ───────────────── */}
              {phaseStartIdx.slice(1).map((startIdx, pi) => {
                if (startIdx <= 0 || startIdx >= positions.length) return null
                const prevY = positions[startIdx - 1].y
                const currY = positions[startIdx].y
                const my = (prevY + currY) / 2
                const col = phaseColors[(pi + 1) % phaseColors.length]
                const label = `PHASE ${roadmap.phases[pi + 1].phase}: ${roadmap.phases[pi + 1].title.toUpperCase().substring(0, 18)}`
                return (
                  <g key={pi}>
                    <rect x={CX - 62} y={my - 13} width={124} height={22} rx={11} fill={col} opacity="0.18" />
                    <rect x={CX - 62} y={my - 13} width={124} height={22} rx={11} fill="none" stroke={col} strokeWidth="0.8" opacity="0.35" />
                    <text x={CX} y={my + 3} textAnchor="middle" fill={col} fontSize="8" fontWeight="700" fontFamily="system-ui,sans-serif" letterSpacing="1.2" opacity="0.9">
                      {label}
                    </text>
                  </g>
                )
              })}

              {/* ── Nodes ─────────────────────────────────── */}
              {positions.map((pos, i) => {
                const node  = allNodes[i]
                const isRight = pos.x > CX
                const done    = node.status === 'completed'
                const active  = node.status === 'in-progress'
                const locked  = node.status === 'todo'

                /* node colours */
                const ringFill  = done ? '#92400e' : active ? '#c2410c' : '#2d3748'
                const nodeFill  = done ? '#d97706' : active ? ACCENT    : '#374151'
                const innerFill = done ? '#fbbf24' : active ? '#fdba74' : '#4b5563'

                /* label position */
                const labelX  = isRight ? 12 : VIEW_W - LABEL_W - 12
                const labelY  = pos.y - LABEL_H / 2

                /* connector endpoints */
                const lineX1  = isRight ? labelX + LABEL_W + 5 : pos.x + NODE_R + 8
                const lineX2  = isRight ? pos.x - NODE_R - 8  : labelX - 5

                return (
                  <g
                    key={node.id}
                    onClick={() => setActiveLesson(node)}
                    style={{ cursor: locked ? 'not-allowed' : 'pointer' }}
                  >
                    {/* dashed connector */}
                    <line
                      x1={lineX1} y1={pos.y} x2={lineX2} y2={pos.y}
                      stroke={done ? '#d97706' : active ? ACCENT : '#3d4a5c'}
                      strokeWidth="1.5"
                      strokeDasharray="5 4"
                      opacity="0.5"
                    />

                    {/* label card (foreignObject) */}
                    <foreignObject x={labelX} y={labelY} width={LABEL_W} height={LABEL_H}>
                      <div
                        style={{
                          height: '100%',
                          boxSizing: 'border-box',
                          background: done   ? 'rgba(217,119,6,0.14)'
                                    : active ? 'rgba(249,115,22,0.14)'
                                    :          'rgba(45,55,72,0.35)',
                          border: `1px solid ${done   ? 'rgba(217,119,6,0.4)'
                                              : active ? 'rgba(249,115,22,0.4)'
                                              :          'rgba(63,78,99,0.35)'}`,
                          borderRadius: '10px',
                          padding: '8px 10px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          gap: '3px',
                        }}
                      >
                        <div style={{ fontSize: '8px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: done ? '#fbbf24' : active ? ACCENT : '#5a6a80', fontFamily: 'system-ui,sans-serif', whiteSpace: 'nowrap' }}>
                          {node.type} · {node.duration}
                        </div>
                        <div style={{ fontSize: '10.5px', fontWeight: '700', color: locked ? '#5a6a80' : '#f1f5f9', lineHeight: '1.35', fontFamily: 'system-ui,sans-serif' }}>
                          {node.title}
                        </div>
                        {!locked && (
                          <div style={{ fontSize: '9px', fontWeight: '600', color: done ? '#d97706' : ACCENT, fontFamily: 'system-ui,sans-serif' }}>
                            {done ? '✓ Done  ·  Tap to review' : '▶ Tap to continue'}
                          </div>
                        )}
                      </div>
                    </foreignObject>

                    {/* glow for in-progress */}
                    {active && (
                      <>
                        <motion.circle
                          cx={pos.x} cy={pos.y} r={44} fill={ACCENT}
                          animate={{ r: [42, 53, 42], opacity: [0.07, 0.02, 0.07] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.circle
                          cx={pos.x} cy={pos.y} r={33} fill={ACCENT}
                          animate={{ r: [31, 39, 31], opacity: [0.13, 0.04, 0.13] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.45 }}
                        />
                      </>
                    )}

                    {/* gold stars above completed */}
                    {done && (
                      <>
                        <text x={pos.x - 14} y={pos.y - NODE_R - 8}  fontSize="8"  textAnchor="middle" fill="#fbbf24" opacity="0.65">&#9733;</text>
                        <text x={pos.x}       y={pos.y - NODE_R - 16} fontSize="11" textAnchor="middle" fill="#fbbf24" opacity="0.9">&#9733;</text>
                        <text x={pos.x + 14}  y={pos.y - NODE_R - 8}  fontSize="8"  textAnchor="middle" fill="#fbbf24" opacity="0.65">&#9733;</text>
                      </>
                    )}

                    {/* outer ring */}
                    <circle cx={pos.x} cy={pos.y} r={NODE_R + 5} fill={ringFill} opacity={locked ? 0.45 : 1} />
                    {/* main disc */}
                    <circle cx={pos.x} cy={pos.y} r={NODE_R}     fill={nodeFill} opacity={locked ? 0.55 : 1} />
                    {/* inner highlight */}
                    <circle cx={pos.x} cy={pos.y} r={INNER_R}    fill={innerFill} opacity={locked ? 0.45 : 0.82} />

                    {/* centre icon */}
                    {done   && <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontSize="14" fill="#7c2d12" fontWeight="900" fontFamily="system-ui">&#10003;</text>}
                    {active && <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontSize="12" fill="white"   fontWeight="900" fontFamily="system-ui">{i + 1}</text>}
                    {locked && <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="system-ui">&#9632;</text>}

                    {/* step number ring badge (active only) */}
                    {active && (
                      <>
                        <circle cx={pos.x + NODE_R - 2} cy={pos.y - NODE_R + 2} r="9" fill="#0a1628" stroke={ACCENT} strokeWidth="1.5" />
                        <text x={pos.x + NODE_R - 2} y={pos.y - NODE_R + 6} textAnchor="middle" fontSize="8" fill={ACCENT} fontWeight="800" fontFamily="system-ui">{i + 1}</text>
                      </>
                    )}
                  </g>
                )
              })}

              {/* ── GOAL ──────────────────────────────────── */}
              {/* flag pole */}
              <line x1={CX} y1={endY + 8} x2={CX} y2={endY + 40} stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
              {/* flag */}
              <polygon points={`${CX},${endY + 8} ${CX + 22},${endY + 16} ${CX},${endY + 24}`} fill="#22c55e" opacity="0.85" />
              <text x={CX} y={endY + 58} textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="system-ui,sans-serif" letterSpacing="3" opacity="0.8">
                GOAL
              </text>
            </svg>
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="flex items-center gap-5 text-xs text-muted-foreground px-1"
        >
          {[
            { col: '#fbbf24', label: 'Completed' },
            { col: ACCENT,    label: 'In Progress — click to continue' },
            { col: '#4b5563', label: 'Locked' },
          ].map(({ col, label }) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: col }} />
              {label}
            </span>
          ))}
        </motion.div>

      </div>

      {/* ─── Lesson Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeLesson && (
          <LessonModal
            lesson={activeLesson}
            videos={getVideos(activeLesson)}
            onClose={() => setActiveLesson(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

/* ─── Modal component ───────────────────────────────────────────────────── */
function LessonModal({ lesson, videos, onClose }: {
  lesson: LessonNode
  videos: VideoRec[]
  onClose: () => void
}) {
  const done   = lesson.status === 'completed'
  const active = lesson.status === 'in-progress'
  const locked = lesson.status === 'todo'
  const cfg    = typeConfig[lesson.type]
  const { Icon } = cfg

  const statusBadge = done
    ? { bg: '#f0fdf4', color: '#059669', border: '#bbf7d0', label: 'Completed' }
    : active
    ? { bg: ACCENT + '12', color: ACCENT, border: ACCENT + '35', label: 'In Progress' }
    : { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0', label: 'Locked' }

  return (
    <>
      {/* soft backdrop — matches dashboard feel */}
      <motion.div
        className="fixed inset-0 z-50 bg-black/25 backdrop-blur-md"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          className="pointer-events-auto w-full max-w-md rounded-3xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.92, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 18 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          style={{
            background: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.7)',
            boxShadow: '0 24px 64px rgba(23,43,68,0.18), 0 4px 16px rgba(23,43,68,0.08)',
          }}
        >
          {/* ── Header ───────────────────────────────────────────────── */}
          <div
            className="p-6 relative"
            style={{ borderBottom: '1px solid rgba(23,43,68,0.07)' }}
          >
            {/* close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-black/8 hover:-translate-y-0.5"
              style={{ background: 'rgba(23,43,68,0.06)' }}
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* phase pill + type pill */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(23,43,68,0.06)', color: '#3d5f80' }}
              >
                Phase {lesson.phaseNum} · {lesson.phaseTitle}
              </span>
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{ background: cfg.color + '15', color: cfg.color }}
              >
                {cfg.label}
              </span>
            </div>

            {/* icon + title */}
            <div className="flex items-start gap-3.5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ background: cfg.color + '15', border: `1px solid ${cfg.color}25` }}
              >
                <Icon className="w-5 h-5" style={{ color: cfg.color }} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-black leading-tight" style={{ color: PRIMARY }}>{lesson.title}</h2>
                <div className="flex items-center gap-2.5 mt-2 flex-wrap">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {lesson.duration}
                  </span>
                  <span
                    className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border"
                    style={{ background: statusBadge.bg, color: statusBadge.color, borderColor: statusBadge.border }}
                  >
                    {done ? '✓ ' : active ? '▶ ' : ''}{statusBadge.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Body ─────────────────────────────────────────────────── */}
          <div className="p-6 space-y-4">
            {locked ? (
              /* locked state */
              <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm"
                  style={{ background: 'rgba(23,43,68,0.05)', border: '1px solid rgba(23,43,68,0.08)' }}
                >
                  <Lock className="w-6 h-6 text-muted-foreground opacity-40" />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: PRIMARY }}>Lesson Locked</p>
                  <p className="text-muted-foreground text-sm mt-0.5 leading-relaxed max-w-xs">
                    Complete the previous lessons to unlock this content.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* section label */}
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Recommended Resources
                </p>

                {/* video cards */}
                <div className="space-y-2.5">
                  {videos.map((v, i) => {
                    const cols = [cfg.color, ACCENT, '#0891b2']
                    const c = cols[i % cols.length]
                    return (
                      <a
                        key={i}
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-md group"
                        style={{
                          background: 'rgba(255,255,255,0.7)',
                          borderColor: 'rgba(23,43,68,0.09)',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        {/* thumb */}
                        <div
                          className="w-16 h-11 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: c + '18', border: `1px solid ${c}20` }}
                        >
                          <PlayCircle className="w-5 h-5 transition-transform group-hover:scale-110" style={{ color: c }} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold leading-snug" style={{ color: PRIMARY }}>{v.title}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{v.channel} · {v.views} views</p>
                        </div>

                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all group-hover:scale-110"
                          style={{ background: c + '15' }}
                        >
                          <ExternalLink className="w-3.5 h-3.5" style={{ color: c }} />
                        </div>
                      </a>
                    )
                  })}
                </div>

                {/* CTA */}
                <button
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg mt-1"
                  style={{
                    background: done
                      ? 'linear-gradient(135deg,#059669,#047857)'
                      : `linear-gradient(135deg,${ACCENT},#ea580c)`,
                    boxShadow: done
                      ? '0 4px 14px rgba(5,150,105,0.35)'
                      : '0 4px 14px rgba(249,115,22,0.35)',
                  }}
                >
                  {done
                    ? <><CheckCircle2 className="w-4 h-4" /> Review Lesson</>
                    : <><PlayCircle className="w-4 h-4" /> Continue Learning</>}
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </>
  )
}