'use client'

import React from 'react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'


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
  const [activeFeature, setActiveFeature] = useState(0)
  const [autoKey, setAutoKey] = useState(0)

  useEffect(() => { setMounted(true) }, [])

  // Auto-advance features; resets whenever user clicks (autoKey changes)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4)
    }, DURATION * 1000)
    return () => clearInterval(interval)
  }, [autoKey])

  const DURATION = 2.5 // seconds per feature
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
            className="absolute rounded-full bg-card/50 pointer-events-none"
            style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
            animate={{ opacity: [0.25, 0.75, 0.25], y: [0, -12, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}

        {/* ── Navbar ── */}
        <nav className="relative z-50 px-6 lg:px-14 py-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <BrandLogo href="/" width={184} height={38} priority className="rounded-lg object-cover object-center" />

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-9">
<a href="#features"  className="text-sm font-medium text-[var(--primary)] hover:text-foreground transition-colors">Features</a>
              <a href="#learners"  className="text-sm font-medium text-[var(--primary)] hover:text-foreground transition-colors">Learners</a>
              <Link href="/login"  className="text-sm font-medium text-[var(--primary)] hover:text-foreground transition-colors">Sign In</Link>
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
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-foreground">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 bg-card/50 backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-4"
            >
              <a href="#features" className="block text-sm font-medium text-foreground py-1">Features</a>
              <a href="#learners" className="block text-sm font-medium text-foreground py-1">Learners</a>
              <Link href="/login" className="block text-sm font-medium text-foreground py-1">Sign In</Link>
              <Link href="/onboarding/field">
                <button className="w-full mt-2 bg-[#f97316] text-white text-sm font-semibold py-3 rounded-full">
                  Get Started
                </button>
              </Link>
            </motion.div>
          )}
        </nav>

        {/* ── Side clouds LEFT — 3 puffs ── */}
        <div className="absolute left-0 top-0 bottom-0 hidden xl:block pointer-events-none z-0" style={{ width: '340px' }}>
          {/* Puff A — upper */}
          <motion.div className="absolute" style={{ top: '8%', left: '-6px' }}
            animate={{ x: [0, 14, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0 }}>
            <div style={{ filter: 'blur(14px)', opacity: 0.48 }}>
              <Cloud style={{ width: 360, height: 'auto', color: '#ffffff' }} />
            </div>
            <div className="absolute inset-0" style={{ filter: 'blur(3px)', opacity: 0.78, transform: 'translateX(14px) translateY(4px)' }}>
              <Cloud style={{ width: 290, height: 'auto', color: '#ffffff' }} />
            </div>
          </motion.div>

          {/* Puff B — mid, drifts in from left */}
          <motion.div className="absolute" style={{ top: '43%', left: '-52px' }}
            animate={{ x: [0, 18, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2.1 }}>
            <div style={{ filter: 'blur(20px)', opacity: 0.34 }}>
              <Cloud style={{ width: 420, height: 'auto', color: '#e8f0f8' }} />
            </div>
            <div className="absolute inset-0" style={{ filter: 'blur(5px)', opacity: 0.55, transform: 'translateX(16px) translateY(6px)' }}>
              <Cloud style={{ width: 340, height: 'auto', color: '#e8f0f8' }} />
            </div>
          </motion.div>

          {/* Puff C — lower warm */}
          <motion.div className="absolute" style={{ top: '66%', left: '-34px' }}
            animate={{ x: [0, 10, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4.8 }}>
            <div style={{ filter: 'blur(18px)', opacity: 0.38 }}>
              <Cloud style={{ width: 380, height: 'auto', color: '#f5e8d8' }} />
            </div>
            <div className="absolute inset-0" style={{ filter: 'blur(4px)', opacity: 0.62, transform: 'translateX(10px) translateY(5px)' }}>
              <Cloud style={{ width: 305, height: 'auto', color: '#f5e8d8' }} />
            </div>
          </motion.div>
        </div>

        {/* ── Side clouds RIGHT — 3 puffs ── */}
        <div className="absolute right-0 top-0 bottom-0 hidden xl:block pointer-events-none z-0" style={{ width: '340px' }}>
          {/* Puff D — upper, partially off-edge */}
          <motion.div className="absolute" style={{ top: '15%', right: '-50px' }}
            animate={{ x: [0, -16, 0] }} transition={{ duration: 11.5, repeat: Infinity, ease: 'easeInOut', delay: 1.0 }}>
            <div style={{ filter: 'blur(15px)', opacity: 0.46 }}>
              <Cloud style={{ width: 400, height: 'auto', color: '#ffffff' }} />
            </div>
            <div className="absolute inset-0" style={{ filter: 'blur(4px)', opacity: 0.70, transform: 'translateX(-12px) translateY(4px)' }}>
              <Cloud style={{ width: 320, height: 'auto', color: '#ffffff' }} />
            </div>
          </motion.div>

          {/* Puff E — mid, drifts right */}
          <motion.div className="absolute" style={{ top: '38%', right: '-20px' }}
            animate={{ x: [0, -12, 0] }} transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 5.5 }}>
            <div style={{ filter: 'blur(17px)', opacity: 0.36 }}>
              <Cloud style={{ width: 350, height: 'auto', color: '#ddeef8' }} />
            </div>
            <div className="absolute inset-0" style={{ filter: 'blur(4px)', opacity: 0.58, transform: 'translateX(-10px) translateY(5px)' }}>
              <Cloud style={{ width: 275, height: 'auto', color: '#ddeef8' }} />
            </div>
          </motion.div>

          {/* Puff F — lower warm, near bottom-right */}
          <motion.div className="absolute" style={{ top: '72%', right: '-10px' }}
            animate={{ x: [0, -9, 0] }} transition={{ duration: 9.5, repeat: Infinity, ease: 'easeInOut', delay: 3.3 }}>
            <div style={{ filter: 'blur(14px)', opacity: 0.50 }}>
              <Cloud style={{ width: 345, height: 'auto', color: '#f0ddc8' }} />
            </div>
            <div className="absolute inset-0" style={{ filter: 'blur(3px)', opacity: 0.76, transform: 'translateX(-8px) translateY(4px)' }}>
              <Cloud style={{ width: 272, height: 'auto', color: '#f0ddc8' }} />
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
                    className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center text-white text-[10px] font-bold shadow-sm"
                    style={{ background: `linear-gradient(135deg,${a.from},${a.to})`, zIndex: 5 - i }}
                  >
                    {a.init}
                  </div>
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground bg-card/50 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-border/ shadow-sm">
                50k+ learners growing daily
              </span>
            </motion.div>

            {/* Badge */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 bg-card/50 backdrop-blur-sm text-foreground text-xs font-semibold px-4 py-2 rounded-full border border-border/ shadow-sm">
                <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full animate-pulse" />
                AI-Powered Learning Platform
              </span>
            </motion.div>

            {/* Heading — large & dramatic */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-[5.2rem] font-extrabold text-foreground leading-[1.05] tracking-tight"
            >
              Learn What
              <br />
              <span className="text-[#f97316]">You Love.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-xl text-[#3d5f80] max-w-2xl mx-auto leading-relaxed"
            >
              CourseHive analyzes your browsing history to discover what you&apos;re curious about — then builds you a personalized learning roadmap with courses, projects, and real progress tracking. Powered by AI, driven by you.
            </motion.p>

            {/* Email + CTA — eClaster inline style */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-5 py-4 rounded-full bg-card/50 backdrop-blur-sm border border-border/ text-foreground placeholder-[#8aaac8] text-sm outline-none focus:bg-card/50 transition-all shadow-sm"
              />
              <Link href="/onboarding/field">
                <button className="inline-flex items-center justify-center gap-2 bg-[#f97316] hover:bg-[#ea6c0a] text-white text-sm font-semibold px-6 py-4 rounded-full shadow-lg shadow-orange-300/50 transition-all hover:-translate-y-0.5 hover:shadow-xl whitespace-nowrap w-full sm:w-auto">
                  Get Started — It&apos;s Free <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp}>
              <a href="#features" className="text-sm text-[#3d5f80] hover:text-foreground transition-colors underline underline-offset-4">
                Explore all features
              </a>
            </motion.div>

            {/* ── Bento preview cards — eClaster style ── */}
            <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">

              {/* Card 1: Upload Your History */}
              <div className="bg-card/50 backdrop-blur-md rounded-3xl p-6 border border-border/ shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <h4 className="font-bold text-foreground text-base mb-2">Upload Your History</h4>
                <p className="text-xs text-[#3d5f80] leading-relaxed mb-5">Share your browsing history and let AI discover your hidden interests and curiosities automatically.</p>
                {/* Mini step chain */}
                <div className="flex items-center gap-1.5 mb-4">
                  {['#f97316','#2563eb','#7c3aed','#059669'].map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full border-2 border-border shadow flex items-center justify-center" style={{ background: c }}>
                        <div className="w-2 h-2 bg-card rounded-full" />
                      </div>
                      {i < 3 && <div className="h-px w-4 bg-[#172b44]/20" />}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['Chrome','Firefox','Safari'].map((tag) => (
                    <span key={tag} className="text-[10px] font-semibold bg-[#172b44]/10 text-foreground px-2.5 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Card 2: Follow Your Roadmap — dark card */}
              <div className="bg-[#172b44] rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-[#f97316] bg-[#f97316]/20 px-2.5 py-1 rounded-full tracking-wide">AI</span>
                </div>
                <h4 className="font-bold text-white text-base mb-4">Follow Your Roadmap</h4>
                <div className="space-y-3">
                  {[
                    { step: 'Interests Detected', status: 'done', color: '#f59e0b' },
                    { step: 'Roadmap Generated', status: 'done', color: '#94a3b8' },
                    { step: 'Courses Assigned',  status: 'active', color: '#f97316' },
                  ].map((u) => (
                    <div key={u.step} className="flex items-center justify-between">
                      <span className="text-white text-xs font-medium">{u.step}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: u.status === 'done' ? 'rgba(5,150,105,0.2)' : 'rgba(249,115,22,0.2)', color: u.status === 'done' ? '#34d399' : '#f97316' }}>
                        {u.status === 'done' ? '✓' : '→'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-border/ flex justify-end">
                  <span className="text-[10px] text-white/50 flex items-center gap-1">View roadmap <ArrowRight className="w-3 h-3" /></span>
                </div>
              </div>

              {/* Card 3: Build & Earn XP */}
              <div className="rounded-3xl p-6 border border-border/ shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'linear-gradient(135deg,#eef4ff 0%,#f3eeff 100%)' }}>
                <div className="mb-3">
                  <span className="text-[10px] font-bold text-[#2563eb] bg-[#2563eb]/15 px-2.5 py-1 rounded-full">XP &amp; Projects</span>
                </div>
                <h4 className="font-bold text-foreground text-base mb-2">Build &amp; Earn XP</h4>
                <p className="text-xs text-[#3d5f80] leading-relaxed mb-5">Complete real projects, earn XP, climb the leaderboard, and validate your skills with a portfolio.</p>
                {/* XP gauge */}
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 shrink-0">
                    <svg viewBox="0 0 48 48" className="w-14 h-14 -rotate-90">
                      <circle cx="24" cy="24" r="20" fill="none" stroke="#e0e7ff" strokeWidth="5" />
                      <circle cx="24" cy="24" r="20" fill="none" stroke="#7c3aed" strokeWidth="5"
                        strokeDasharray={`${Math.PI * 40 * 0.72} ${Math.PI * 40}`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-[#7c3aed]">72%</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">2,840 XP</div>
                    <div className="text-xs text-[#3d5f80]">Level 12 · Advanced</div>
                  </div>
                </div>
              </div>

            </motion.div>
          </motion.div>
        </div>

        {/* Cloud bank at bottom — 7 layered clouds, fuller coverage */}
        <div className="absolute bottom-0 left-0 right-0 h-72 pointer-events-none overflow-hidden">
          {/* Back row — slightly higher, more transparent */}
          <Cloud style={{ position:'absolute', width:380, height:'auto', bottom: 40, left:'-2%',  color:'#e8dfd4', opacity:0.55 }} />
          <Cloud style={{ position:'absolute', width:440, height:'auto', bottom: 32, left:'22%',  color:'#eee5d8', opacity:0.50 }} />
          <Cloud style={{ position:'absolute', width:400, height:'auto', bottom: 36, left:'52%',  color:'#e8dfd4', opacity:0.52 }} />
          <Cloud style={{ position:'absolute', width:360, height:'auto', bottom: 28, right: '0%', color:'#ede4d9', opacity:0.48 }} />
          {/* Front row — lower, more opaque, fills the edge */}
          <Cloud style={{ position:'absolute', width:500, height:'auto', bottom:-20, left:'-5%',  color:'#f0e6d8', opacity:0.96 }} />
          <Cloud style={{ position:'absolute', width:480, height:'auto', bottom: -8, left:'26%',  color:'#f5ece0', opacity:0.90 }} />
          <Cloud style={{ position:'absolute', width:520, height:'auto', bottom:-16, left:'50%',  color:'#ecddd0', opacity:0.98 }} />
          <Cloud style={{ position:'absolute', width:460, height:'auto', bottom: -4, right:'-2%', color:'#f2e8db', opacity:0.88 }} />
          
          {/* Gradient to blend the clouds perfectly into the next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to bottom, transparent, #ddeef8)' }} />
        </div>
      </section>


      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/*  FEATURES — interactive selector, sky palette            */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="features" className="relative py-32 px-6 overflow-hidden" style={{ background: 'linear-gradient(180deg,#ddeef8 0%,#cce4f5 25%,#d8ecf0 55%,#e8e0d0 100%)' }}>

        {/* Floating particles — same as hero */}
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-card/50 pointer-events-none"
            style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
            animate={{ opacity: [0.2, 0.6, 0.2], y: [0, -10, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}

        {/* Soft light orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.45) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-32 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(249,200,120,0.35) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="relative z-10 max-w-6xl mx-auto">

          {/* ── Section header ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-4 mb-5">
              <div className="h-px w-10 bg-[#172b44]/20" />
              <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#f97316]">Why CourseHive</span>
              <div className="h-px w-10 bg-[#172b44]/20" />
            </div>
            <h2 className="text-5xl sm:text-6xl lg:text-[4.6rem] font-extrabold text-foreground leading-[1.04] tracking-tight mb-5">
              Learn smarter,{' '}
              <span className="text-[#f97316]">not harder.</span>
            </h2>
            <p className="text-[#3d5f80] text-lg max-w-xl mx-auto leading-relaxed">
              Four systems engineered around how curious people actually grow.
            </p>
          </motion.div>

          {/* ── Interactive selector layout ── */}
          <div className="grid lg:grid-cols-[5fr_7fr] gap-10 lg:items-stretch" style={{ minHeight: '540px' }}>

            {/* Left: Roadmap flow — full height flex */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              className="flex flex-col h-full"
            >
              {([
                {
                  num: '01', title: 'Personalized Interests',
                  label: 'Discovery',
                  desc: 'Upload your browsing history. AI maps what genuinely excites you and builds your unique learning identity.',
                  accent: '#7c3aed',
                },
                {
                  num: '02', title: 'AI-Powered Roadmaps',
                  label: 'Planning',
                  desc: 'A structured learning sequence generated for your exact goals — from zero to job-ready, every step defined.',
                  accent: '#f97316',
                },
                {
                  num: '03', title: 'Project Validation',
                  label: 'Building',
                  desc: 'Build real projects tied to your roadmap and get them verified. A live portfolio that proves what you know.',
                  accent: '#059669',
                },
                {
                  num: '04', title: 'Leaderboard & Streaks',
                  label: 'Competing',
                  desc: 'Earn XP, maintain streaks, climb weekly leaderboards. Learning becomes a habit you actually enjoy.',
                  accent: '#d97706',
                },
              ] as const).map((f, i) => {
                const isActive = activeFeature === i
                const isDone   = i < activeFeature

                return (
                  <div key={i} className="flex gap-4 flex-1 min-h-0">

                    {/* Node + connector column */}
                    <div className="flex flex-col items-center shrink-0">
                      <button
                        onClick={() => { setActiveFeature(i); setAutoKey(k => k + 1) }}
                        className="relative w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-300 cursor-pointer shrink-0"
                        style={{
                          background: isActive ? f.accent : isDone ? 'rgba(5,150,105,0.12)' : 'rgba(255,255,255,0.75)',
                          border: `2px solid ${isActive ? f.accent : isDone ? 'rgba(5,150,105,0.5)' : 'rgba(23,43,68,0.14)'}`,
                          boxShadow: isActive ? `0 0 0 7px ${f.accent}1a, 0 4px 16px ${f.accent}30` : 'none',
                        }}
                      >
                        {isActive && (
                          <motion.span
                            className="absolute inset-0 rounded-full"
                            style={{ border: `2px solid ${f.accent}` }}
                            animate={{ scale: [1, 1.6, 1.6], opacity: [0.6, 0, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                          />
                        )}
                        {isDone ? (
                          <svg className="w-4 h-4" style={{ color: '#059669' }} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l3.5 3.5L13 4.5" />
                          </svg>
                        ) : (
                          <span className="text-xs font-black tracking-tight" style={{ color: isActive ? '#fff' : 'rgba(23,43,68,0.3)' }}>
                            {f.num}
                          </span>
                        )}
                      </button>

                      {i < 3 && (
                        <div className="w-px flex-1 my-1.5 rounded-full transition-all duration-500"
                          style={{
                            background: isDone
                              ? 'rgba(5,150,105,0.5)'
                              : isActive
                              ? `linear-gradient(to bottom, ${f.accent}90, rgba(23,43,68,0.1))`
                              : 'rgba(23,43,68,0.1)',
                          }}
                        />
                      )}
                    </div>

                    {/* Step content */}
                    <button
                      onClick={() => { setActiveFeature(i); setAutoKey(k => k + 1) }}
                      className="flex-1 text-left pb-2 pt-1.5 min-w-0"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-bold tracking-[0.18em] uppercase transition-colors duration-300"
                          style={{ color: isActive ? f.accent : isDone ? 'rgba(5,150,105,0.7)' : 'rgba(23,43,68,0.28)' }}>
                          {f.label}
                        </span>
                      </div>

                      <p className="font-semibold text-[17px] leading-snug tracking-tight transition-colors duration-300"
                        style={{ color: isActive ? '#172b44' : isDone ? 'rgba(23,43,68,0.6)' : 'rgba(23,43,68,0.32)' }}>
                        {f.title}
                      </p>

                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <p className="text-[13px] text-[#3d5f80] mt-2 leading-relaxed">{f.desc}</p>
                            <div className="mt-3 h-px rounded-full overflow-hidden" style={{ background: 'rgba(23,43,68,0.1)' }}>
                              <motion.div
                                key={`timer-${autoKey}-${i}`}
                                className="h-full rounded-full origin-left"
                                style={{ background: f.accent }}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: DURATION, ease: 'linear' }}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>

                  </div>
                )
              })}
            </motion.div>

            {/* Right: Animated feature card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="relative h-full"
            >
              {/* Ambient glow behind card */}
              <div className="absolute inset-0 rounded-3xl blur-2xl scale-95 pointer-events-none transition-all duration-700"
                style={{ background: [
                  'rgba(124,58,237,0.12)',
                  'rgba(249,115,22,0.12)',
                  'rgba(5,150,105,0.10)',
                  'rgba(217,119,6,0.10)',
                ][activeFeature] }} />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, y: 18, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -18, scale: 0.96 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="relative h-full rounded-3xl overflow-hidden border border-border/ shadow-2xl shadow-[#172b44]/10"
                  style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(24px)' }}
                >
                  {/* Coloured top strip */}
                  <div className="h-1 w-full" style={{ background: [
                    'linear-gradient(90deg,#7c3aed,#a78bfa)',
                    'linear-gradient(90deg,#f97316,#fbbf24)',
                    'linear-gradient(90deg,#059669,#34d399)',
                    'linear-gradient(90deg,#d97706,#f59e0b)',
                  ][activeFeature] }} />

                  <div className="p-7">

                    {/* ── Mockup 0: Interests ── */}
                    {activeFeature === 0 && (
                      <div className="space-y-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#7c3aed]/70">AI Analysis Complete</span>
                            <h3 className="text-xl font-bold text-foreground mt-0.5 tracking-tight">Your Interest Profile</h3>
                          </div>
                          <span className="text-[10px] font-bold text-[#7c3aed] bg-[#7c3aed]/10 px-3 py-1.5 rounded-full shrink-0 border border-[#7c3aed]/15">
                            3 months · 4,200 sites
                          </span>
                        </div>

                        <div className="space-y-4">
                          {[
                            { topic: 'Machine Learning',  pct: 84, color: '#7c3aed', sources: 'YouTube · arXiv · GitHub' },
                            { topic: 'Web Development',   pct: 67, color: '#2563eb', sources: 'MDN · Dev.to · Stack Overflow' },
                            { topic: 'System Design',     pct: 45, color: '#059669', sources: 'Medium · HN · Blogs' },
                            { topic: 'Data Engineering',  pct: 31, color: '#d97706', sources: 'Docs · Courses · Reddit' },
                          ].map((item, idx) => (
                            <div key={item.topic}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-foreground">{item.topic}</span>
                                <span className="text-xs font-bold tabular-nums" style={{ color: item.color }}>{item.pct}%</span>
                              </div>
                              <div className="h-2 rounded-full overflow-hidden mb-1.5" style={{ background: 'rgba(23,43,68,0.07)' }}>
                                <motion.div className="h-full rounded-full"
                                  style={{ background: `linear-gradient(90deg, ${item.color}, ${item.color}99)` }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.pct}%` }}
                                  transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }} />
                              </div>
                              <p className="text-[10px] text-[#3d5f80]/55 font-medium">{item.sources}</p>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-2.5 pt-3 border-t border-[#172b44]/8">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] animate-pulse shrink-0" />
                          <span className="text-xs text-[#3d5f80] font-medium">Generating your personalised roadmap…</span>
                        </div>
                      </div>
                    )}

                    {/* ── Mockup 1: Roadmap ── */}
                    {activeFeature === 1 && (
                      <div className="space-y-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#f97316]/70">Your Path</span>
                            <h3 className="text-xl font-bold text-foreground mt-0.5 tracking-tight">ML Roadmap</h3>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-3xl font-black text-[#f97316] leading-none tabular-nums">68%</div>
                            <div className="text-[10px] text-[#3d5f80]/60 font-medium mt-0.5">complete</div>
                          </div>
                        </div>

                        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(23,43,68,0.07)' }}>
                          <motion.div className="h-full rounded-full"
                            style={{ background: 'linear-gradient(90deg,#f97316,#fbbf24)' }}
                            initial={{ width: 0 }} animate={{ width: '68%' }}
                            transition={{ duration: 0.9, ease: 'easeOut' }} />
                        </div>

                        <div className="space-y-1.5">
                          {[
                            { phase: 'Python Foundations', weeks: '2 wks', status: 'done'   },
                            { phase: 'Data & Statistics',  weeks: '3 wks', status: 'done'   },
                            { phase: 'ML Algorithms',      weeks: '4 wks', status: 'active' },
                            { phase: 'Neural Networks',    weeks: '5 wks', status: 'locked' },
                            { phase: 'Capstone Project',   weeks: '3 wks', status: 'locked' },
                          ].map((s, idx) => (
                            <div key={idx} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                              style={{ background: s.status === 'active' ? 'rgba(249,115,22,0.07)' : 'rgba(23,43,68,0.02)', border: s.status === 'active' ? '1px solid rgba(249,115,22,0.18)' : '1px solid transparent' }}>
                              <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold"
                                style={{
                                  background: s.status === 'done' ? '#059669' : s.status === 'active' ? '#f97316' : 'rgba(23,43,68,0.07)',
                                  color: s.status === 'locked' ? 'rgba(23,43,68,0.25)' : '#fff',
                                }}>
                                {s.status === 'done' ? '✓' : s.status === 'active' ? '▶' : idx + 1}
                              </div>
                              <span className="flex-1 text-sm font-medium"
                                style={{ color: s.status === 'locked' ? 'rgba(23,43,68,0.3)' : '#172b44' }}>
                                {s.phase}
                              </span>
                              <span className="text-[10px] font-semibold shrink-0"
                                style={{ color: s.status === 'active' ? '#f97316' : 'rgba(23,43,68,0.3)' }}>
                                {s.status === 'active' ? 'In Progress' : s.weeks}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── Mockup 2: Projects ── */}
                    {activeFeature === 2 && (
                      <div className="space-y-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#059669]/70">Portfolio</span>
                            <h3 className="text-xl font-bold text-foreground mt-0.5 tracking-tight">Validated Projects</h3>
                          </div>
                          <span className="text-[10px] font-bold text-[#059669] bg-[#059669]/10 px-3 py-1.5 rounded-full shrink-0 border border-[#059669]/15">
                            2 of 4 Verified ✓
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {[
                            { name: 'Sentiment Classifier', stack: ['Python', 'scikit-learn', 'Flask'], status: 'verified', score: 94 },
                            { name: 'Portfolio Dashboard',  stack: ['React', 'Tailwind', 'Recharts'],  status: 'verified', score: 88 },
                            { name: 'Recommendation API',   stack: ['FastAPI', 'Redis', 'Docker'],     status: 'review',   score: null },
                          ].map(p => (
                            <div key={p.name} className="flex items-center gap-3.5 p-4 rounded-2xl border"
                              style={{
                                borderColor: p.status === 'verified' ? 'rgba(5,150,105,0.2)' : 'rgba(23,43,68,0.09)',
                                background:  p.status === 'verified' ? 'rgba(5,150,105,0.05)' : 'rgba(23,43,68,0.025)',
                              }}>
                              <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-base"
                                style={{
                                  background: p.status === 'verified' ? 'rgba(5,150,105,0.14)' : 'rgba(23,43,68,0.07)',
                                  color: p.status === 'verified' ? '#059669' : '#94a3b8',
                                }}>
                                {p.status === 'verified' ? '✓' : '⏳'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                                <div className="flex gap-1 mt-1.5 flex-wrap">
                                  {p.stack.map(t => (
                                    <span key={t} className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                                      style={{ background: 'rgba(23,43,68,0.07)', color: '#3d5f80' }}>{t}</span>
                                  ))}
                                </div>
                              </div>
                              {p.score !== null
                                ? <span className="text-lg font-black shrink-0 tabular-nums" style={{ color: '#059669' }}>{p.score}</span>
                                : <span className="text-[10px] font-semibold text-[#d97706] bg-[#d97706]/10 px-2 py-1 rounded-full shrink-0">Review</span>
                              }
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-[#172b44]/8">
                          <span className="text-xs text-[#3d5f80] font-medium">Share your portfolio</span>
                          <span className="text-[10px] font-bold text-[#2563eb] bg-[#2563eb]/10 px-3 py-1.5 rounded-full border border-[#2563eb]/15 cursor-pointer">Copy Link</span>
                        </div>
                      </div>
                    )}

                    {/* ── Mockup 3: Leaderboard ── */}
                    {activeFeature === 3 && (
                      <div className="space-y-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#d97706]/70">This Week</span>
                            <h3 className="text-xl font-bold text-foreground mt-0.5 tracking-tight">Global Leaderboard</h3>
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0 border border-[#f97316]/20"
                            style={{ background: 'rgba(249,115,22,0.08)' }}>
                            <span>🔥</span>
                            <span className="text-sm font-black text-[#f97316] tabular-nums">47</span>
                            <span className="text-[10px] text-[#f97316]/60 font-medium">day streak</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {[
                            { rank: 1, name: 'Sophia L.', xp: 4200, max: 4200, medal: '🥇', you: false },
                            { rank: 2, name: 'Marcus K.', xp: 3840, max: 4200, medal: '🥈', you: false },
                            { rank: 3, name: 'You 🔥',    xp: 3200, max: 4200, medal: '🥉', you: true  },
                            { rank: 4, name: 'Riya J.',   xp: 2990, max: 4200, medal: '',   you: false },
                            { rank: 5, name: 'James O.',  xp: 2640, max: 4200, medal: '',   you: false },
                          ].map(u => (
                            <div key={u.rank} className="px-3 py-2.5 rounded-xl"
                              style={{
                                background: u.you ? 'rgba(249,115,22,0.07)' : 'rgba(23,43,68,0.025)',
                                border: u.you ? '1px solid rgba(249,115,22,0.18)' : '1px solid transparent',
                              }}>
                              <div className="flex items-center gap-3 mb-1.5">
                                <span className="text-sm w-5 shrink-0 text-center">{u.medal || `#${u.rank}`}</span>
                                <span className="text-sm flex-1 font-medium"
                                  style={{ color: u.you ? '#f97316' : '#172b44', fontWeight: u.you ? 700 : 500 }}>
                                  {u.name}
                                </span>
                                <span className="text-xs font-bold tabular-nums shrink-0"
                                  style={{ color: u.you ? '#f97316' : '#3d5f80' }}>
                                  {u.xp.toLocaleString()} XP
                                </span>
                              </div>
                              <div className="h-1.5 rounded-full overflow-hidden ml-8" style={{ background: 'rgba(23,43,68,0.07)' }}>
                                <motion.div className="h-full rounded-full"
                                  style={{ background: u.you ? 'linear-gradient(90deg,#f97316,#fbbf24)' : 'linear-gradient(90deg,#93c5fd,#818cf8)' }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(u.xp / u.max) * 100}%` }}
                                  transition={{ duration: 0.7, delay: u.rank * 0.07, ease: 'easeOut' }} />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="text-center pt-1 border-t border-[#172b44]/8">
                          <span className="text-xs text-[#3d5f80]/60 font-medium">160 XP to reach rank #2 — keep going!</span>
                        </div>
                      </div>
                    )}

                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

          </div>
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
              <div className="h-px w-10 bg-card/50 " />
              <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#f97316]">Learner Stories</span>
              <div className="h-px w-10 bg-card/50 " />
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
              <div className="w-px h-4 bg-card/50 hidden sm:block" />
              <span className="text-white/50 text-sm">from 12,400+ reviews</span>
              <div className="w-px h-4 bg-card/50 hidden sm:block" />
              <span className="text-white/50 text-sm">95% would recommend</span>
            </div>
          </motion.div>

          {/* ── Testimonial cards grid ── */}
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {[
              {
                quote: "I uploaded my browser history and CourseHive instantly knew I was obsessed with machine learning videos. The roadmap it generated was exactly what I needed — I stopped jumping between random tutorials.",
                name: 'Marcus K.',
                role: 'ML Engineer',
                field: 'Machine Learning',
                init: 'MK',
                from: '#34d399', to: '#059669',
                stars: 5,
              },
              {
                quote: "The XP system and leaderboard made me actually look forward to studying. I went from zero to 3,200 XP in a month and built two real projects I could put on my resume.",
                name: 'Priya S.',
                role: 'Full Stack Developer',
                field: 'Web Development',
                init: 'PS',
                from: '#818cf8', to: '#6366f1',
                stars: 5,
              },
              {
                quote: "I had no idea what to learn next. CourseHive detected I was interested in data from my browsing history and built me a structured roadmap. Landed a data analyst role in 4 months.",
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
                <div className="h-px bg-card/50 mb-5" />

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
                  "I never thought browsing YouTube and Reddit would actually help my career. CourseHive read my history and built me a roadmap for product design. I finished every single course, earned 4,200 XP, and finally have projects I&apos;m proud to show."
                </p>
                <div className="flex items-center gap-4 pt-1">
                  <div className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg,#a78bfa,#7c3aed)' }}>
                    SL
                  </div>
                  <div>
                    <div className="text-white font-semibold">Sophia L.</div>
                    <div className="text-white/45 text-sm">Product Designer · Built 3 validated projects on CourseHive</div>
                  </div>
                </div>
              </div>

              {/* CTA side */}
              <div className="shrink-0 flex flex-col items-center sm:items-end gap-4 sm:pl-8 sm:border-l sm:border-border/">
                <p className="text-white/50 text-sm text-center sm:text-right max-w-40 leading-relaxed">
                  Join learners who turned curiosity into real skills
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
                className={`bg-card/50 backdrop-blur-md rounded-3xl p-10 shadow-2xl ${s.offset}`}
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
              <div className="h-px w-10 bg-card/50 " />
              <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#f97316]">Get Started Today</span>
              <div className="h-px w-10 bg-card/50 " />
            </div>

            {/* Headline */}
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight">
              Begin your <span className="font-light italic">learning</span>
              <br />journey today
            </h2>

            <p className="text-lg text-white/55 max-w-lg mx-auto leading-relaxed">
              Stop scrolling. Start learning. Upload your history, follow your roadmap, build real projects, and earn XP — all powered by AI.
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
              <div className="w-px h-8 bg-card/50 hidden sm:block" />
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
              <button className="inline-flex items-center gap-2 bg-card/50 hover:bg-card/50 text-white text-base font-semibold px-10 py-4 rounded-full border border-border/ transition-all hover:-translate-y-0.5 backdrop-blur-sm">
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
              <div className="mb-5">
                <BrandLogo href="/" width={172} height={50} className="rounded-lg border border-border/" />
              </div>
              <p className="text-sm text-white/40 leading-relaxed mb-6">
                Stop scrolling. Start learning. CourseHive turns your curiosity into a personalized roadmap — powered by AI, driven by you.
              </p>
              {/* Social icons */}
              <div className="flex gap-3">
                {['𝕏', 'in', 'gh'].map((s) => (
                  <a key={s} href="#"
                    className="w-8 h-8 rounded-lg bg-card/50 border border-border/ flex items-center justify-center text-white/50 hover:text-white hover:bg-card/50 transition-all text-[11px] font-bold">
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
          <div className="pt-8 border-t border-border/[0.07] flex flex-col sm:flex-row justify-between items-center gap-4">
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
