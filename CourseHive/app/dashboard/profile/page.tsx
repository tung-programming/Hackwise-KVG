'use client'

import { motion } from 'framer-motion'
import { Mail, BookOpen, Award, Calendar, Trophy, Edit3, Download, Shield, TrendingUp, ArrowUpRight } from 'lucide-react'
import { mockUserProfile } from '@/lib/mock-data'

const PRIMARY = '#1a3d2c'

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
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-colors"
            style={{ background: PRIMARY }}
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-border hover:bg-secondary transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </motion.div>

      {/* Profile card */}
      <motion.div variants={fade} className="bg-card border border-border/50 rounded-2xl overflow-hidden">
        {/* Cover strip */}
        <div className="h-24" style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #2d6a4f 100%)` }} />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div
              className="w-20 h-20 rounded-2xl border-4 border-card flex items-center justify-center text-xl font-black text-white"
              style={{ background: PRIMARY }}
            >
              JS
            </div>
            <button className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors hover:bg-secondary" style={{ borderColor: PRIMARY, color: PRIMARY }}>
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>
          <h2 className="text-xl font-bold">{mockUserProfile.name}</h2>
          <p className="text-muted-foreground text-sm mt-0.5">{mockUserProfile.field} · {mockUserProfile.type}</p>
        </div>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={stagger} className="grid grid-cols-3 gap-4">
        {statCards.map(({ icon: Icon, label, value, primary }) => (
          <motion.div
            key={label}
            variants={fade}
            className={`rounded-2xl p-5 border border-border/50 ${!primary ? 'bg-card' : ''}`}
            style={primary ? { background: PRIMARY } : {}}
          >
            {!primary && (
              <button className="float-right w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${primary ? 'bg-white/15' : 'bg-secondary'}`}>
              <Icon className={`w-4 h-4 ${primary ? 'text-white' : 'text-muted-foreground'}`} />
            </div>
            <p className={`text-2xl font-black ${primary ? 'text-white' : ''}`}>{value}</p>
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
        <motion.div variants={fade} className="bg-card border border-border/50 rounded-2xl p-6 space-y-5">
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
              <div className="flex items-center gap-3 px-4 py-3 bg-secondary/50 rounded-xl text-sm">
                {Icon && <Icon className="w-4 h-4 text-muted-foreground shrink-0" />}
                {value}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Learning info */}
        <motion.div variants={fade} className="bg-card border border-border/50 rounded-2xl p-6 space-y-5">
          <h3 className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Learning Profile</h3>
          {[
            { label: 'Field of Study', value: mockUserProfile.field },
            { label: 'Specialization', value: mockUserProfile.type },
          ].map(({ label, value }) => (
            <div key={label} className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{label}</label>
              <div className="px-4 py-3 bg-secondary/50 rounded-xl text-sm font-medium">{value}</div>
            </div>
          ))}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Total Points</label>
            <div
              className="px-4 py-3 rounded-xl text-sm font-bold"
              style={{ background: PRIMARY + '12', color: PRIMARY, border: `1px solid ${PRIMARY}25` }}
            >
              {mockUserProfile.totalPoints.toLocaleString()} pts
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Account settings */}
      <motion.div variants={fade} className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
        <h3 className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Account Settings</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <button className="flex items-center justify-center gap-2 py-3 bg-secondary hover:bg-secondary/80 rounded-xl text-sm font-medium transition-colors">
            <Shield className="w-4 h-4" /> Change Password
          </button>
          <button className="flex items-center justify-center gap-2 py-3 bg-secondary hover:bg-secondary/80 rounded-xl text-sm font-medium transition-colors">
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
