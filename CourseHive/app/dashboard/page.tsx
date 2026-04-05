'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Download,
  Users,
  TrendingUp,
  Pause,
  Play,
  RotateCcw,
  BookOpen,
  Brain,
  Code2,
  Smartphone,
  Cloud,
  Sparkles,
  Flame,
  Loader2,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { useCourses, useDashboardData, useWeeklyActivity } from '@/hooks/use-api'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const PRIMARY = 'var(--primary)'
const ACCENT = 'var(--accent)'

// Fallback week activity data when API doesn't have weekly stats yet
const defaultWeekActivity = [
  { day: 'S', hours: 0, solid: false, highlight: false },
  { day: 'M', hours: 0, solid: false, highlight: false },
  { day: 'T', hours: 0, solid: false, highlight: false },
  { day: 'W', hours: 0, solid: false, highlight: false },
  { day: 'T', hours: 0, solid: false, highlight: false },
  { day: 'F', hours: 0, solid: false, highlight: false },
  { day: 'S', hours: 0, solid: false, highlight: false },
]

const statusBadge: Record<string, string> = {
  Completed: 'bg-emerald-50 dark:bg--900/20 text-emerald-700 dark:text--400 border border-emerald-200',
  'In Progress': 'bg-orange-50 dark:bg--900/20 text-orange-700 border border-orange-200',
  Pending: 'bg-slate-100 text-slate-500 border border-slate-200',
}

