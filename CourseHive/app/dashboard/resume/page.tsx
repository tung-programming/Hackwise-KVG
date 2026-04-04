'use client'

import { motion } from 'framer-motion'
import { FileText, Upload, Target, Sparkles, Lightbulb, ArrowUpRight, CheckCircle2, Download, TrendingUp } from 'lucide-react'

const PRIMARY = '#172b44'
const ACCENT = '#f97316'

const fade = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } }
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }

const features = [
  { icon: Target, title: 'Skills Gap Analysis', desc: 'Identify exactly which skills you need to reach your career goals', color: '#4f46e5' },
  { icon: Sparkles, title: 'Smart Recommendations', desc: 'Get AI-powered course suggestions tailored to your resume', color: ACCENT },
  { icon: Lightbulb, title: 'Career Path Insights', desc: 'Discover the best opportunities aligned with your skillset', color: PRIMARY },
]

const steps = [
  'Upload your PDF or DOCX resume',
  'Our AI analyzes your skills and experience',
  'Receive a detailed skills gap report',
  'Get personalized course recommendations',
]

export default function ResumePage() {
  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6">

      {/* Header */}
      <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Resume Analysis</h1>
          <p className="text-muted-foreground text-sm mt-1">Get AI-powered insights and identify skill gaps instantly</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:shadow-lg hover:-translate-y-0.5 transition-all"
            style={{ background: ACCENT, boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)' }}
          >
            <Upload className="w-4 h-4" /> Upload Resume
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/70 border border-border/50 hover:bg-white transition-all backdrop-blur-sm">
            <Download className="w-4 h-4" /> Sample Report
          </button>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={stagger} className="grid grid-cols-3 gap-4">
        {[
          { label: 'Analyses Done', value: '0', primary: true },
          { label: 'Skills Identified', value: '0', primary: false },
          { label: 'Gaps Found', value: '0', primary: false },
        ].map(({ label, value, primary }) => (
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
            <p className={`text-xs font-medium ${primary ? 'text-white/70' : 'text-muted-foreground'}`}>{label}</p>
            <p className={`text-3xl font-black mt-1 ${primary ? 'text-white' : ''}`} style={!primary ? { color: PRIMARY } : {}}>{value}</p>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className={`w-3 h-3 ${primary ? 'text-white/60' : 'text-muted-foreground/60'}`} />
              <span className={`text-[10px] font-medium ${primary ? 'text-white/60' : 'text-muted-foreground/60'}`}>
                Upload to get started
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Upload area */}
      <motion.div
        variants={fade}
        className="bg-white/70 backdrop-blur-sm border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer group hover:border-opacity-60 transition-all shadow-sm"
        style={{ borderColor: ACCENT + '40' }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = ACCENT + '80')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = ACCENT + '40')}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: ACCENT + '15' }}
        >
          <Upload className="w-7 h-7" style={{ color: ACCENT }} />
        </div>
        <h3 className="text-lg font-bold" style={{ color: PRIMARY }}>Drop your resume here</h3>
        <p className="text-muted-foreground text-sm mt-1.5 max-w-xs mx-auto">
          Supports PDF and DOCX formats up to 10MB. Analyzed instantly by AI.
        </p>
        <div className="flex items-center justify-center gap-3 mt-5">
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:shadow-lg hover:-translate-y-0.5 transition-all"
            style={{ background: ACCENT, boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)' }}
          >
            <Upload className="w-4 h-4" /> Upload Resume
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/80 hover:bg-white transition-all">
            Browse Files
          </button>
        </div>
        <p className="text-xs text-muted-foreground/50 mt-3">PDF · DOCX · up to 10MB</p>
      </motion.div>

      {/* How it works */}
      <motion.div variants={fade} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-base mb-4" style={{ color: PRIMARY }}>How it works</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold mt-0.5"
                style={{ background: ACCENT }}
              >
                {i + 1}
              </div>
              <p className="text-sm text-muted-foreground leading-snug">{step}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Feature cards */}
      <motion.div variants={stagger} className="grid md:grid-cols-3 gap-4">
        {features.map(({ icon: Icon, title, desc, color }) => (
          <motion.div
            key={title}
            variants={fade}
            whileHover={{ y: -2, transition: { duration: 0.18 } }}
            className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + '15' }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ color: PRIMARY }}>{title}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
            </div>
            <button className="flex items-center gap-1 text-xs font-semibold hover:underline" style={{ color }}>
              Learn more <ArrowUpRight className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* What you'll get */}
      <motion.div
        variants={fade}
        className="rounded-2xl p-6 text-white relative overflow-hidden shadow-lg"
        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #2c4a6a 100%)` }}
      >
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/8" />
        <div className="relative z-10">
          <h2 className="text-base font-bold mb-4">What you&apos;ll receive</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              'Detailed skills assessment report',
              'Personalized learning roadmap',
              'Top 10 recommended courses',
              'Career opportunity matching',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-white/60 shrink-0" />
                <span className="text-white/80 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
