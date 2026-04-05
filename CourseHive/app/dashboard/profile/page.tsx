'use client'

import { motion } from 'framer-motion'
import { Mail, BookOpen, Award, Calendar, Trophy, Edit3, Download, Shield, TrendingUp, ArrowUpRight, CheckCircle2, User, Sparkles, MapPin, Briefcase, Loader2 } from 'lucide-react'
import { useUser, useUserStats } from '@/hooks/use-api'

const PRIMARY = '#172b44'
const ACCENT = '#f97316'

const fade = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } }
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }

export default function ProfilePage() {
  const { data: user, loading: userLoading } = useUser()
  const { data: stats, loading: statsLoading } = useUserStats()
  
  const loading = userLoading || statsLoading
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
      </div>
    )
  }
  
  const statCards = [
    { icon: Trophy, label: 'Total XP Points', value: (stats?.xp || 0).toLocaleString() },
    { icon: BookOpen, label: 'Courses Completed', value: stats?.completedCourses || 0 },
    { icon: Award, label: 'Projects Completed', value: stats?.completedProjects || 0 },
  ]
  
  const userName = user?.username || 'User'
  const userField = user?.field || 'Engineering'
  const userType = user?.type || 'Student'
  const userEmail = user?.email || 'user@example.com'
  const userJoinDate = user?.created_at || new Date().toISOString()
  
  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6 max-w-6xl mx-auto pb-10">

      {/* Header */}
      <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#172b44]">Your Profile</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your account settings and track your learning journey</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border border-border hover:bg-secondary transition-colors text-[#172b44]">
            <Download className="w-4 h-4" /> Export Data
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-[#f97316] hover:bg-[#ea6c0a] shadow-md shadow-[#f97316]/20 transition-all hover:-translate-y-0.5">
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        </div>
      </motion.div>

      {/* Stat strip (consistent with other pages) */}
      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map(({ icon: Icon, label, value }, i) => (
          <motion.div
            key={label}
            variants={fade}
            className={`rounded-2xl p-5 border border-white/50 shadow-sm ${i === 0 ? 'text-white' : 'bg-white/70 backdrop-blur-sm hover:shadow-md transition-shadow'}`}
            style={i === 0 ? { background: `linear-gradient(135deg, ${PRIMARY} 0%, #2c4a6a 100%)` } : {}}
          >
            {i !== 0 && (
              <button className="float-right w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-400 hover:text-[#172b44]">
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${i === 0 ? 'bg-white/10 text-white' : 'bg-slate-100 text-[#172b44]'}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className={`text-sm font-semibold ${i === 0 ? 'text-white/80' : 'text-slate-500'}`}>{label}</p>
            <p className={`text-4xl font-black mt-1 tracking-tight ${i === 0 ? 'text-white' : 'text-[#172b44]'}`}>{value}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column: ID Card */}
        <motion.div variants={fade} className="lg:col-span-1 space-y-6">
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-[28px] overflow-hidden shadow-sm flex flex-col relative group hover:shadow-md transition-shadow">
            {/* Cover Strip */}
            <div className="h-32 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #2c4a6a 100%)` }}>
              <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10" />
            </div>
            
            <div className="px-6 pb-6 pt-0 relative flex flex-col items-center">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center text-3xl font-black text-white shadow-xl -mt-12 bg-gradient-to-br from-[#f97316] to-[#ea6c0a] relative z-10 group-hover:scale-105 transition-transform duration-300">
                {userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full" title="Online" />
              </div>
              
              <h2 className="text-xl font-bold text-[#172b44] mt-4">{userName}</h2>
              <p className="text-muted-foreground text-sm font-medium mt-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> {userField} {userType}
              </p>
              
              <div className="w-full mt-6 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-[#172b44]">{userEmail}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-[#172b44]">Joined {new Date(userJoinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-[#172b44]">Learning Online</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Details & Settings */}
        <motion.div variants={fade} className="lg:col-span-2 space-y-6">
          
          {/* Learning Profile Matrix */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-[28px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-[#172b44] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#f97316]" /> Learning Profile
              </h3>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Primary Field</label>
                <div className="px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-[#172b44]">
                  {userField}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Specialization Tracking</label>
                <div className="px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-[#172b44]">
                  {userType}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Goal</label>
                <div className="px-4 py-3.5 bg-indigo-50 border border-indigo-100 rounded-xl text-sm font-bold text-indigo-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Complete 5 courses this month
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Global Rank</label>
                <div className="px-4 py-3.5 bg-[#f97316]/10 border border-[#f97316]/20 rounded-xl text-sm font-black text-[#f97316] flex items-center gap-2">
                  <Trophy className="w-4 h-4" /> Top 5% Learner
                </div>
              </div>
            </div>
          </div>

          {/* Account Danger Zone & Settings */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-[28px] p-8 shadow-sm">
            <h3 className="font-bold text-lg text-[#172b44] flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-slate-400" /> Security & Account
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <button className="flex items-center justify-between p-4 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-sm font-semibold text-[#172b44] transition-all group">
                <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-slate-400 group-hover:text-[#172b44]" /> Change Password</span>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[#172b44]" />
              </button>
              
              <button className="flex items-center justify-between p-4 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-sm font-semibold text-[#172b44] transition-all group">
                <span className="flex items-center gap-2"><User className="w-4 h-4 text-slate-400 group-hover:text-[#172b44]" /> Privacy Preferences</span>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[#172b44]" />
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-[#172b44]">Danger Zone</h4>
                  <p className="text-xs text-slate-500 mt-1">Permanently delete your account and all data.</p>
                </div>
                <button className="px-6 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-bold border border-rose-100 transition-colors whitespace-nowrap">
                  Delete Account
                </button>
              </div>
            </div>
          </div>

        </motion.div>
      </div>

    </motion.div>
  )
}
