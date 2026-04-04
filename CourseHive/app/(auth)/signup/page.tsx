'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Github, Hexagon, ArrowRight, Sparkles, Loader2 } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { getGoogleAuthUrl, getGithubAuthUrl, isAuthenticated } from '@/lib/auth'

function Cloud({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 320 100" className={className} style={style} xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <circle cx="80" cy="72" r="52" />
      <circle cx="140" cy="58" r="58" />
      <circle cx="205" cy="68" r="48" />
      <circle cx="252" cy="76" r="42" />
      <rect x="38" y="72" width="256" height="28" />
    </svg>
  )
}

const particles = [
  { x: 12, y: 18, size: 3, dur: 3.8, delay: 0.2 },
  { x: 28, y: 32, size: 2, dur: 4.0, delay: 0.7 },
  { x: 72, y: 15, size: 3, dur: 3.5, delay: 0.1 },
  { x: 85, y: 28, size: 2, dur: 4.3, delay: 0.9 },
  { x: 50, y: 10, size: 2, dur: 3.4, delay: 1.3 },
]

export default function SignupPage() {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState<'google' | 'github' | null>(null)
  const { field, type } = useAppStore()
  const router = useRouter()
  
  // Show only GitHub for Engineering, only Google for other fields
  const isEngineering = field === 'Engineering'

  useEffect(() => { 
    setMounted(true) 
    // Redirect if already authenticated
    if (isAuthenticated()) {
      router.push('/dashboard')
    }
  }, [router])
  
  if (!mounted) return null

  const handleGoogleSignup = () => {
    setIsLoading('google')
    const redirectUrl = typeof window !== 'undefined' ? window.location.origin : ''
    window.location.href = getGoogleAuthUrl(field || undefined, type || undefined, redirectUrl)
  }

  const handleGithubSignup = () => {
    setIsLoading('github')
    const redirectUrl = typeof window !== 'undefined' ? window.location.origin : ''
    window.location.href = getGithubAuthUrl(field || undefined, type || undefined, redirectUrl)
  }

  return (
    <div 
      className="min-h-screen flex flex-col overflow-hidden"
      style={{ 
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        background: 'linear-gradient(180deg,#a8c8e8 0%,#c0d9f0 14%,#d8edf8 30%,#edf5fb 48%,#f3e9da 72%,#ecdcc8 100%)'
      }}
    >
      {/* Floating particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/60 pointer-events-none"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ opacity: [0.25, 0.75, 0.25], y: [0, -12, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* Navbar */}
      <nav className="relative z-50 px-6 lg:px-14 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#172b44] rounded-xl flex items-center justify-center shadow-md">
              <Hexagon className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[#172b44] text-lg tracking-tight">CourseHive</span>
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-xl shadow-black/5 border border-white/60">
            
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex justify-center mb-6"
            >
              <span className="inline-flex items-center gap-2 bg-[#f97316]/10 text-[#ea6c0a] text-xs font-semibold px-4 py-2 rounded-full border border-[#f97316]/20">
                <Sparkles className="w-3.5 h-3.5" />
                Join 50k+ learners
              </span>
            </motion.div>

            {/* Header */}
            <div className="text-center mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="text-3xl sm:text-4xl font-extrabold text-[#172b44] tracking-tight mb-3"
              >
                Create Account
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="text-[#3d5f80] text-base"
              >
                Start your personalized learning journey today
              </motion.p>
            </div>

            {/* Auth Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="space-y-3"
            >
              {/* Show Google signup only for non-Engineering fields */}
              {!isEngineering && (
                <button 
                  onClick={handleGoogleSignup}
                  disabled={isLoading !== null}
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-[#172b44] font-semibold py-4 px-5 rounded-2xl border border-[#172b44]/10 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading === 'google' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  <span>{isLoading === 'google' ? 'Signing up...' : 'Sign up with Google'}</span>
                </button>
              )}
              
              {/* Show GitHub signup only for Engineering field */}
              {isEngineering && (
                <button 
                  onClick={handleGithubSignup}
                  disabled={isLoading !== null}
                  className="w-full flex items-center justify-center gap-3 bg-[#172b44] hover:bg-[#1e3a5f] text-white font-semibold py-4 px-5 rounded-2xl shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading === 'github' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Github className="w-5 h-5" />
                  )}
                  <span>{isLoading === 'github' ? 'Signing up...' : 'Sign up with GitHub'}</span>
                </button>
              )}
            </motion.div>

            {/* Divider */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="flex items-center gap-4 my-8"
            >
              <div className="flex-1 h-px bg-[#172b44]/10" />
              <span className="text-sm text-[#3d5f80] font-medium">or</span>
              <div className="flex-1 h-px bg-[#172b44]/10" />
            </motion.div>

            {/* Sign In Link */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="text-center"
            >
              <p className="text-[#3d5f80] mb-4">
                Already have an account?
              </p>
              <Link href="/login">
                <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#172b44] font-semibold py-4 px-5 rounded-2xl border-2 border-[#172b44]/15 transition-all hover:-translate-y-0.5 hover:border-[#172b44]/30">
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Footer text */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="text-center text-sm text-[#3d5f80]/80 mt-6"
          >
            By signing up, you agree to our{' '}
            <a href="#" className="text-[#172b44] hover:underline">Terms</a>
            {' '}and{' '}
            <a href="#" className="text-[#172b44] hover:underline">Privacy Policy</a>
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom clouds */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none overflow-hidden z-0">
        <Cloud style={{ position: 'absolute', width: 380, height: 'auto', bottom: -20, left: '-2%', color: '#efe3d0', opacity: 0.85 }} />
        <Cloud style={{ position: 'absolute', width: 420, height: 'auto', bottom: 5, left: '25%', color: '#f5e8d8', opacity: 0.7 }} />
        <Cloud style={{ position: 'absolute', width: 360, height: 'auto', bottom: -15, right: '15%', color: '#ecdcc8', opacity: 0.9 }} />
        <Cloud style={{ position: 'absolute', width: 340, height: 'auto', bottom: -18, right: '-3%', color: '#f3e9da', opacity: 0.75 }} />
      </div>
    </div>
  )
}
