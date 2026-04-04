'use client'

import { motion } from 'framer-motion'
import { Mail, BookOpen, Award, Calendar, Trophy, Edit3, Download, Shield, TrendingUp, ArrowUpRight } from 'lucide-react'
import { mockUserProfile } from '@/lib/mock-data'

const PRIMARY = '#172b44'
const ACCENT = '#f97316'

const fade = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } }
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }

const statCards = [
  { icon: BookOpen, label: 'Courses Completed', value: mockUserProfile.completedCourses, primary: true },
  { icon: Award, label: 'Certificates', value: mockUserProfile.certificatesEarned, primary: false },
  { icon: Trophy, label: 'Leaderboard Rank', value: '#8', primary: false },
]

export default function ProfilePage() {
  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6 max-w-3xl">

      {/* Header */}
      <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your account and learning preferences</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:shadow-lg hover:-translate-y-0.5 transition-all"
            style={{ background: ACCENT, boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)' }}
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/70 border border-border/50 hover:bg-white transition-all backdrop-blur-sm">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </motion.div>

      {/* Profile card */}
      <motion.div variants={fade} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl overflow-hidden shadow-sm">
        {/* Cover strip */}
        <div className="h-24" style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #2c4a6a 100%)` }} />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div
              className="w-20 h-20 rounded-2xl border-4 border-white flex items-center justify-center text-xl font-black text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #2c4a6a 100%)` }}
            >
              JS
            </div>
            <button className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors hover:bg-orange-50" style={{ borderColor: ACCENT, color: ACCENT }}>
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>
          <h2 className="text-xl font-bold" style={{ color: PRIMARY }}>{mockUserProfile.name}</h2>
          <p className="text-muted-foreground text-sm mt-0.5">{mockUserProfile.field} · {mockUserProfile.type}</p>
        </div>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={stagger} className="grid grid-cols-3 gap-4">
        {statCards.map(({ icon: Icon, label, value, primary }) => (
          <motion.div
            key={label}
            variants={fade}
            className={`rounded-2xl p-5 border border-white/50 shadow-sm ${!primary ? 'bg-white/70 backdrop-blur-sm' : ''}`}
            style={primary ? { background: `linear-gradient(135deg, ${PRIMARY} 0%, #2c4a6a 100%)` } : {}}
          >
            {!primary && (
              <button className="float-right w-7 h-7 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors">
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${primary ? 'bg-white/15' : 'bg-white/80'}`}>
              <Icon className={`w-4 h-4 ${primary ? 'text-white' : 'text-muted-foreground'}`} />
            </div>
            <p className={`text-2xl font-black ${primary ? 'text-white' : ''}`} style={!primary ? { color: PRIMARY } : {}}>{value}</p>
            <p className={`text-xs font-medium mt-0.5 ${primary ? 'text-white/70' : 'text-muted-foreground'}`}>{label}</p>
            {!primary && (
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                <span className="text-[10px] text-emerald-600 font-medium">Increased</span>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Info grid */}
      <motion.div variants={stagger} className="grid md:grid-cols-2 gap-5">
        {/* Basic info */}
        <motion.div variants={fade} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl p-6 space-y-5 shadow-sm">
          <h3 className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Basic Information</h3>
          {[
            { label: 'Full Name', value: mockUserProfile.name, icon: null },
            { label: 'Email Address', value: mockUserProfile.email, icon: Mail },
            {
              label: 'Member Since',
              value: new Date(mockUserProfile.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
              icon: Calendar,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{label}</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-white/60 rounded-xl text-sm" style={{ color: PRIMARY }}>
                {Icon && <Icon className="w-4 h-4 text-muted-foreground shrink-0" />}
                {value}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Learning info */}
        <motion.div variants={fade} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl p-6 space-y-5 shadow-sm">
          <h3 className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Learning Profile</h3>
          {[
            { label: 'Field of Study', value: mockUserProfile.field },
            { label: 'Specialization', value: mockUserProfile.type },
          ].map(({ label, value }) => (
            <div key={label} className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{label}</label>
              <div className="px-4 py-3 bg-white/60 rounded-xl text-sm font-medium" style={{ color: PRIMARY }}>{value}</div>
            </div>
          ))}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Total Points</label>
            <div
              className="px-4 py-3 rounded-xl text-sm font-bold"
              style={{ background: ACCENT + '12', color: ACCENT, border: `1px solid ${ACCENT}25` }}
            >
              {mockUserProfile.totalPoints.toLocaleString()} pts
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Account settings */}
      <motion.div variants={fade} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Account Settings</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <button className="flex items-center justify-center gap-2 py-3 bg-white/80 hover:bg-white rounded-xl text-sm font-medium transition-all" style={{ color: PRIMARY }}>
            <Shield className="w-4 h-4" /> Change Password
          </button>
          <button className="flex items-center justify-center gap-2 py-3 bg-white/80 hover:bg-white rounded-xl text-sm font-medium transition-all" style={{ color: PRIMARY }}>
            <Download className="w-4 h-4" /> Export Data
          </button>
          <button className="flex items-center justify-center gap-2 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-colors">
            Delete Account
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
