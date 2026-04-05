'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Upload, Download, ArrowUpRight, CheckCircle2, History, MoreHorizontal, FileCheck, Sparkles, AlertCircle, Loader2, X } from 'lucide-react'
import { authFetch } from '@/lib/auth'

const PRIMARY = '#172b44'
const ACCENT = '#f97316'

const fade = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } }
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }

interface AnalysisResult {
  id: string
  file_name: string
  file_url: string
  ats_score: number
  feedback: {
    overall: string
    sections: { name: string; score: number; feedback: string }[]
    strengths: string[]
    improvements: string[]
    missingKeywords: string[]
  }
  suggestions: string[]
  status: string
  analyzed_at: string
  created_at: string
}

export default function ResumePage() {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const hasCompletedAnalysis = analysis?.status === 'completed'

  // Fetch existing analysis on mount
  useEffect(() => {
    fetchExistingAnalysis()
  }, [])

  const fetchExistingAnalysis = async () => {
    try {
      const res = await authFetch('/api/resume-analysis')
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.data) {
          setAnalysis(data.data)
        }
      }
    } catch (err) {
      // No existing analysis, that's fine
    }
  }

  const handleFileSelect = (file: File) => {
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or image file (PNG, JPEG, WebP)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }
    setSelectedFile(file)
    setError(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select a file first')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('resume', selectedFile)

      const res = await authFetch('/api/resume-analysis/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setAnalysis(data.data)
        setSelectedFile(null)
      } else {
        setAnalysis(null)
        setError(data.message || 'Failed to analyze resume')
      }
    } catch (err: any) {
      setAnalysis(null)
      setError(err.message || 'Failed to upload resume')
    } finally {
      setIsUploading(false)
    }
  }

  const stats = analysis ? [
    { label: 'ATS Score', value: hasCompletedAnalysis ? `${analysis.ats_score}%` : '--' },
    { label: 'Suggestions', value: hasCompletedAnalysis ? (analysis.suggestions?.length?.toString() || '0') : '--' },
    { label: 'Status', value: hasCompletedAnalysis ? 'Analyzed' : (analysis.status || 'Processing') },
  ] : [
    { label: 'ATS Score', value: '--' },
    { label: 'Suggestions', value: '--' },
    { label: 'Status', value: 'No Resume' },
  ]

  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6">

      {/* Header */}
      <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#172b44]">Resume Analysis</h1>
          <p className="text-muted-foreground text-sm mt-1">Upload your resume to get AI-powered career insights</p>
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
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileInput}
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`w-full h-full min-h-[360px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-10 text-center transition-all duration-300 cursor-pointer ${
              isDragging ? 'border-[#f97316] bg-[#f97316]/5 scale-[0.99]' : 'border-slate-200 hover:border-[#f97316]/50 hover:bg-slate-50/50'
            }`}
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white shadow-sm border border-slate-100 mb-6 relative group">
              <div className="absolute inset-0 rounded-full bg-[#f97316]/10 scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" />
              <Upload className="w-8 h-8 text-[#f97316] relative z-10" />
            </div>

            {selectedFile ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-[#f97316]" />
                  <span className="text-sm font-medium text-[#172b44]">{selectedFile.name}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null) }}
                    className="p-1 hover:bg-slate-100 rounded-full"
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
                <p className="text-muted-foreground text-sm mb-6">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-[#172b44] mb-2">
                  {isDragging ? 'Drop it here!' : 'Click to upload or drag and drop'}
                </h3>
                <p className="text-muted-foreground text-sm max-w-[280px] leading-relaxed mb-8">
                  We support PDF and image files (PNG, JPEG, WebP) up to 10MB. Our AI will instantly analyze your resume.
                </p>
              </>
            )}

            {error && (
              <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <button 
              onClick={(e) => { e.stopPropagation(); handleAnalyze() }}
              disabled={!selectedFile || isUploading}
              className="flex items-center gap-2 bg-[#f97316] hover:bg-[#ea6c0a] text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-[#f97316]/30 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Analyze Resume
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Results Panel */}
        <motion.div variants={fade} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-[28px] p-6 shadow-sm flex flex-col min-h-[360px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-[#172b44] flex items-center gap-2">
              <History className="w-4 h-4 text-[#f97316]" /> Analysis Results
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {analysis && hasCompletedAnalysis ? (
              <>
                {/* Score Badge */}
                <div className={`p-4 rounded-2xl text-center ${
                  analysis.ats_score >= 80 ? 'bg-emerald-50' : analysis.ats_score >= 60 ? 'bg-yellow-50' : 'bg-rose-50'
                }`}>
                  <p className="text-xs font-medium text-muted-foreground mb-1">ATS Score</p>
                  <p className={`text-4xl font-black ${
                    analysis.ats_score >= 80 ? 'text-emerald-600' : analysis.ats_score >= 60 ? 'text-yellow-600' : 'text-rose-600'
                  }`}>
                    {analysis.ats_score}%
                  </p>
                </div>

                {/* Suggestions */}
                {analysis.suggestions && analysis.suggestions.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-bold text-[#172b44] mb-2">Suggestions</h4>
                    <ul className="space-y-2">
                      {analysis.suggestions.slice(0, 5).map((suggestion, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#f97316] mt-0.5 shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Strengths */}
                {analysis.feedback?.strengths && analysis.feedback.strengths.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-bold text-emerald-600 mb-2">Strengths</h4>
                    <ul className="space-y-1">
                      {analysis.feedback.strengths.slice(0, 3).map((s, i) => (
                        <li key={i} className="text-xs text-muted-foreground">✓ {s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {analysis.feedback?.improvements && analysis.feedback.improvements.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-bold text-amber-600 mb-2">Areas to Improve</h4>
                    <ul className="space-y-1">
                      {analysis.feedback.improvements.slice(0, 3).map((s, i) => (
                        <li key={i} className="text-xs text-muted-foreground">• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <FileText className="w-12 h-12 text-slate-200 mb-4" />
                <p className="text-sm text-muted-foreground">
                  Upload a resume to see analysis results
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

    </motion.div>
  )
}
