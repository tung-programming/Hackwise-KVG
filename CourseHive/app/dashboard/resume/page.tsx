'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Upload, Download, ArrowUpRight, CheckCircle2, History, MoreHorizontal, FileCheck, Sparkles, AlertCircle } from 'lucide-react'

const PRIMARY = '#172b44'
const ACCENT = '#f97316'

const fade = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } }
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }

export default function ResumePage() {
  const [isDragging, setIsDragging] = useState(false)

  const stats = [
    { label: 'Analyses Conducted', value: '12' },
    { label: 'Avg. Match Score', value: '84%' },
    { label: 'Skill Gaps Found', value: '3' },
  ]

  const history = [
    { id: 1, name: 'Software_Engineer_Resume_v4.pdf', date: 'Oct 24, 2023', score: 92, status: 'Analyzed' },
    { id: 2, name: 'Resume_Updated_Q3.docx', date: 'Sep 12, 2023', score: 78, status: 'Analyzed' },
    { id: 3, name: 'Old_Tech_Resume.pdf', date: 'Jul 05, 2023', score: 45, status: 'Needs Update' },
  ]

  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6">

      {/* Header */}
      <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#172b44]">Resume Analysis</h1>
          <p className="text-muted-foreground text-sm mt-1">Upload your resume to get AI-powered career insights</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border border-border hover:bg-secondary transition-colors text-[#172b44]">
            <Download className="w-4 h-4" /> Download Template
          </button>
        </div>
      </motion.div>

      {/* Stat strip (consistent with other pages) */}
      <motion.div variants={stagger} className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value }, i) => (
          <motion.div
            key={label}
            variants={fade}
            className={`rounded-2xl p-5 border border-white/50 shadow-sm ${i === 0 ? 'text-white' : 'bg-white/70 backdrop-blur-sm'}`}
            style={i === 0 ? { background: `linear-gradient(135deg, ${PRIMARY} 0%, #2c4a6a 100%)` } : {}}
          >
            {i !== 0 && (
              <button className="float-right w-7 h-7 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors">
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
            <p className={`text-xs font-medium ${i === 0 ? 'text-white/70' : 'text-muted-foreground'}`}>{label}</p>
            <p className={`text-3xl font-black mt-1 ${i === 0 ? 'text-white' : ''}`} style={i !== 0 ? { color: PRIMARY } : {}}>{value}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload Dropzone */}
        <motion.div 
          variants={fade} 
          className="lg:col-span-2 bg-white/70 backdrop-blur-sm border border-white/50 rounded-[28px] p-2 shadow-sm"
        >
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false) }}
            className={`w-full h-full min-h-[360px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-10 text-center transition-all duration-300 ${
              isDragging ? 'border-[#f97316] bg-[#f97316]/5 scale-[0.99]' : 'border-slate-200 hover:border-[#f97316]/50 hover:bg-slate-50/50'
            }`}
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white shadow-sm border border-slate-100 mb-6 relative group">
              <div className="absolute inset-0 rounded-full bg-[#f97316]/10 scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" />
              <Upload className="w-8 h-8 text-[#f97316] relative z-10" />
            </div>

            <h3 className="text-xl font-bold text-[#172b44] mb-2">
              {isDragging ? 'Drop it here!' : 'Click to upload or drag and drop'}
            </h3>
            <p className="text-muted-foreground text-sm max-w-[280px] leading-relaxed mb-8">
              We support PDF and DOCX files up to 10MB. Our AI will instantly analyze your profile.
            </p>

            <button className="flex items-center gap-2 bg-[#f97316] hover:bg-[#ea6c0a] text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-[#f97316]/30 transition-all hover:-translate-y-0.5 active:scale-95">
              <Sparkles className="w-4 h-4" /> Analyze Resume
            </button>
          </div>
        </motion.div>

        {/* History Panel */}
        <motion.div variants={fade} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-[28px] p-6 shadow-sm flex flex-col min-h-[360px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-[#172b44] flex items-center gap-2">
              <History className="w-4 h-4 text-[#f97316]" /> Analyze History
            </h2>
            <button className="text-xs font-bold text-[#f97316] hover:underline">View All</button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {history.map((doc) => (
              <div key={doc.id} className="group p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md hover:border-slate-200 transition-all cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    doc.score >= 80 ? 'bg-emerald-50 text-emerald-600' : doc.score >= 60 ? 'bg-yellow-50 text-yellow-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {doc.score >= 80 ? <CheckCircle2 className="w-5 h-5" /> : doc.score >= 60 ? <AlertCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[#172b44] truncate">{doc.name}</h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{doc.date}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className={`font-semibold ${
                        doc.score >= 80 ? 'text-emerald-600' : doc.score >= 60 ? 'text-yellow-600' : 'text-rose-600'
                      }`}>
                        {doc.score}% Match
                      </span>
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-[#172b44] hover:bg-slate-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </motion.div>
  )
}
