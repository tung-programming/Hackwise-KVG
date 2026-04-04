'use client'

import React from 'react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Hexagon, Menu, X, ArrowRight, Target, Brain, Trophy } from 'lucide-react'

// Fixed particle positions — no Math.random() to avoid hydration mismatch
const particles = [
  { x: 5,  y: 10, size: 3, dur: 3.2, delay: 0 },
  { x: 15, y: 25, size: 2, dur: 4.1, delay: 0.4 },
  { x: 25, y: 8,  size: 4, dur: 3.7, delay: 0.8 },
  { x: 35, y: 18, size: 2, dur: 4.5, delay: 1.2 },
  { x: 45, y: 35, size: 3, dur: 3.0, delay: 0.6 },
  { x: 55, y: 12, size: 2, dur: 4.8, delay: 1.5 },
  { x: 65, y: 28, size: 4, dur: 3.5, delay: 0.2 },
  { x: 75, y: 5,  size: 3, dur: 4.2, delay: 0.9 },
  { x: 85, y: 20, size: 2, dur: 3.9, delay: 1.1 },
  { x: 92, y: 15, size: 3, dur: 4.6, delay: 0.3 },
  { x: 10, y: 45, size: 2, dur: 3.3, delay: 0.7 },
  { x: 30, y: 50, size: 3, dur: 4.0, delay: 1.3 },
  { x: 50, y: 42, size: 2, dur: 3.6, delay: 0.5 },
  { x: 70, y: 48, size: 4, dur: 4.3, delay: 1.0 },
  { x: 88, y: 38, size: 2, dur: 3.8, delay: 1.6 },
]

// Fluffy cloud SVG
function Cloud({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 320 100" className={className} style={style} xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <circle cx="80"  cy="72" r="52" />
      <circle cx="140" cy="58" r="58" />
      <circle cx="205" cy="68" r="48" />
      <circle cx="252" cy="76" r="42" />
      <rect   x="38"  y="72" width="256" height="28" />
    </svg>
  )
}


const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' } },
}

