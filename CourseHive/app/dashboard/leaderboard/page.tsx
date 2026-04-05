'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Flame, Download, ArrowUpRight, Crown, TrendingUp, Sparkles, Medal, Zap, Loader2 } from 'lucide-react'
import { useLeaderboard, useMyRank, useUser } from '@/hooks/use-api'

const PRIMARY = 'var(--primary)'
const ACCENT = 'var(--accent)'

const fade = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }

type TimePeriod = 'All Time' | 'This Month' | 'This Week'

const periodMap: Record<TimePeriod, 'all' | 'month' | 'week'> = {
  'All Time': 'all',
  'This Month': 'month',
  'This Week': 'week',
}

const fieldStyle: Record<string, { bg: string; text: string }> = {
  Engineering: { bg: '#eff6ff', text: '#1d4ed8' },
  Business:    { bg: '#faf5ff', text: '#7e22ce' },
  Medical:     { bg: '#fff1f2', text: '#be123c' },
  Law:         { bg: '#fffbeb', text: '#b45309' },
}

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2)

const toBadgeStyle = (field: string) => {
  const style = fieldStyle[field] || fieldStyle.Engineering
  return { background: style.bg, color: style.text }
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<TimePeriod>('All Time')
  
  const { data: leaderboard, loading } = useLeaderboard(periodMap[activeTab])
  const { data: myRankData } = useMyRank()
  const { data: currentUser } = useUser()
  
  const userRank = myRankData?.rank || 0
  
  // Transform leaderboard data
  const entries = useMemo(() => {
    if (!leaderboard) return []
    return leaderboard.map((entry, index) => ({
      rank: entry.rank || index + 1,
      name: entry.username || 'Anonymous',
      field: entry.field || 'Engineering',
      points: entry.xp || 0,
      streak: entry.streak || 0,
      user_id: entry.user_id,
    }))
  }, [leaderboard])
  
  const topThree = entries.slice(0, 3)
  const rest = entries.slice(3)
  const podium = [
    topThree[0] || { rank: 1, name: 'N/A', field: 'Engineering', points: 0, streak: 0, user_id: 'podium-1' },
    topThree[1] || { rank: 2, name: 'N/A', field: 'Engineering', points: 0, streak: 0, user_id: 'podium-2' },
    topThree[2] || { rank: 3, name: 'N/A', field: 'Engineering', points: 0, streak: 0, user_id: 'podium-3' },
  ]
  
  // Add current user to list if not in top rankings
  const allRankings = useMemo(() => {
    if (!currentUser || userRank <= 0 || userRank <= 10) return rest
    
    const userInList = entries.find(e => e.user_id === currentUser.id)
    if (userInList) return rest
    
    return [...rest, {
      rank: userRank,
      name: currentUser.username || 'You',
      field: currentUser.field || 'Engineering',
      points: currentUser.xp || 0,
      streak: currentUser.streak || 0,
      user_id: currentUser.id,
    }].sort((a, b) => a.rank - b.rank)
  }, [rest, currentUser, userRank, entries])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] pb-24 relative selection:bg-[#f97316]/20">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#f97316]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-40 left-0 w-[300px] h-[300px] bg-[#172b44]/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6">

        {/* ── HEADER ── */}
        <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Leaderboard</h1>
            <p className="text-muted-foreground text-sm mt-1">See how you stack up against other learners</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-card/50 backdrop-blur-md p-1 rounded-xl flex shadow-sm border border-border">
              {(['This Week', 'This Month', 'All Time'] as TimePeriod[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 ${
                    activeTab === tab ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[#172b44] rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    />
                  )}
                  {tab}
                </button>
              ))}
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-border hover:bg-secondary transition-colors text-foreground bg-card">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </motion.div>

        {/* ── PODIUM SECTION ── */}
        <motion.div variants={fade} className="relative pt-16 pb-8">
          <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-6 min-h-[300px]">
            {/* 2ND PLACE */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
              className="w-full md:w-1/3 max-w-[280px] order-2 md:order-1"
            >
              <div className="relative bg-gradient-to-b from-slate-50 to-white rounded-3xl border border-slate-200 p-6 pt-12 text-center shadow-lg shadow-slate-200/50 transform hover:-translate-y-2 transition-transform duration-300">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 p-[3px] shadow-xl">
                      <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-2xl font-black text-slate-700">
                        {getInitials(podium[1].name)}
                      </div>
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-400 text-white text-xs font-black px-3 py-1 rounded-full shadow-md border-2 border-border">
                      2ND
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-foreground mt-2 truncate">{podium[1].name}</h3>
                <div className="flex justify-center mt-2">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider" style={toBadgeStyle(podium[1].field)}>
                    {podium[1].field}
                  </span>
                </div>
                
                <div className="mt-6 flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-700">{podium[1].points.toLocaleString()}</span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">XP Points</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500/20" />
                  <span className="text-sm font-bold text-slate-600">{podium[1].streak} Day Streak</span>
                </div>
              </div>
            </motion.div>

            {/* 1ST PLACE */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
              className="w-full md:w-1/3 max-w-[320px] order-1 md:order-2 z-10"
            >
              <div className="relative bg-gradient-to-b from-[#172b44] to-[#233f63] rounded-3xl p-1 shadow-2xl shadow-[#172b44]/20 transform md:-translate-y-8 hover:-translate-y-10 transition-transform duration-300">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl" />
                
                <div className="bg-[#172b44] rounded-[22px] p-6 pt-20 text-center relative h-full">
                  {/* Subtle glass effect lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] rounded-[22px] overflow-hidden" />
                  
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20">
                    <div className="relative">
                      <Crown className="w-10 h-10 text-yellow-400 absolute -top-8 left-1/2 -translate-x-1/2 drop-shadow-md" />
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 p-[4px] shadow-2xl">
                        <div className="w-full h-full rounded-full bg-[#172b44] flex items-center justify-center text-3xl font-black text-white">
                          {getInitials(podium[0].name)}
                        </div>
                      </div>
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-foreground text-sm font-black px-4 py-1.5 rounded-full shadow-lg border-2 border-[#172b44]">
                        1ST
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-white mt-4 truncate relative z-10">{podium[0].name}</h3>
                  <div className="flex justify-center mt-3 relative z-10">
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-card/50 text-yellow-300 border border-border/ backdrop-blur-md">
                      {podium[0].field}
                    </span>
                  </div>
                  
                  <div className="mt-8 flex flex-col items-center relative z-10">
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 drop-shadow-sm">
                        {podium[0].points.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-white/50 uppercase tracking-widest mt-2">Total XP Points</span>
                  </div>
                  
                  <div className="mt-6 pt-5 border-t border-border/ flex items-center justify-center gap-2 relative z-10">
                    <Flame className="w-5 h-5 text-orange-400 fill-orange-400/30" />
                    <span className="text-sm font-bold text-white/90">{podium[0].streak} Day Streak!</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 3RD PLACE */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}
              className="w-full md:w-1/3 max-w-[280px] order-3"
            >
              <div className="relative bg-gradient-to-b from-orange-50 to-white rounded-3xl border border-orange-100 p-6 pt-12 text-center shadow-lg shadow-orange-100/50 transform hover:-translate-y-2 transition-transform duration-300">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 p-[3px] shadow-xl">
                      <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-2xl font-black text-orange-800">
                        {getInitials(podium[2].name)}
                      </div>
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md border-2 border-border">
                      3RD
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-foreground mt-2 truncate">{podium[2].name}</h3>
                <div className="flex justify-center mt-2">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider" style={toBadgeStyle(podium[2].field)}>
                    {podium[2].field}
                  </span>
                </div>
                
                <div className="mt-6 flex flex-col items-center">
                  <span className="text-3xl font-black text-orange-900">{podium[2].points.toLocaleString()}</span>
                  <span className="text-xs font-semibold text-orange-400/80 uppercase tracking-widest mt-1">XP Points</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-orange-100/50 flex items-center justify-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500/20" />
                  <span className="text-sm font-bold text-orange-800/80">{podium[2].streak} Day Streak</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── THE LIST ── */}
        <motion.div variants={stagger} className="bg-card/50 backdrop-blur-xl border border-slate-200/60 rounded-[32px] p-2 md:p-6 shadow-xl shadow-slate-200/40">
          
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-1"></div>
            <div className="col-span-4">Learner</div>
            <div className="col-span-3">Field</div>
            <div className="col-span-1 text-center">Streak</div>
            <div className="col-span-2 text-right">XP Points</div>
          </div>

          <div className="space-y-3 relative">
            {allRankings.map((entry, idx) => {
              const isYou = currentUser && entry.user_id === currentUser.id
              
              return (
                <motion.div
                  key={entry.rank}
                  variants={fade}
                  whileHover={{ scale: 1.01, backgroundColor: isYou ? undefined : 'rgba(255,255,255,0.9)' }}
                  className={`relative grid grid-cols-1 md:grid-cols-12 items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                    isYou 
                      ? 'bg-gradient-to-r from-[#f97316]/10 to-transparent border-2 border-[#f97316] shadow-md z-10' 
                      : 'bg-card border border-slate-100 hover:shadow-md'
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center justify-center order-1 md:order-none absolute md:relative top-4 md:top-auto right-4 md:right-auto">
                    <span className={`text-lg md:text-xl font-black ${isYou ? 'text-[#f97316]' : 'text-slate-400'}`}>
                      #{entry.rank}
                    </span>
                  </div>

                  {/* Avatar */}
                  <div className="col-span-1 flex items-center justify-center order-2 md:order-none hidden md:flex">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                      isYou ? 'bg-[#f97316] text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {getInitials(entry.name)}
                    </div>
                  </div>

                  {/* Name & Badge Mobile */}
                  <div className="col-span-4 flex items-center gap-3 order-3 md:order-none">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm bg-slate-100 text-slate-600 md:hidden">
                      {getInitials(entry.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold text-base ${isYou ? 'text-foreground' : 'text-slate-700'}`}>
                          {entry.name}
                        </h3>
                        {isYou && (
                          <span className="bg-[#172b44] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <Zap className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" /> YOU
                          </span>
                        )}
                      </div>
                      <div className="md:hidden mt-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase" style={toBadgeStyle(entry.field)}>
                          {entry.field}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Field Desktop */}
                  <div className="col-span-3 hidden md:block order-4 md:order-none">
                    <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block" style={toBadgeStyle(entry.field)}>
                      {entry.field}
                    </span>
                  </div>

                  {/* Streak */}
                  <div className="col-span-1 flex items-center md:justify-center gap-1.5 order-5 md:order-none mt-2 md:mt-0">
                    <Flame className={`w-4 h-4 ${isYou ? 'text-orange-500 fill-orange-500/30' : 'text-orange-400'}`} />
                    <span className={`text-sm font-bold ${isYou ? 'text-orange-600 dark:text--400' : 'text-slate-500'}`}>{entry.streak}</span>
                    <span className="text-xs text-slate-400 md:hidden ml-1 uppercase tracking-wider font-semibold">Day Streak</span>
                  </div>

                  {/* Points */}
                  <div className="col-span-2 text-left md:text-right order-6 md:order-none mt-2 md:mt-0 flex md:block items-baseline gap-1">
                    <span className={`text-xl font-black ${isYou ? 'text-[#f97316]' : 'text-foreground'}`}>
                      {entry.points.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">XP</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* ── CTA BANNER ── */}
        <motion.div variants={fade} className="relative rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#172b44] via-[#244265] to-[#172b44]" />
          <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10" />
          
          <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 z-10 text-center md:text-left">
            <div>
              <div className="inline-flex items-center gap-2 bg-card/50 backdrop-blur-md border border-border/ px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider mb-3">
                <Medal className="w-3.5 h-3.5 text-yellow-400" />
                Level Up Fast
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Want to climb the ranks?</h2>
              <p className="text-white/70 text-sm md:text-base max-w-md">
                Complete modules, finish assignments, and maintain your daily streak to earn up to <strong className="text-white">500 XP</strong> today.
              </p>
            </div>
            
            <button className="flex items-center gap-2 bg-[#f97316] hover:bg-[#ea6c0a] text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-[#f97316]/40 transition-all hover:scale-105 active:scale-95 group shrink-0">
              Start Learning Now
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>
        
      </motion.div>
    </div>
  )
}
