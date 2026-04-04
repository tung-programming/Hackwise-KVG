'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Hexagon, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { setTokens, getCurrentUser } from '@/lib/auth'
import { useAppStore } from '@/lib/store'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setCurrentUser, clearOnboarding } = useAppStore()
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processing authentication...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract params from URL
        const accessToken = searchParams.get('access_token')
        const expiresIn = searchParams.get('expires_in')
        const needsOnboarding = searchParams.get('needs_onboarding')
        const error = searchParams.get('error')

        // Check for errors
        if (error) {
          setStatus('error')
          setMessage(error)
          return
        }

        // Validate required params
        if (!accessToken || !expiresIn) {
          setStatus('error')
          setMessage('Missing authentication tokens')
          return
        }

        // Store tokens
        setTokens({
          accessToken,
          expiresIn: parseInt(expiresIn),
        })

        setMessage('Fetching user profile...')

        // Get current user
        const user = await getCurrentUser()
        
        if (user) {
          // Update store with user info
          setCurrentUser({
            name: user.username || user.email,
            email: user.email,
            field: user.field || '',
            type: user.type || '',
          })
          
          // Clear onboarding state
          clearOnboarding()
        }

        setStatus('success')
        setMessage('Authentication successful!')

        // Redirect based on onboarding status
        setTimeout(() => {
          if (needsOnboarding === 'true') {
            router.push('/onboarding/username')
          } else {
            router.push('/dashboard')
          }
        }, 1000)

      } catch (error) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage('Authentication failed. Please try again.')
      }
    }

    handleCallback()
  }, [searchParams, router, setCurrentUser, clearOnboarding])

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ 
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        background: 'linear-gradient(180deg,#a8c8e8 0%,#c0d9f0 14%,#d8edf8 30%,#edf5fb 48%,#f3e9da 72%,#ecdcc8 100%)'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-xl shadow-black/5 border border-white/60 text-center max-w-md w-full mx-4"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-[#172b44] rounded-2xl flex items-center justify-center shadow-lg">
            <Hexagon className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Status Icon */}
        <div className="mb-6">
          {status === 'loading' && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-12 h-12 text-[#f97316] mx-auto" />
            </motion.div>
          )}
          {status === 'success' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            </motion.div>
          )}
          {status === 'error' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            </motion.div>
          )}
        </div>

        {/* Status Text */}
        <h1 className="text-2xl font-bold text-[#172b44] mb-2">
          {status === 'loading' && 'Signing you in...'}
          {status === 'success' && 'Welcome!'}
          {status === 'error' && 'Authentication Failed'}
        </h1>
        
        <p className="text-[#3d5f80]">
          {message}
        </p>

        {/* Retry button for errors */}
        {status === 'error' && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => router.push('/login')}
            className="mt-6 bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold py-3 px-6 rounded-xl transition-all hover:-translate-y-0.5"
          >
            Back to Login
          </motion.button>
        )}
      </motion.div>
    </div>
  )
}
