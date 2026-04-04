'use client'

import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  Plus,
  Download,
  Video,
  Users,
  TrendingUp,
  Pause,
  Square,
  BookOpen,
  Brain,
  Code2,
  Smartphone,
  Cloud,
  Palette,
  Sparkles,
} from 'lucide-react'
import { mockAnalytics } from '@/lib/mock-data'
import {
  BarChart,
  Bar,
  XAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
} from 'recharts'

const PRIMARY = '#172b44'
const ACCENT = '#f97316'
const PRIMARY_LIGHT = '#e8f1f8'

/* ─── mock data ─── */
const weekActivity = [
  { day: 'S', hours: 1.5, solid: false },
  { day: 'M', hours: 5.0, solid: true },
  { day: 'T', hours: 6.5, solid: true, highlight: true, pct: '74%' },
  { day: 'W', hours: 8.0, solid: true },
  { day: 'T', hours: 2.5, solid: false },
  { day: 'F', hours: 4.0, solid: false },
  { day: 'S', hours: 1.0, solid: false },
]

const progressData = [
  { name: 'Completed', value: 7, color: PRIMARY },
  { name: 'In Progress', value: 3, color: ACCENT },
  { name: 'Pending', value: 2, color: PRIMARY_LIGHT },
]

const recentActivity = [
  { name: 'Alex Rodriguez', task: 'Advanced TypeScript', status: 'Completed', avatar: 'AR' },
  { name: 'Sarah Chen', task: 'React Patterns', status: 'In Progress', avatar: 'SC' },
  { name: 'Mike Johnson', task: 'System Design', status: 'Pending', avatar: 'MJ' },
  { name: 'Emma Wilson', task: 'Algorithms & DS', status: 'In Progress', avatar: 'EW' },
]

const activeCourses = [
  { title: 'Advanced TypeScript', due: 'Due: Dec 10, 2024', icon: Code2, color: '#4f46e5' },
  { title: 'React Patterns', due: 'Due: Dec 15, 2024', icon: Brain, color: '#0891b2' },
  { title: 'System Design', due: 'Due: Dec 20, 2024', icon: BookOpen, color: ACCENT },
  { title: 'Mobile Development', due: 'Due: Jan 5, 2025', icon: Smartphone, color: '#be185d' },
  { title: 'DevOps & Cloud', due: 'Due: Jan 12, 2025', icon: Cloud, color: '#0d9488' },
]

const statusBadge: Record<string, string> = {
  Completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'In Progress': 'bg-orange-50 text-orange-700 border border-orange-200',
  Pending: 'bg-slate-100 text-slate-500 border border-slate-200',
}

/* ─── custom rounded bar ─── */
const RoundedBar = (props: {
  x?: number; y?: number; width?: number; height?: number; fill?: string
}) => {
  const { x = 0, y = 0, width = 0, height = 0, fill } = props
  if (height <= 0) return null
  const r = Math.min(width / 2, 8)
  return (
    <rect x={x} y={y} width={width} height={height} rx={r} ry={r} fill={fill} />
  )
}

/* ─── variants ─── */
const fade = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}
const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}