const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.25 } },
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/*  HERO  — sky gradient, clouds, Helio aesthetic           */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#a8c8e8 0%,#c0d9f0 14%,#d8edf8 30%,#edf5fb 48%,#f3e9da 72%,#ecdcc8 100%)' }}
      >
        {/* Floating dust particles */}
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/60 pointer-events-none"
            style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
            animate={{ opacity: [0.25, 0.75, 0.25], y: [0, -12, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}

        {/* ── Navbar ── */}
        <nav className="relative z-50 px-6 lg:px-14 py-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#172b44] rounded-xl flex items-center justify-center shadow-md">
                <Hexagon className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-[#172b44] text-lg tracking-tight">CourseHive</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-9">
<a href="#features"  className="text-sm font-medium text-[#2c4a6a] hover:text-[#172b44] transition-colors">Features</a>
              <a href="#learners"  className="text-sm font-medium text-[#2c4a6a] hover:text-[#172b44] transition-colors">Learners</a>
              <Link href="/login"  className="text-sm font-medium text-[#2c4a6a] hover:text-[#172b44] transition-colors">Sign In</Link>
            </div>

            {/* CTA */}
            <div className="hidden md:block">
              <Link href="/onboarding/field">
                <button className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea6c0a] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md shadow-orange-300/40 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                  Get Started
                  <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </Link>
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-[#172b44]">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-4"
            >
              <a href="#features" className="block text-sm font-medium text-[#172b44] py-1">Features</a>
              <a href="#learners" className="block text-sm font-medium text-[#172b44] py-1">Learners</a>
              <Link href="/login" className="block text-sm font-medium text-[#172b44] py-1">Sign In</Link>
              <Link href="/onboarding/field">
                <button className="w-full mt-2 bg-[#f97316] text-white text-sm font-semibold py-3 rounded-full">
                  Get Started
                </button>
              </Link>
            </motion.div>
          )}
        </nav>

        {/* ── Side clouds LEFT — 2 puffs, well separated, varied inset ── */}
        <div className="absolute left-0 top-0 bottom-0 hidden xl:block pointer-events-none z-0" style={{ width: '320px' }}>
          {/* Puff A — upper, pulled well in */}
          <motion.div
            className="absolute"
            style={{ top: '9%', left: '-4px' }}
            animate={{ x: [0, 12, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
          >
            <div style={{ filter: 'blur(16px)', opacity: 0.42 }}>
              <Cloud style={{ width: 350, height: 'auto', color: '#ffffff' }} />
            </div>
            <div className="absolute inset-0" style={{ filter: 'blur(4px)', opacity: 0.70, transform: 'translateX(12px) translateY(5px)' }}>
              <Cloud style={{ width: 280, height: 'auto', color: '#ffffff' }} />
            </div>
          </motion.div>

          {/* Puff B — lower third, mostly hidden behind edge */}
          <motion.div
            className="absolute"
            style={{ top: '64%', left: '-38px' }}
            animate={{ x: [0, 9, 0] }}
            transition={{ duration: 12.5, repeat: Infinity, ease: 'easeInOut', delay: 3.2 }}
          >
            <div style={{ filter: 'blur(18px)', opacity: 0.40 }}>
              <Cloud style={{ width: 380, height: 'auto', color: '#f5e8d8' }} />
            </div>
            <div className="absolute inset-0" style={{ filter: 'blur(4.5px)', opacity: 0.65, transform: 'translateX(8px) translateY(6px)' }}>
              <Cloud style={{ width: 310, height: 'auto', color: '#f5e8d8' }} />
            </div>
          </motion.div>
        </div>

        {/* ── Side clouds RIGHT — 2 puffs, offset differently to avoid symmetry ── */}
        <div className="absolute right-0 top-0 bottom-0 hidden xl:block pointer-events-none z-0" style={{ width: '320px' }}>
          {/* Puff C — middle height, mostly behind edge */}
          <motion.div
            className="absolute"
            style={{ top: '32%', right: '-42px' }}
            animate={{ x: [0, -11, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          >
            <div style={{ filter: 'blur(16px)', opacity: 0.44 }}>
              <Cloud style={{ width: 370, height: 'auto', color: '#ffffff' }} />
            </div>
            <div className="absolute inset-0" style={{ filter: 'blur(4px)', opacity: 0.68, transform: 'translateX(-10px) translateY(5px)' }}>
              <Cloud style={{ width: 300, height: 'auto', color: '#ffffff' }} />
            </div>
          </motion.div>

          {/* Puff D — near bottom, pulled well in, warm tone */}
          <motion.div
            className="absolute"
            style={{ top: '74%', right: '-8px' }}
            animate={{ x: [0, -8, 0] }}
            transition={{ duration: 9.5, repeat: Infinity, ease: 'easeInOut', delay: 4.5 }}
          >
            <div style={{ filter: 'blur(15px)', opacity: 0.46 }}>
              <Cloud style={{ width: 340, height: 'auto', color: '#f0ddc8' }} />
            </div>
            <div className="absolute inset-0" style={{ filter: 'blur(3.5px)', opacity: 0.72, transform: 'translateX(-7px) translateY(4px)' }}>
              <Cloud style={{ width: 270, height: 'auto', color: '#f0ddc8' }} />
            </div>
          </motion.div>
        </div>

        {/* ── Hero content ── */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-10 pb-52">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-5xl mx-auto space-y-7 relative z-10">

            {/* Avatar stack + social proof — eClaster style */}
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-3">
              <div className="flex -space-x-2.5">
                {[
                  { init: 'AS', from: '#818cf8', to: '#6366f1' },
                  { init: 'MK', from: '#34d399', to: '#059669' },
                  { init: 'RJ', from: '#fb923c', to: '#ea580c' },
                  { init: 'NP', from: '#60a5fa', to: '#2563eb' },
                  { init: 'SL', from: '#a78bfa', to: '#7c3aed' },
                ].map((a, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-sm"
                    style={{ background: `linear-gradient(135deg,${a.from},${a.to})`, zIndex: 5 - i }}
                  >
                    {a.init}
                  </div>
                ))}
              </div>
              <span className="text-sm font-semibold text-[#172b44] bg-white/65 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/50 shadow-sm">
                50k+ learners growing daily
              </span>
            </motion.div>

            {/* Badge */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 bg-white/65 backdrop-blur-sm text-[#172b44] text-xs font-semibold px-4 py-2 rounded-full border border-white/50 shadow-sm">
                <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full animate-pulse" />
                AI-Powered Learning Platform
              </span>
            </motion.div>

            {/* Heading — large & dramatic */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-[5.2rem] font-extrabold text-[#172b44] leading-[1.05] tracking-tight"
            >
              All the Knowledge
              <br />
              <span className="text-[#f97316]">Under the Sun</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-xl text-[#3d5f80] max-w-2xl mx-auto leading-relaxed"
            >
              CourseHive connects personalized AI learning with real-world project building.
              Master any field, track your growth, and land your dream role.
            </motion.p>

            {/* Email + CTA — eClaster inline style */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-5 py-4 rounded-full bg-white/70 backdrop-blur-sm border border-white/60 text-[#172b44] placeholder-[#8aaac8] text-sm outline-none focus:bg-white/90 transition-all shadow-sm"
              />
              <Link href="/onboarding/field">
                <button className="inline-flex items-center justify-center gap-2 bg-[#f97316] hover:bg-[#ea6c0a] text-white text-sm font-semibold px-6 py-4 rounded-full shadow-lg shadow-orange-300/50 transition-all hover:-translate-y-0.5 hover:shadow-xl whitespace-nowrap w-full sm:w-auto">
                  Get started <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp}>
              <a href="#features" className="text-sm text-[#3d5f80] hover:text-[#172b44] transition-colors underline underline-offset-4">
                Explore all features
              </a>
            </motion.div>

            {/* ── Bento preview cards — eClaster style ── */}
            <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">

              {/* Card 1: AI Roadmaps */}
              <div className="bg-white/72 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <h4 className="font-bold text-[#172b44] text-base mb-2">AI Roadmaps</h4>
                <p className="text-xs text-[#3d5f80] leading-relaxed mb-5">Structured paths guiding you step by step — beginner to expert — tailored by AI to your goals.</p>
                {/* Mini roadmap node chain */}
                <div className="flex items-center gap-1.5 mb-4">
                  {['#f97316','#2563eb','#7c3aed','#059669'].map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full border-2 border-white shadow flex items-center justify-center" style={{ background: c }}>
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      {i < 3 && <div className="h-px w-4 bg-[#172b44]/20" />}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['Beginner','Advanced','Expert'].map((tag) => (
                    <span key={tag} className="text-[10px] font-semibold bg-[#172b44]/10 text-[#172b44] px-2.5 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Card 2: Leaderboard — dark card */}
              <div className="bg-[#172b44] rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-[#f97316] bg-[#f97316]/20 px-2.5 py-1 rounded-full tracking-wide">LIVE</span>
                </div>
                <h4 className="font-bold text-white text-base mb-4">Leaderboard</h4>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: 'Sophia L.', xp: '2,840 XP', color: '#f59e0b' },
                    { rank: 2, name: 'Marcus K.', xp: '2,310 XP', color: '#94a3b8' },
                    { rank: 3, name: 'Riya J.',   xp: '1,980 XP', color: '#cd7c2a' },
                  ].map((u) => (
                    <div key={u.rank} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-extrabold w-4" style={{ color: u.color }}>#{u.rank}</span>
                        <span className="text-white text-xs font-medium">{u.name}</span>
                      </div>
                      <span className="text-[10px] text-blue-300 font-semibold">{u.xp}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
                  <span className="text-[10px] text-white/50 flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></span>
                </div>
              </div>

              {/* Card 3: Resume ATS */}
              <div className="rounded-3xl p-6 border border-white/60 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'linear-gradient(135deg,#eef4ff 0%,#f3eeff 100%)' }}>
                <div className="mb-3">
                  <span className="text-[10px] font-bold text-[#2563eb] bg-[#2563eb]/15 px-2.5 py-1 rounded-full">Resume ATS</span>
                </div>
                <h4 className="font-bold text-[#172b44] text-base mb-2">Score your resume</h4>
                <p className="text-xs text-[#3d5f80] leading-relaxed mb-5">AI-powered ATS analysis tells you exactly how to improve your resume for any role.</p>
                {/* Circular score gauge */}
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 shrink-0">
                    <svg viewBox="0 0 48 48" className="w-14 h-14 -rotate-90">
                      <circle cx="24" cy="24" r="20" fill="none" stroke="#e0e7ff" strokeWidth="5" />
                      <circle cx="24" cy="24" r="20" fill="none" stroke="#7c3aed" strokeWidth="5"
                        strokeDasharray={`${Math.PI * 40 * 0.87} ${Math.PI * 40}`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-[#7c3aed]">87</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#172b44]">ATS Score</div>
                    <div className="text-xs text-[#3d5f80]">Top 13% of resumes</div>
                  </div>
                </div>
              </div>

            </motion.div>
          </motion.div>
        </div>

        {/* Cloud bank at bottom — 5 clouds, randomized */}
        <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none overflow-hidden">
          <Cloud style={{ position:'absolute', width:440, height:'auto', bottom:-28, left:'-4%',  color:'#efe3d0', opacity:0.88 }} />
          <Cloud style={{ position:'absolute', width:500, height:'auto', bottom: 12, left:'18%',  color:'#f5e8d8', opacity:0.72 }} />
          <Cloud style={{ position:'absolute', width:460, height:'auto', bottom:-18, left:'40%',  color:'#ecdcc8', opacity:0.95 }} />
          <Cloud style={{ position:'absolute', width:520, height:'auto', bottom:  8, left:'59%',  color:'#f3e9da', opacity:0.68 }} />
          <Cloud style={{ position:'absolute', width:400, height:'auto', bottom:-22, right:'-3%', color:'#ecdcc8', opacity:0.82 }} />
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/*  LEARNERS — premium dark testimonial section             */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="learners"
        className="relative py-28 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#07121f 0%,#0c1e36 50%,#091628 100%)' }}
      >
        {/* Ambient glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-125 h-125 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(37,99,235,0.10) 0%,transparent 70%)', transform: 'translate(-50%,-50%)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-100 h-100 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(249,115,22,0.07) 0%,transparent 70%)' }} />
        <div className="absolute top-2/3 left-1/2 w-87.5 h-87.5 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(124,58,237,0.07) 0%,transparent 70%)', transform: 'translateX(-50%)' }} />

        <div className="relative z-10 max-w-6xl mx-auto">

          {/* ── Section header ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16 space-y-6"
          >
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-10 bg-white/20" />
              <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#f97316]">Learner Stories</span>
              <div className="h-px w-10 bg-white/20" />
            </div>

            {/* Headline — mixed weight */}
            <h2 className="text-5xl sm:text-6xl lg:text-[4.2rem] font-extrabold leading-[1.07] tracking-tight">
              <span className="text-white">What learners say</span>
              <br />
              <span className="text-white font-light italic">about </span>
              <span className="text-[#f97316]">CourseHive</span>
            </h2>

            {/* Aggregate star row */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-1">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-4 h-4 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-white font-bold text-sm">4.9</span>
                <span className="text-white/40 text-sm">/5</span>
              </div>
              <div className="w-px h-4 bg-white/15 hidden sm:block" />
              <span className="text-white/50 text-sm">from 12,400+ reviews</span>
              <div className="w-px h-4 bg-white/15 hidden sm:block" />
              <span className="text-white/50 text-sm">95% would recommend</span>
            </div>
          </motion.div>

          {/* ── Testimonial cards grid ── */}
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {[
              {
                quote: "The AI roadmaps saved me months of guesswork. I knew exactly what to learn and in what order. Landed my first dev role in 5 months.",
                name: 'Marcus K.',
                role: 'Frontend Developer',
                field: 'Web Development',
                init: 'MK',
                from: '#34d399', to: '#059669',
                stars: 5,
              },
              {
                quote: "I've tried every learning platform out there. CourseHive is the only one where I actually finished what I started — the gamification is genius.",
                name: 'Priya S.',
                role: 'Product Manager',
                field: 'Product & Strategy',
                init: 'PS',
                from: '#818cf8', to: '#6366f1',
                stars: 5,
              },
              {
                quote: "Resume ATS scoring helped me rewrite my CV and double my interview callbacks. Worth it for that feature alone.",
                name: 'James O.',
                role: 'Data Analyst',
                field: 'Data & Analytics',
                init: 'JO',
                from: '#fb923c', to: '#ea580c',
                stars: 5,
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.65 }}
                className="group relative rounded-2xl p-7 border transition-all duration-300 cursor-default"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderColor: 'rgba(255,255,255,0.07)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.055)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'
                }}
              >
                {/* Decorative quote glyph */}
                <div className="absolute top-5 right-6 text-6xl font-serif leading-none text-white/5 select-none">"</div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <svg key={s} className="w-3.5 h-3.5 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-white/75 text-sm leading-[1.75] mb-7 font-light">"{t.quote}"</p>

                {/* Divider */}
                <div className="h-px bg-white/8 mb-5" />

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white text-[11px] font-bold"
                    style={{ background: `linear-gradient(135deg,${t.from},${t.to})` }}>
                    {t.init}
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{t.name}</div>
                    <div className="text-white/40 text-xs mt-0.5">{t.role} · {t.field}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Featured wide testimonial ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="relative rounded-2xl p-8 sm:p-10 border overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.09)' }}
          >
            {/* Subtle gradient accent bar */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.6) 40%, rgba(37,99,235,0.5) 70%, transparent 100%)' }} />

            {/* Large decorative quote */}
            <div className="absolute -top-2 right-8 text-[9rem] font-serif leading-none text-white/4 select-none pointer-events-none">"</div>

            <div className="grid sm:grid-cols-[1fr_auto] gap-8 items-center">
              <div className="space-y-5">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-4 h-4 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-white/85 text-lg sm:text-xl leading-relaxed font-light">
                  "The AI-generated roadmaps are incredibly well-structured. I went from knowing nothing about ML to landing a new role in just 4 months. CourseHive understood my pace and kept me motivated every single step of the way."
                </p>
                <div className="flex items-center gap-4 pt-1">
                  <div className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg,#a78bfa,#7c3aed)' }}>
                    SL
                  </div>
                  <div>
                    <div className="text-white font-semibold">Sophia L.</div>
                    <div className="text-white/45 text-sm">Software Engineer · Upskilled in Machine Learning</div>
                  </div>
                </div>
              </div>

              {/* CTA side */}
              <div className="shrink-0 flex flex-col items-center sm:items-end gap-4 sm:pl-8 sm:border-l sm:border-white/8">
                <p className="text-white/50 text-sm text-center sm:text-right max-w-40 leading-relaxed">
                  Join 50,000+ learners transforming their careers
                </p>
                <Link href="/onboarding/field">
                  <button className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea6c0a] text-white text-sm font-semibold px-6 py-3.5 rounded-full shadow-lg shadow-orange-900/40 transition-all hover:-translate-y-0.5 whitespace-nowrap">
                    Start for free <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/*  STATS — warm amber gradient, staggered floating cards   */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="relative py-44 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#f8e4c0 0%,#f5c96a 28%,#eca84a 60%,#e08c28 100%)' }}
      >
        {/* ── Clouds at the very top edge ── */}
        <div className="absolute top-0 left-0 right-0 flex justify-around -translate-y-[55%] pointer-events-none">
          <Cloud className="w-52 h-auto text-[#f8e4c0]" />
          <Cloud className="w-68 h-auto text-[#f8e4c0]" />
          <Cloud className="w-44 h-auto text-[#f8e4c0]" />
          <Cloud className="w-60 h-auto text-[#f8e4c0]" />
        </div>

        {/* ── Drifting warm orbs ── */}
        {[
          { left: '8%',  top: '18%', w: 340, h: 260, xD:  28, yD:  18, dur: 13, delay: 0,   color: 'rgba(255,210,80,0.18)'  },
          { left: '68%', top: '10%', w: 280, h: 220, xD: -22, yD:  26, dur: 16, delay: 2.5, color: 'rgba(255,140,40,0.14)'  },
          { left: '42%', top: '72%', w: 380, h: 280, xD:  20, yD: -18, dur: 19, delay: 5,   color: 'rgba(255,190,60,0.12)'  },
          { left: '82%', top: '55%', w: 220, h: 180, xD: -26, yD: -22, dur: 14, delay: 3.5, color: 'rgba(255,120,30,0.11)'  },
          { left: '22%', top: '60%', w: 260, h: 200, xD:  16, yD:  24, dur: 17, delay: 1.2, color: 'rgba(255,230,100,0.10)' },
        ].map((o, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{ left: o.left, top: o.top, width: o.w, height: o.h,
              background: `radial-gradient(ellipse, ${o.color} 0%, transparent 70%)`,
              filter: 'blur(28px)',
            }}
            animate={{ x: [0, o.xD, 0], y: [0, o.yD, 0] }}
            transition={{ duration: o.dur, repeat: Infinity, ease: 'easeInOut', delay: o.delay }}
          />
        ))}

        {/* ── Ember sparks — rising with sway ── */}
        {[
          { l: '4%',  t: '88%', s: 3, xD:  9,  yD: -340, dur: 6.2, delay: 0,   op: 0.55, round: true  },
          { l: '11%', t: '75%', s: 2, xD: -6,  yD: -280, dur: 8.0, delay: 1.3, op: 0.40, round: true  },
          { l: '19%', t: '92%', s: 4, xD:  7,  yD: -380, dur: 5.8, delay: 0.5, op: 0.60, round: false },
          { l: '27%', t: '80%', s: 2, xD: -8,  yD: -310, dur: 7.4, delay: 2.1, op: 0.38, round: true  },
          { l: '36%', t: '95%', s: 3, xD:  5,  yD: -360, dur: 6.6, delay: 0.8, op: 0.52, round: false },
          { l: '44%', t: '70%', s: 5, xD: -10, yD: -260, dur: 9.2, delay: 3.4, op: 0.35, round: true  },
          { l: '52%', t: '90%', s: 2, xD:  6,  yD: -320, dur: 7.0, delay: 1.9, op: 0.45, round: true  },
          { l: '61%', t: '82%', s: 4, xD: -7,  yD: -290, dur: 6.4, delay: 0.3, op: 0.58, round: false },
          { l: '69%', t: '93%', s: 3, xD:  8,  yD: -370, dur: 5.6, delay: 2.7, op: 0.50, round: true  },
          { l: '76%', t: '78%', s: 2, xD: -5,  yD: -250, dur: 8.6, delay: 1.0, op: 0.38, round: true  },
          { l: '84%', t: '86%', s: 4, xD:  9,  yD: -340, dur: 6.8, delay: 4.2, op: 0.55, round: false },
          { l: '92%', t: '72%', s: 3, xD: -6,  yD: -300, dur: 7.8, delay: 0.7, op: 0.42, round: true  },
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: p.l, top: p.t,
              width: p.s, height: p.s,
              borderRadius: p.round ? '50%' : '2px',
              background: i % 3 === 0 ? 'rgba(200,90,10,0.9)' : i % 3 === 1 ? 'rgba(240,160,30,0.85)' : 'rgba(255,210,60,0.80)',
              boxShadow: `0 0 ${p.s * 2}px ${p.s}px rgba(240,140,20,0.4)`,
              rotate: p.round ? 0 : 45,
            }}
            animate={{ x: [0, p.xD, 0], y: [0, p.yD], opacity: [0, p.op, p.op * 0.6, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, ease: 'easeOut', delay: p.delay }}
          />
        ))}

        {/* ── Drifting dust specks — slow horizontal float ── */}
        {[
          { l: '8%',  t: '30%', xD:  60, dur: 18, delay: 0   },
          { l: '25%', t: '55%', xD: -50, dur: 22, delay: 4   },
          { l: '55%', t: '20%', xD:  45, dur: 20, delay: 8   },
          { l: '73%', t: '65%', xD: -55, dur: 16, delay: 2   },
          { l: '88%', t: '40%', xD:  40, dur: 24, delay: 6   },
          { l: '40%', t: '75%', xD: -35, dur: 19, delay: 10  },
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none rounded-full"
            style={{ left: p.l, top: p.t, width: 3, height: 3, background: 'rgba(160,65,5,0.30)' }}
            animate={{ x: [0, p.xD, 0], opacity: [0, 0.5, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
          />
        ))}

        {/* ── Content ── */}
        <div className="relative z-10 max-w-5xl mx-auto">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-10 bg-[#3b1c00]/25" />
              <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#7c3010]">The Hard Truth</span>
              <div className="h-px w-10 bg-[#3b1c00]/25" />
            </div>

            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#3b1c00] leading-[1.05] tracking-tight mb-6">
              Learning without{' '}
              <span className="font-light italic">direction</span>
              <br />is time wasted
            </h2>
            <p className="text-[#7c4210] text-xl max-w-xl mx-auto leading-relaxed">
              Most online learners never finish. CourseHive fixes that with AI-driven personalization and real accountability.
            </p>
          </motion.div>

          {/* Staggered floating stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-end">
            {[
              {
                label: 'Course Completion',
                value: '>80%',
                desc: 'of online learners never finish what they start — we fix that',
                offset: 'md:mb-20',
                delay: 0,
              },
              {
                label: 'Time Saved',
                value: '3–5×',
                desc: 'faster to reach goals with a personalized AI roadmap vs self-study',
                offset: '',
                delay: 0.14,
              },
              {
                label: 'Career Impact',
                value: '94%',
                desc: 'of CourseHive users report meaningful career growth within 6 months',
                offset: 'md:mb-10',
                delay: 0.28,
              },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 52 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: s.delay, duration: 0.7, ease: 'easeOut' }}
                className={`bg-white/80 backdrop-blur-md rounded-3xl p-10 shadow-2xl ${s.offset}`}
              >
                <span className="inline-block text-[#ea6c0a] text-[11px] font-bold tracking-wider uppercase bg-orange-100 px-3 py-1 rounded-full mb-7">
                  {s.label}
                </span>
                <div className="text-6xl font-extrabold text-[#3b1c00] mb-4 tracking-tight">{s.value}</div>
                <p className="text-[#7c4210] text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/*  FEATURES — premium bento grid                          */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="features" className="py-36 px-6" style={{ background: '#f0f2f8' }}>
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="flex items-center justify-center gap-4 mb-5">
              <div className="h-px w-10 bg-[#172b44]/20" />
              <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#f97316]">Why CourseHive</span>
              <div className="h-px w-10 bg-[#172b44]/20" />
            </div>
            <h2 className="text-5xl sm:text-6xl font-extrabold text-[#172b44] leading-tight tracking-tight">
              Built different,
              <br /><span className="font-light italic">for real results</span>
            </h2>
            <p className="text-[#3d5f80] text-lg mt-5 max-w-xl mx-auto">
              Every feature is designed around one goal — getting you from where you are to where you want to be.
            </p>
          </motion.div>

          {/* ── Bento grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* ═══ CARD A — AI Roadmap (col-span-2) ═══ */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              className="md:col-span-2 bg-white rounded-2xl p-8 border border-[#e2e6f2] shadow-sm overflow-hidden relative"
            >
              {/* Subtle purple glow top-right */}
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)' }} />

              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#7c3aed] bg-[#f3f0ff] px-3 py-1 rounded-full">AI Roadmap</span>
                  <h3 className="text-xl font-bold text-[#172b44] mt-3 mb-1">Your personalized path to mastery</h3>
                  <p className="text-sm text-[#3d5f80]">AI builds your exact learning sequence — no guesswork, no wasted time.</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#f3f0ff] flex items-center justify-center shrink-0 ml-4">
                  <Brain className="w-5 h-5 text-[#7c3aed]" />
                </div>
              </div>

              {/* Roadmap visual */}
              <div className="bg-[#fafbff] rounded-xl p-5 border border-[#eaecf8]">
                <div className="text-[10px] font-semibold text-[#8896b0] uppercase tracking-wider mb-4">Machine Learning Path · 68% complete</div>
                <div className="flex flex-col gap-3">
                  {[
                    { topic: 'Python Fundamentals',    status: 'done',    weeks: '2 weeks', color: '#059669' },
                    { topic: 'Data Structures & Algo', status: 'done',    weeks: '3 weeks', color: '#059669' },
                    { topic: 'ML Fundamentals',        status: 'current', weeks: '4 weeks', color: '#f97316' },
                    { topic: 'Neural Networks',        status: 'upcoming',weeks: '5 weeks', color: '#94a3b8' },
                    { topic: 'Deep Learning & LLMs',   status: 'upcoming',weeks: '6 weeks', color: '#94a3b8' },
                  ].map((n, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {/* Status dot */}
                      <div className="relative shrink-0">
                        {n.status === 'current' && (
                          <div className="absolute inset-0 rounded-full animate-ping" style={{ background: '#f97316', opacity: 0.3 }} />
                        )}
                        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                          style={{ borderColor: n.color, background: n.status === 'done' ? n.color : 'white' }}>
                          {n.status === 'done' && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                              <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                          {n.status === 'current' && <div className="w-2 h-2 rounded-full" style={{ background: n.color }} />}
                        </div>
                      </div>
                      {/* Connector line */}
                      <div className="flex-1 flex items-center gap-3">
                        <span className={`text-sm font-medium ${n.status === 'upcoming' ? 'text-[#94a3b8]' : 'text-[#172b44]'}`}>{n.topic}</span>
                        <div className="flex-1 h-px" style={{ background: i < 2 ? '#e2f5ed' : '#f0f2f8' }} />
                        <span className="text-[10px] font-medium shrink-0" style={{ color: n.color }}>{n.weeks}</span>
                        {n.status === 'done' && <span className="text-[10px] bg-[#e2f5ed] text-[#059669] font-bold px-2 py-0.5 rounded-full shrink-0">✓ Done</span>}
                        {n.status === 'current' && <span className="text-[10px] bg-orange-100 text-[#f97316] font-bold px-2 py-0.5 rounded-full shrink-0 animate-pulse">In progress</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ═══ CARD B — Gamification (col-span-1, dark) ═══ */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.12 }}
              className="bg-[#172b44] rounded-2xl p-8 border border-[#1e3a5c] shadow-sm overflow-hidden relative flex flex-col"
            >
              <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)' }} />

              <span className="text-[10px] font-bold tracking-widest uppercase text-[#f97316] bg-[#f97316]/15 px-3 py-1 rounded-full self-start mb-6">Gamified Progress</span>

              {/* Streak */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-2xl">🔥</div>
                <div>
                  <div className="text-3xl font-extrabold text-white leading-none">47</div>
                  <div className="text-xs text-white/50 mt-0.5">day streak</div>
                </div>
              </div>

              {/* Level badge */}
              <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-white/5 border border-white/8">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-extrabold">12</div>
                <div>
                  <div className="text-sm font-bold text-white">Level 12</div>
                  <div className="text-[10px] text-white/40">Advanced Learner</div>
                </div>
                <div className="ml-auto">
                  <Trophy className="w-4 h-4 text-amber-400" />
                </div>
              </div>

              {/* XP bar */}
              <div className="mb-1 flex justify-between items-center">
                <span className="text-xs text-white/50">XP Progress</span>
                <span className="text-xs font-bold text-white">2,840 / 3,000</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full mb-6 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg,#f97316,#fbbf24)' }}
                  initial={{ width: 0 }}
                  whileInView={{ width: '94%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
                />
              </div>

              {/* Sticky quote */}
              <div className="mt-auto bg-[#fdfaf0] rounded-xl p-4 shadow-lg" style={{ transform: 'rotate(-1.5deg)' }}>
                <p className="text-xs italic text-[#4a3a20] leading-relaxed">"I check my streak every morning before coffee — it's become a ritual."</p>
                <p className="text-[10px] text-[#8a7040] mt-2 font-medium">— Aryan M. · Web Developer</p>
              </div>
            </motion.div>

            {/* ═══ CARD C — Leaderboard (col-span-1) ═══ */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.18 }}
              className="bg-white rounded-2xl p-8 border border-[#e2e6f2] shadow-sm overflow-hidden relative"
            >
              <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)' }} />

              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#2563eb] bg-[#eff4ff] px-3 py-1 rounded-full">Leaderboard</span>
                  <h3 className="text-lg font-bold text-[#172b44] mt-3">Top learners</h3>
                </div>
                <span className="text-[10px] text-[#94a3b8] bg-[#f4f6fb] px-2 py-1 rounded-full">This week</span>
              </div>

              <div className="space-y-3">
                {[
                  { rank: 1, name: 'Sophia L.',  xp: 2840, max: 2840, color: '#f59e0b', from: '#818cf8', to: '#6366f1' },
                  { rank: 2, name: 'Marcus K.',  xp: 2310, max: 2840, color: '#94a3b8', from: '#34d399', to: '#059669' },
                  { rank: 3, name: 'Riya J.',    xp: 1980, max: 2840, color: '#cd7c2a', from: '#fb923c', to: '#ea580c' },
                  { rank: 4, name: 'Priya S.',   xp: 1640, max: 2840, color: '#cbd5e1', from: '#60a5fa', to: '#2563eb' },
                ].map((u) => (
                  <div key={u.rank}>
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-[11px] font-extrabold w-4 shrink-0" style={{ color: u.color }}>#{u.rank}</span>
                      <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-white text-[9px] font-bold"
                        style={{ background: `linear-gradient(135deg,${u.from},${u.to})` }}>
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-xs font-semibold text-[#172b44] flex-1">{u.name}</span>
                      <span className="text-[10px] text-[#3d5f80] font-medium shrink-0">{u.xp.toLocaleString()} XP</span>
                    </div>
                    <div className="ml-7 h-1.5 bg-[#f0f2f8] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg,${u.from},${u.to})` }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(u.xp / u.max) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.0, delay: 0.3 + u.rank * 0.1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-[#f0f2f8] flex items-center justify-between">
                <span className="text-xs text-[#3d5f80]">You are <span className="font-bold text-[#172b44]">#18</span> this week</span>
                <span className="text-[10px] text-[#2563eb] font-semibold flex items-center gap-1 cursor-pointer hover:underline">
                  View all <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </motion.div>

            {/* ═══ CARD D — Resume ATS (col-span-2) ═══ */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.24 }}
              className="md:col-span-2 bg-white rounded-2xl p-8 border border-[#e2e6f2] shadow-sm overflow-hidden relative"
            >
              <div className="absolute -bottom-14 right-0 w-64 h-64 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)' }} />

              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#7c3aed] bg-[#f3f0ff] px-3 py-1 rounded-full">Resume Intelligence</span>
                  <h3 className="text-xl font-bold text-[#172b44] mt-3 mb-1">AI-powered ATS scoring</h3>
                  <p className="text-sm text-[#3d5f80]">Know exactly how recruiters see your resume before you apply.</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#f3f0ff] flex items-center justify-center shrink-0 ml-4">
                  <Target className="w-5 h-5 text-[#7c3aed]" />
                </div>
              </div>

              <div className="grid sm:grid-cols-[auto_1fr] gap-8 items-start">
                {/* Score gauge */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-28 h-28">
                    <svg viewBox="0 0 96 96" className="w-28 h-28 -rotate-90">
                      <circle cx="48" cy="48" r="40" fill="none" stroke="#ede9fe" strokeWidth="9" />
                      <motion.circle cx="48" cy="48" r="40" fill="none" stroke="url(#atsGrad)" strokeWidth="9"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: `0 ${Math.PI * 80}` }}
                        whileInView={{ strokeDasharray: `${Math.PI * 80 * 0.87} ${Math.PI * 80}` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.4, delay: 0.3, ease: 'easeOut' }}
                      />
                      <defs>
                        <linearGradient id="atsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#a78bfa" />
                          <stop offset="100%" stopColor="#7c3aed" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-extrabold text-[#7c3aed] leading-none">87</span>
                      <span className="text-[10px] text-[#94a3b8] mt-0.5">/ 100</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-[#172b44]">Strong Match</div>
                    <div className="text-xs text-[#3d5f80]">Top 13% of applicants</div>
                  </div>
                </div>

                {/* Keywords + sticky note */}
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-[#3d5f80] mb-2.5 uppercase tracking-wider">Keyword Analysis</div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { word: 'Python',        match: true  }, { word: 'Machine Learning', match: true  },
                        { word: 'TensorFlow',    match: true  }, { word: 'SQL',              match: true  },
                        { word: 'Deep Learning', match: false }, { word: 'AWS',              match: false },
                        { word: 'Docker',        match: true  }, { word: 'PyTorch',          match: false },
                      ].map((k) => (
                        <span key={k.word}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-full border"
                          style={k.match
                            ? { background: '#ecfdf5', color: '#059669', borderColor: '#a7f3d0' }
                            : { background: '#fff1f2', color: '#e11d48', borderColor: '#fecdd3' }
                          }>
                          {k.match ? '✓' : '+'} {k.word}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sticky note */}
                  <div className="bg-[#fdfaf0] rounded-xl p-4 shadow-md max-w-sm" style={{ transform: 'rotate(0.8deg)' }}>
                    <div className="w-5 h-5 rounded-full bg-[#f97316] flex items-center justify-center mb-2">
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="3"/></svg>
                    </div>
                    <p className="text-xs italic text-[#4a3a20] leading-relaxed">"My interview callbacks doubled after fixing the keywords CourseHive flagged."</p>
                    <p className="text-[10px] text-[#8a7040] mt-2 font-medium">— Neha P. · Data Scientist at Stripe</p>
                    {/* paper curl */}
                    <div className="absolute bottom-0 right-0 w-6 h-6" style={{ background: 'linear-gradient(225deg, transparent 50%, #e8e0c0 50%)', borderRadius: '0 0 12px 0' }} />
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/*  CTA BANNER                                             */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="about"
        className="relative py-36 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#0d1f38 0%,#152d50 45%,#0d1f38 100%)' }}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(37,99,235,0.13) 0%, transparent 65%)' }} />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.09) 0%, transparent 70%)' }} />
        </div>

        {/* Floating particles */}
        {[
          { l:'8%',  t:'20%', dur:7,   del:0   }, { l:'18%', t:'70%', dur:9,   del:1.5 },
          { l:'32%', t:'35%', dur:8,   del:0.8 }, { l:'50%', t:'15%', dur:10,  del:2.3 },
          { l:'65%', t:'60%', dur:7.5, del:0.3 }, { l:'78%', t:'28%', dur:8.5, del:1.8 },
          { l:'88%', t:'75%', dur:9,   del:0.6 }, { l:'42%', t:'82%', dur:7,   del:3.1 },
        ].map((p, i) => (
          <motion.div key={i} className="absolute w-1 h-1 rounded-full pointer-events-none"
            style={{ left:p.l, top:p.t, background:'rgba(148,163,184,0.4)' }}
            animate={{ y:[0,-18,0], opacity:[0,0.6,0] }}
            transition={{ duration:p.dur, repeat:Infinity, ease:'easeInOut', delay:p.del }} />
        ))}

        {/* Subtle dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{ backgroundImage:'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize:'32px 32px' }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity:0, y:24 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            className="space-y-6"
          >
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-10 bg-white/15" />
              <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#f97316]">Get Started Today</span>
              <div className="h-px w-10 bg-white/15" />
            </div>

            {/* Headline */}
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight">
              Begin your <span className="font-light italic">learning</span>
              <br />journey today
            </h2>

            <p className="text-lg text-white/55 max-w-lg mx-auto leading-relaxed">
              Join 50,000+ learners who are growing with CourseHive. AI-powered paths, real projects, zero guesswork.
            </p>

            {/* Avatar + rating strip */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {[
                    { i:'AS', f:'#818cf8', t:'#6366f1' },
                    { i:'MK', f:'#34d399', t:'#059669' },
                    { i:'RJ', f:'#fb923c', t:'#ea580c' },
                    { i:'NP', f:'#60a5fa', t:'#2563eb' },
                  ].map((a, idx) => (
                    <div key={idx}
                      className="w-8 h-8 rounded-full border-2 border-[#0d1f38] flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ background:`linear-gradient(135deg,${a.f},${a.t})`, zIndex:4-idx }}>
                      {a.i}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex gap-0.5 mb-0.5">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className="w-3 h-3 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-white/50">4.9 · 12,400+ reviews</span>
                </div>
              </div>
              <div className="w-px h-8 bg-white/10 hidden sm:block" />
              <span className="text-xs text-white/40">No credit card required</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity:0, y:22 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ delay:0.25 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
          >
            <Link href="/onboarding/field">
              <button className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea6c0a] text-white text-base font-semibold px-10 py-4 rounded-full shadow-xl shadow-orange-900/40 transition-all hover:-translate-y-0.5 hover:shadow-2xl">
                Start for Free <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/login">
              <button className="inline-flex items-center gap-2 bg-white/8 hover:bg-white/14 text-white text-base font-semibold px-10 py-4 rounded-full border border-white/15 transition-all hover:-translate-y-0.5 backdrop-blur-sm">
                Sign In
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/*  FOOTER                                                 */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#0a1828 0%,#07121f 100%)' }}
      >
        {/* Top gradient divider */}
        <div className="h-px w-full" style={{ background:'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.08) 30%,rgba(249,115,22,0.3) 50%,rgba(255,255,255,0.08) 70%,transparent 100%)' }} />

        {/* Subtle dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage:'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize:'28px 28px' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-10">
          <div className="grid md:grid-cols-4 gap-12 mb-14">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 bg-white/10 border border-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Hexagon className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white text-base tracking-tight">CourseHive</span>
              </div>
              <p className="text-sm text-white/40 leading-relaxed mb-6">
                AI-powered learning platform built for ambitious people who want real results.
              </p>
              {/* Social icons */}
              <div className="flex gap-3">
                {['𝕏', 'in', 'gh'].map((s) => (
                  <a key={s} href="#"
                    className="w-8 h-8 rounded-lg bg-white/6 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/12 transition-all text-[11px] font-bold">
                    {s}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title:'Platform',  links:['Features','Courses','Leaderboard','Resume ATS'] },
              { title:'Company',   links:['About','Blog','Careers','Press']                },
              { title:'Support',   links:['Help Center','Contact','Status','Privacy']      },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-bold tracking-[0.16em] uppercase text-white/30 mb-5">{col.title}</h4>
                <ul className="space-y-3.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/[0.07] flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/25">© 2025 CourseHive · Built by Team Hacktivists</p>
            <div className="flex gap-6">
              {['Terms','Privacy','Cookies'].map((item) => (
                <a key={item} href="#" className="text-xs text-white/25 hover:text-white/60 transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
