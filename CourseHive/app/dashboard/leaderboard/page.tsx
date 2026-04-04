'use client'

import { motion } from 'framer-motion'
import { Trophy, Flame, Download, ArrowUpRight, Crown, TrendingUp } from 'lucide-react'
import { mockLeaderboard } from '@/lib/mock-data'

const PRIMARY = '#1a3d2c'

const fade = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } }
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }

type TimePeriod = 'All Time' | 'This Month' | 'This Week'

const fieldStyle: Record<string, { bg: string; text: string }> = {
  Engineering: { bg: '#eff6ff', text: '#1d4ed8' },
  Business:    { bg: '#faf5ff', text: '#7e22ce' },
  Medical:     { bg: '#fff1f2', text: '#be123c' },
  Law:         { bg: '#fffbeb', text: '#b45309' },
}

const podium = [
  { medal: '🥇', ring: '#F59E0B', label: '1st', bg: '#fffbeb' },
  { medal: '🥈', ring: '#94A3B8', label: '2nd', bg: '#f8fafc' },
  { medal: '🥉', ring: '#CD7F32', label: '3rd', bg: '#fef9ee' },
]

export default function LeaderboardPage() {
  const userRank = 8
  const topThree = mockLeaderboard.slice(0, 3)
  const rest = mockLeaderboard.slice(3)

  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6">

      {/* Header */}
      <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground text-sm mt-1">See how you stack up against other learners</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-border hover:bg-secondary transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </motion.div>

      {/* Your rank card */}
      <motion.div
        variants={fade}
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{ background: PRIMARY }}
      >
        <button className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
          <ArrowUpRight className="w-3.5 h-3.5 text-white" />
        </button>
        <p className="text-white/70 text-xs font-medium">Your Current Rank</p>
        <p className="text-5xl font-black mt-1">#{userRank}</p>
        <div className="flex items-center gap-1.5 mt-3">
          <span className="flex items-center gap-1 bg-white/15 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            <TrendingUp className="w-2.5 h-2.5" /> 2,100 points · 14 day streak
          </span>
        </div>
        <p className="text-white/50 text-xs mt-2">Earn <span className="font-bold text-white">750 more points</span> to reach top 5</p>
      </motion.div>

      {/* Time period filter */}
      <motion.div variants={fade} className="flex items-center justify-between">
        <h2 className="font-bold text-base">Rankings</h2>
        <div className="flex gap-1 bg-secondary/40 p-1 rounded-xl">
          {(['All Time', 'This Month', 'This Week'] as TimePeriod[]).map((p, i) => (
            <button
              key={p}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                i === 0 ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Top 3 podium */}
      <motion.div variants={stagger} className="grid grid-cols-3 gap-3">
        {topThree.map((entry, idx) => {
          const p = podium[idx]
          return (
            <motion.div
              key={entry.rank}
              variants={fade}
              whileHover={{ y: -3, transition: { duration: 0.18 } }}
              className="bg-card border border-border/50 rounded-2xl p-4 text-center relative"
              style={{ borderColor: p.ring + '40' }}
            >
              {idx === 0 && <Crown className="w-4 h-4 absolute top-3 right-3" style={{ color: p.ring }} />}
              <div
                className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white font-bold text-sm"
                style={{ background: PRIMARY, outline: `3px solid ${p.ring}`, outlineOffset: '2px' }}
              >
                {entry.name.split(' ').map(n => n[0]).join('')}
              </div>
              <p className="text-lg mt-1">{p.medal}</p>
              <h3 className="font-bold text-xs mt-1 leading-tight">{entry.name}</h3>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 inline-block"
                style={fieldStyle[entry.field] || fieldStyle.Engineering}
              >
                {entry.field}
              </span>
              <p className="font-black text-base mt-1.5" style={{ color: PRIMARY }}>
                {entry.points.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground">pts</p>
              <div className="flex items-center justify-center gap-1 mt-1 text-xs text-muted-foreground">
                <Flame className="w-3 h-3 text-orange-400" />
                <span>{entry.streak}d</span>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Rest of rankings + you */}
      <motion.div variants={stagger} className="space-y-2">
        {[...rest, { rank: userRank, name: 'Jordan Smith', field: 'Engineering', points: 2100, streak: 14 }]
          .sort((a, b) => a.rank - b.rank)
          .map((entry) => {
            const isYou = entry.rank === userRank
            return (
              <motion.div
                key={entry.rank}
                variants={fade}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  isYou
                    ? 'border-2'
                    : 'bg-card border-border/50 hover:border-accent/20'
                }`}
                style={isYou ? { background: PRIMARY + '08', borderColor: PRIMARY + '50' } : {}}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                  style={isYou ? { background: PRIMARY, color: '#fff' } : { background: 'var(--secondary)', color: 'var(--muted-foreground)' }}
                >
                  {entry.rank}
                </div>

                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center font-bold text-xs shrink-0" style={isYou ? { background: PRIMARY + '20', color: PRIMARY } : {}}>
                  {entry.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm">{isYou ? 'Jordan Smith' : entry.name}</h3>
                    {isYou && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shrink-0" style={{ background: PRIMARY }}>
                        You
                      </span>
                    )}
                  </div>
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full inline-block mt-0.5"
                    style={fieldStyle[entry.field] || fieldStyle.Engineering}
                  >
                    {entry.field}
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-1 text-muted-foreground">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-xs font-medium">{entry.streak}d</span>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-base font-bold" style={isYou ? { color: PRIMARY } : {}}>
                    {entry.points.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground">pts</p>
                </div>
              </motion.div>
            )
          })}
      </motion.div>

      {/* CTA */}
      <motion.div variants={fade} className="bg-card border border-border/50 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-bold">Keep climbing the ranks!</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Complete courses and maintain your streak to earn more points</p>
        </div>
        <button
          className="shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-colors"
          style={{ background: PRIMARY }}
        >
          Earn Points
        </button>
      </motion.div>
    </motion.div>
  )
}