export default function DashboardPage() {
  const total = progressData.reduce((s, d) => s + d.value, 0)
  const completedPct = Math.round((progressData[0].value / total) * 100)

  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6">

      {/* ── Header ── */}
      <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: PRIMARY }}>Dashboard</h1>
            <span className="flex items-center gap-1 bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-full">
              <Sparkles className="w-3 h-3" /> AI Powered
            </span>
          </div>
          <p className="text-muted-foreground text-sm">Plan, prioritize, and accomplish your learning goals.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5 shadow-md"
            style={{ background: ACCENT, boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)' }}
          >
            <Plus className="w-4 h-4" /> Add Course
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/70 border border-border/50 hover:bg-white transition-all backdrop-blur-sm">
            <Download className="w-4 h-4" /> Import Data
          </button>
        </div>
      </motion.div>

      {/* ── Stat cards ── */}
      <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 — accent gradient */}
        <motion.div
          variants={fade}
          className="rounded-2xl p-5 relative overflow-hidden col-span-1 shadow-lg"
          style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #2c4a6a 100%)` }}
        >
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
          <button className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors">
            <ArrowUpRight className="w-3.5 h-3.5 text-white" />
          </button>
          <p className="text-white/70 text-xs font-medium mt-1">Total Courses</p>
          <p className="text-white text-4xl font-black mt-1">
            {mockAnalytics.completedCourses + mockAnalytics.ongoingInterests + 2}
          </p>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="flex items-center gap-1 bg-white/15 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              <TrendingUp className="w-2.5 h-2.5" /> Increased from last month
            </span>
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div variants={fade} className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 relative shadow-sm hover:shadow-md transition-shadow">
          <button className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors">
            <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <p className="text-muted-foreground text-xs font-medium mt-1">Completed</p>
          <p className="text-3xl font-black mt-1" style={{ color: PRIMARY }}>{mockAnalytics.completedCourses}</p>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-semibold">
              <TrendingUp className="w-2.5 h-2.5" /> Increased from last month
            </span>
          </div>
        </motion.div>

        {/* Card 3 */}
        <motion.div variants={fade} className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 relative shadow-sm hover:shadow-md transition-shadow">
          <button className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors">
            <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <p className="text-muted-foreground text-xs font-medium mt-1">In Progress</p>
          <p className="text-3xl font-black mt-1" style={{ color: ACCENT }}>{mockAnalytics.ongoingInterests}</p>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="flex items-center gap-1 text-orange-600 text-[10px] font-semibold">
              <TrendingUp className="w-2.5 h-2.5" /> Active learning
            </span>
          </div>
        </motion.div>

        {/* Card 4 */}
        <motion.div variants={fade} className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 relative shadow-sm hover:shadow-md transition-shadow">
          <button className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors">
            <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <p className="text-muted-foreground text-xs font-medium mt-1">Upcoming</p>
          <p className="text-3xl font-black mt-1" style={{ color: PRIMARY }}>2</p>
          <p className="text-muted-foreground text-[10px] font-medium mt-3">On Schedule</p>
        </motion.div>
      </motion.div>

      {/* ── Middle row ── */}
      <motion.div variants={stagger} className="grid lg:grid-cols-12 gap-4">

        {/* Learning Analytics — bar chart */}
        <motion.div
          variants={fade}
          className="lg:col-span-5 bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-sm"
        >
          <h2 className="font-bold text-base" style={{ color: PRIMARY }}>Learning Analytics</h2>
          <p className="text-muted-foreground text-xs mt-0.5 mb-4">Hours spent studying this week</p>

          {/* SVG defs for hatch */}
          <svg width="0" height="0" className="absolute">
            <defs>
              <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" stroke={PRIMARY} strokeWidth="1.5" strokeOpacity="0.3" />
              </pattern>
            </defs>
          </svg>

          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekActivity} barCategoryGap="28%" margin={{ top: 24, right: 4, bottom: 0, left: 0 }}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#3d5f80' }}
              />
              <Tooltip
                cursor={false}
                contentStyle={{
                  background: 'rgba(255,255,255,0.95)',
                  border: '1px solid rgba(23, 43, 68, 0.1)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                }}
                formatter={(v: number) => [`${v}h`, 'Study time']}
              />
              <Bar dataKey="hours" shape={(p: object) => <RoundedBar {...(p as Parameters<typeof RoundedBar>[0])} />} isAnimationActive>
                {weekActivity.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.solid ? PRIMARY : 'url(#hatch)'}
                    stroke={entry.solid ? 'none' : PRIMARY}
                    strokeWidth={entry.solid ? 0 : 1}
                    strokeOpacity={0.25}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Reminder / Today's Schedule */}
        <motion.div
          variants={fade}
          className="lg:col-span-4 bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-sm flex flex-col justify-between"
        >
          <div>
            <h2 className="font-bold text-base" style={{ color: PRIMARY }}>Reminders</h2>
            <div className="mt-4 space-y-1">
              <h3 className="text-xl font-extrabold leading-snug" style={{ color: PRIMARY }}>Deep Dive into<br />React Patterns</h3>
              <p className="text-muted-foreground text-sm">Time: 02.00 pm – 04.00 pm</p>
            </div>
          </div>
          <button
            className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: ACCENT, boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)' }}
          >
            <Video className="w-4 h-4" /> Start Session
          </button>
        </motion.div>

        {/* Active Courses list */}
        <motion.div
          variants={fade}
          className="lg:col-span-3 bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base" style={{ color: PRIMARY }}>Courses</h2>
            <button
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:bg-orange-50"
              style={{ border: `1px solid ${ACCENT}`, color: ACCENT }}
            >
              <Plus className="w-3 h-3" /> New
            </button>
          </div>
          <div className="space-y-3">
            {activeCourses.map((c) => {
              const Icon = c.icon
              return (
                <div key={c.title} className="flex items-center gap-3 group cursor-pointer">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                    style={{ background: c.color + '20' }}
                  >
                    <Icon className="w-4 h-4" style={{ color: c.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate group-hover:text-[#172b44]">{c.title}</p>
                    <p className="text-[10px] text-muted-foreground">{c.due}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* ── Bottom row ── */}
      <motion.div variants={stagger} className="grid lg:grid-cols-12 gap-4">

        {/* Team / Learning Activity */}
        <motion.div
          variants={fade}
          className="lg:col-span-5 bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base" style={{ color: PRIMARY }}>Learning Activity</h2>
            <button
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/80 border border-border/50 hover:bg-white transition-colors"
            >
              <Users className="w-3 h-3" /> Add Member
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((a) => (
              <div key={a.name} className="flex items-center gap-3 group cursor-pointer">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm transition-transform group-hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #2c4a6a 100%)` }}
                >
                  {a.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold">{a.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    Working on <span className="font-semibold text-foreground">{a.task}</span>
                  </p>
                </div>
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusBadge[a.status]}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Course Progress — donut */}
        <motion.div
          variants={fade}
          className="lg:col-span-4 bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-sm flex flex-col items-center"
        >
          <div className="w-full mb-2">
            <h2 className="font-bold text-base" style={{ color: PRIMARY }}>Course Progress</h2>
          </div>

          <div className="relative mt-2">
            <ResponsiveContainer width={180} height={130}>
              <PieChart>
                <Pie
                  data={progressData}
                  cx="50%"
                  cy="90%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {progressData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
              <p className="text-3xl font-black leading-none" style={{ color: PRIMARY }}>{completedPct}%</p>
              <p className="text-xs text-muted-foreground mt-0.5">Course Done</p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-xs">
            {progressData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-muted-foreground">{d.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Study Timer */}
        <motion.div
          variants={fade}
          className="lg:col-span-3 rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #2c4a6a 100%)` }}
        >
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/5" />
          <div className="relative z-10">
            <h2 className="font-semibold text-white/80 text-sm">Study Timer</h2>
          </div>
          <div className="my-4 text-center relative z-10">
            <p className="text-4xl font-black text-white tracking-wider font-mono">01:24:08</p>
          </div>
          <div className="flex items-center justify-center gap-3 relative z-10">
            <button className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
              <Pause className="w-5 h-5 text-white" />
            </button>
            <button 
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{ background: ACCENT }}
            >
              <Square className="w-4 h-4 text-white fill-white" />
            </button>
          </div>
        </motion.div>
      </motion.div>

    </motion.div>
  )
}
