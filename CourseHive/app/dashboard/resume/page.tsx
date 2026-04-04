'use client'

import { motion } from 'framer-motion'
import { FileText, Upload, Target, Sparkles, Lightbulb, ArrowUpRight, CheckCircle2, Download, TrendingUp } from 'lucide-react'

const PRIMARY = '#1a3d2c'

const fade = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } }
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }

const features = [
  { icon: Target, title: 'Skills Gap Analysis', desc: 'Identify exactly which skills you need to reach your career goals', color: '#4f46e5' },
  { icon: Sparkles, title: 'Smart Recommendations', desc: 'Get AI-powered course suggestions tailored to your resume', color: PRIMARY },
  { icon: Lightbulb, title: 'Career Path Insights', desc: 'Discover the best opportunities aligned with your skillset', color: '#b45309' },
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-colors"
            style={{ background: PRIMARY }}
          >
            <Upload className="w-4 h-4" /> Upload Resume
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-border hover:bg-secondary transition-colors">
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
            className={`rounded-2xl p-5 border border-border/50 ${!primary ? 'bg-card' : ''}`}
            style={primary ? { background: PRIMARY } : {}}
          >
            {!primary && (
              <button className="float-right w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
            <p className={`text-xs font-medium ${primary ? 'text-white/70' : 'text-muted-foreground'}`}>{label}</p>
            <p className={`text-3xl font-black mt-1 ${primary ? 'text-white' : ''}`}>{value}</p>
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
        className="bg-card border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer group hover:border-opacity-60 transition-colors"
        style={{ borderColor: PRIMARY + '40' }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = PRIMARY + '80')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = PRIMARY + '40')}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: PRIMARY + '15' }}
        >
          <Upload className="w-7 h-7" style={{ color: PRIMARY }} />
        </div>
        <h3 className="text-lg font-bold">Drop your resume here</h3>
        <p className="text-muted-foreground text-sm mt-1.5 max-w-xs mx-auto">
          Supports PDF and DOCX formats up to 10MB. Analyzed instantly by AI.
        </p>
        <div className="flex items-center justify-center gap-3 mt-5">
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-colors"
            style={{ background: PRIMARY }}
          >
            <Upload className="w-4 h-4" /> Upload Resume
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-secondary hover:bg-secondary/80 transition-colors">
            Browse Files
          </button>
        </div>
        <p className="text-xs text-muted-foreground/50 mt-3">PDF · DOCX · up to 10MB</p>
      </motion.div>

      {/* How it works */}
      <motion.div variants={fade} className="bg-card border border-border/50 rounded-2xl p-6">
        <h2 className="font-bold text-base mb-4">How it works</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold mt-0.5"
                style={{ background: PRIMARY }}
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
            className="bg-card border border-border/50 rounded-2xl p-5 space-y-4"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + '15' }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <h3 className="font-bold text-sm">{title}</h3>
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
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: PRIMARY }}
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