// Icon colors for interests
const interestColors = ['#4f46e5', '#0891b2', '#ea580c', '#be185d', '#0d9488', '#7c3aed']
const courseIcons = [Code2, Smartphone, Cloud, BookOpen]

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
  const { setModalOpen } = useAppStore()
  
  // ─── Fetch real dashboard data ───
  const { data: dashboardData, loading: dashboardLoading } = useDashboardData()
  const { data: apiWeekActivity } = useWeeklyActivity()
  const activeInterestId = dashboardData?.activeInterest?.id || null
  const { data: courseData, loading: coursesLoading } = useCourses(activeInterestId)
  
  // Transform API weekly activity or use fallback
  const weekActivity = useMemo(() => {
    if (apiWeekActivity && apiWeekActivity.length > 0) {
      const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
      return apiWeekActivity.map((item, index) => ({
        day: item.day || dayLabels[index % 7],
        hours: item.hours || 0,
        solid: item.hours > 2,
        highlight: index === new Date().getDay(),
      }))
    }
    return defaultWeekActivity
  }, [apiWeekActivity])

  const activeCourses = useMemo(() => {
    if (!courseData || courseData.length === 0) return []

    return courseData
      .filter((course) => !course.is_completed)
      .slice(0, 4)
      .map((course, index) => ({
        title: course.name,
        due: course.roadmap_data?.duration || course.roadmap_data?.difficulty || 'Ready to continue',
        icon: courseIcons[index % courseIcons.length],
        color: interestColors[index % interestColors.length],
      }))
  }, [courseData])

  const recentActivity = useMemo(() => {
    const items: Array<{
      name: string
      task: string
      avatar: string
      status: 'Completed' | 'In Progress' | 'Pending'
    }> = []

    const username = dashboardData?.user?.username || 'You'
    const userAvatar = username.slice(0, 2).toUpperCase()

    activeCourses.slice(0, 2).forEach((course) => {
      items.push({
        name: username,
        task: course.title,
        avatar: userAvatar,
        status: 'In Progress',
      })
    })

    dashboardData?.interests
      ?.filter((interest) => interest.is_completed)
      .slice(0, 2)
      .forEach((interest) => {
        items.push({
          name: interest.name,
          task: 'Learning path completed',
          avatar: interest.name.slice(0, 2).toUpperCase(),
          status: 'Completed',
        })
      })

    if (items.length === 0) {
      items.push({
        name: username,
        task: dashboardData?.activeInterest
          ? `Start ${dashboardData.activeInterest.name}`
          : 'Import your history to build a roadmap',
        avatar: userAvatar,
        status: 'Pending',
      })
    }

    return items.slice(0, 4)
  }, [activeCourses, dashboardData])
  
  // ─── Global Stopwatch Implementation ───
  const [timerState, setTimerState] = useState<{ isRunning: boolean; elapsed: number; lastStarted: number | null }>({
    isRunning: false,
    elapsed: 0,
    lastStarted: null,
  })
  const [displayTime, setDisplayTime] = useState(0)

  // 1. Hydrate from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('courseHive_studyTimer')
    if (saved) {
      try {
        setTimerState(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  // 2. Persist state changes
  useEffect(() => {
    localStorage.setItem('courseHive_studyTimer', JSON.stringify(timerState))
  }, [timerState])

  // 3. Tick UI every second if running
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerState.isRunning && timerState.lastStarted !== null) {
      interval = setInterval(() => {
        const now = Date.now()
        setDisplayTime(timerState.elapsed + (now - timerState.lastStarted!))
      }, 1000)
    } else {
      setDisplayTime(timerState.elapsed)
    }
    return () => clearInterval(interval)
  }, [timerState])

  const handleToggleTimer = () => {
    setTimerState(prev => {
      if (prev.isRunning) {
        return { isRunning: false, elapsed: prev.elapsed + (Date.now() - prev.lastStarted!), lastStarted: null }
      }
      return { ...prev, isRunning: true, lastStarted: Date.now() }
    })
  }

  const handleResetTimer = () => {
    setTimerState({ isRunning: false, elapsed: 0, lastStarted: null })
  }

  // Format ms to HH:MM:SS
  const totalSeconds = Math.floor(displayTime / 1000)
  const formatH = Math.floor(totalSeconds / 3600).toString().padStart(2, '0')
  const formatM = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0')
  const formatS = (totalSeconds % 60).toString().padStart(2, '0')

  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6">

      {/* ── Header ── */}
      <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: PRIMARY }}>Dashboard</h1>
            <span className="flex items-center gap-1 bg-orange-100 text-orange-600 dark:text--400 text-[10px] font-bold px-2 py-1 rounded-full">
              <Sparkles className="w-3 h-3" /> AI Powered
            </span>
          </div>
          <p className="text-muted-foreground text-sm">Plan, prioritize, and accomplish your learning goals.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => setModalOpen('uploadHistory', true)}
            data-tour="upload-history"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:shadow-lg hover:-translate-y-0.5 shadow-md"
            style={{ background: ACCENT, boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)' }}
          >
            <Download className="w-4 h-4" /> Import History
          </button>
        </div>
      </motion.div>

      {/* ── Stat cards ── */}
      <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 — XP (accent gradient) */}
        <motion.div
          variants={fade}
          className="rounded-2xl p-5 relative overflow-hidden col-span-1 shadow-lg"
          style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, var(--primary) 100%)` }}
        >
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-card/50 " />
          <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-card/50 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <p className="text-white/70 text-xs font-medium mt-1">Total XP</p>
          <p className="text-white text-4xl font-black mt-1">
            {dashboardLoading ? '...' : (dashboardData?.stats?.xp || 0)}
          </p>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="flex items-center gap-1 bg-card/50 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              <TrendingUp className="w-2.5 h-2.5" /> Keep learning!
            </span>
          </div>
        </motion.div>

        {/* Card 2 — Streak */}
        <motion.div variants={fade} className="bg-card/50 backdrop-blur-sm rounded-2xl p-5 border border-border/ relative shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
            <Flame className="w-3.5 h-3.5 text-orange-600 dark:text--400" />
          </div>
          <p className="text-muted-foreground text-xs font-medium mt-1">Day Streak</p>
          <p className="text-3xl font-black mt-1" style={{ color: ACCENT }}>
            {dashboardLoading ? '...' : (dashboardData?.stats?.streak || 0)}
          </p>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="flex items-center gap-1 text-orange-600 dark:text--400 text-[10px] font-semibold">
              <Flame className="w-2.5 h-2.5" /> Keep it going!
            </span>
          </div>
        </motion.div>

        {/* Card 3 — Completed Courses */}
        <motion.div variants={fade} className="bg-card/50 backdrop-blur-sm rounded-2xl p-5 border border-border/ relative shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-emerald-50 dark:bg--900/20 flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text--400" />
          </div>
          <p className="text-muted-foreground text-xs font-medium mt-1">Courses Done</p>
          <p className="text-3xl font-black mt-1" style={{ color: PRIMARY }}>
            {dashboardLoading ? '...' : (dashboardData?.stats?.completedCourses || 0)}
          </p>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="flex items-center gap-1 text-emerald-600 dark:text--400 text-[10px] font-semibold">
              <TrendingUp className="w-2.5 h-2.5" /> Great progress!
            </span>
          </div>
        </motion.div>

        {/* Card 4 — Active Interests */}
        <motion.div variants={fade} className="bg-card/50 backdrop-blur-sm rounded-2xl p-5 border border-border/ relative shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-blue-50 dark:bg--900/20 flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 text-blue-600 dark:text--400" />
          </div>
          <p className="text-muted-foreground text-xs font-medium mt-1">Active Interests</p>
          <p className="text-3xl font-black mt-1" style={{ color: PRIMARY }}>
            {dashboardLoading ? '...' : (dashboardData?.stats?.activeInterests || 0)}
          </p>
          <p className="text-muted-foreground text-[10px] font-medium mt-3">Learning paths</p>
        </motion.div>
      </motion.div>

      {/* ── Middle row ── */}
      <motion.div variants={stagger} className="grid lg:grid-cols-12 gap-4">

        {/* Learning Analytics — bar chart */}
        <motion.div
          variants={fade}
          className="lg:col-span-8 bg-card/50 backdrop-blur-sm rounded-3xl p-6 border border-border/ shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-extrabold text-xl tracking-tight text-foreground">Learning Analytics</h2>
              <p className="text-muted-foreground text-sm font-medium mt-1">Hours spent studying this week</p>
            </div>
            <div className="bg-orange-50 dark:bg--900/20 text-orange-600 dark:text--400 px-4 py-1.5 rounded-full text-xs font-bold border border-orange-100 hidden sm:flex items-center shadow-sm">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> +15% vs Last Week
            </div>
          </div>

          {/* SVG defs for hatch */}
          <svg width="0" height="0" className="absolute">
            <defs>
              <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" stroke={PRIMARY} strokeWidth="2" strokeOpacity="0.25" />
              </pattern>
            </defs>
          </svg>

          <div className="w-full flex-1 min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekActivity} barCategoryGap="30%" margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#e2e8f0" strokeOpacity={0.8} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} 
                  tickFormatter={(v) => `${v}h`} 
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 13, fill: '#334155', fontWeight: 700 }}
                  dy={15}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(23,43,68,0.03)' }}
                  contentStyle={{
                    background: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(23, 43, 68, 0.08)',
                    borderRadius: '14px',
                    fontSize: '13px',
                    fontWeight: 600,
                    boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                    padding: '12px 16px'
                  }}
                  formatter={(v: number) => [`${v} hours`, 'Study Time']}
                  labelStyle={{ color: '#64748b', fontWeight: 600, marginBottom: '6px' }}
                />
                <Bar dataKey="hours" shape={(p: object) => <RoundedBar {...(p as Parameters<typeof RoundedBar>[0])} />} isAnimationActive>
                  {weekActivity.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.solid ? (entry.highlight ? ACCENT : PRIMARY) : 'url(#hatch)'}
                      stroke={entry.solid ? 'none' : PRIMARY}
                      strokeWidth={entry.solid ? 0 : 2}
                      strokeOpacity={0.2}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Active Courses list */}
        <motion.div
          variants={fade}
          className="lg:col-span-4 bg-card/50 backdrop-blur-sm rounded-2xl p-5 border border-border/ shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base text-foreground">Courses</h2>
            <Link
              href={dashboardData?.activeInterest ? `/dashboard/courses/${dashboardData.activeInterest.id}` : '/dashboard/interests'}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:bg-orange-50 dark:bg--900/20 bg-card"
              style={{ border: `1px solid ${ACCENT}`, color: ACCENT }}
            >
              See All
            </Link>
          </div>
          <div className="space-y-4">
            {coursesLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-3">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading courses...</span>
              </div>
            ) : activeCourses.length > 0 ? (
              activeCourses.map((c) => {
                const Icon = c.icon
                return (
                  <div key={c.title} className="flex items-center gap-3 group cursor-pointer border border-transparent hover:border-slate-100 p-2 -mx-2 rounded-xl transition-colors">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                      style={{ background: c.color + '15' }}
                    >
                      <Icon className="w-5 h-5" style={{ color: c.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate text-foreground">{c.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.due}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-sm text-muted-foreground py-3">
                {dashboardData?.activeInterest ? 'No active courses right now.' : 'Choose an interest to see your course roadmap.'}
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* ── Bottom row ── */}
      <motion.div variants={stagger} className="grid lg:grid-cols-12 gap-4">

        {/* Team / Learning Activity */}
        <motion.div
          variants={fade}
          className="lg:col-span-8 bg-card/50 backdrop-blur-sm rounded-2xl p-5 border border-border/ shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base text-foreground">Learning Activity</h2>
            <button
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-card border border-border/50 hover:bg-slate-50 transition-colors text-foreground"
            >
              <Users className="w-3 h-3" /> Friends Activity
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {recentActivity.map((a) => (
              <div key={`${a.name}-${a.task}`} className="flex items-center gap-3 group cursor-pointer p-3 rounded-xl hover:bg-card/50 border border-transparent hover:border-slate-100 transition-all">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm transition-transform group-hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, var(--primary) 100%)` }}
                >
                  {a.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{a.name}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    Working on <span className="font-bold text-foreground">{a.task}</span>
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${statusBadge[a.status]}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Global Study Timer */}
        <motion.div
          variants={fade}
          className="lg:col-span-4 rounded-2xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group"
          style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, var(--primary) 100%)` }}
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#f97316]/20 blur-2xl group-hover:bg-[#f97316]/30 transition-colors" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-card/50 " />
          
          <div className="relative z-10 flex items-center justify-between">
            <h2 className="font-bold text-white/90 text-base uppercase tracking-widest flex items-center gap-2">
              <Sparkles className={`w-4 h-4 ${timerState.isRunning ? 'text-[#f97316] animate-pulse' : 'text-white/50'}`} /> Study Timer
            </h2>
            {timerState.isRunning && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-50 dark:bg--900/200/20 text-red-100 text-[10px] font-bold border border-red-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" /> REC
              </span>
            )}
          </div>

          <div className="my-6 text-center relative z-10">
            <p className="text-5xl font-black text-white tracking-widest font-mono drop-shadow-md">
              {formatH}<span className="text-white/50 mx-0.5">:</span>{formatM}<span className="text-white/50 mx-0.5">:</span>{formatS}
            </p>
            <p className="text-white/50 text-xs font-semibold mt-2 uppercase tracking-widest">Global Session Time</p>
          </div>

          <div className="flex items-center justify-center gap-4 relative z-10">
            <button 
              onClick={handleToggleTimer}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95 ${
                timerState.isRunning ? 'bg-rose-500 hover:bg-rose-600' : 'bg-[#f97316] hover:bg-[#ea6c0a]'
              }`}
            >
              {timerState.isRunning ? <Pause className="w-6 h-6 text-white fill-white" /> : <Play className="w-6 h-6 text-white fill-white ml-1" />}
            </button>
            <button 
              onClick={handleResetTimer}
              disabled={displayTime === 0}
              className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all border ${
                displayTime === 0 
                  ? 'bg-card/50 border-border/ text-white/20 cursor-not-allowed' 
                  : 'bg-card/50 hover:bg-card/50 border-border/ hover:border-border/ text-white'
              }`}
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </motion.div>

    </motion.div>
  )
}