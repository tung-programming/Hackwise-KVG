'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Upload, X, CheckCircle2, Loader2, ArrowRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useHistoryUpload } from '@/hooks/use-api'

type UploadStep = 'idle' | 'uploading' | 'processing' | 'success' | 'error'

export function UploadHistoryModal() {
  const router = useRouter()
  const { modalOpen, setModalOpen, setUploadedHistory } = useAppStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<UploadStep>('idle')
  const [fileName, setFileName] = useState('')
  const [mounted, setMounted] = useState(false)
  const [interestsCount, setInterestsCount] = useState(0)
  
  const { upload, uploading, progress, error: uploadError } = useHistoryUpload()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isOpen = modalOpen.uploadHistory

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validExtensions = ['.json']
    const fileExt = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    
    if (!validExtensions.includes(fileExt)) {
      alert('Please upload a JSON file')
      return
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert('File size must be less than 5MB')
      return
    }

    setFileName(file.name)
    await handleUpload(file)
  }

  const handleUpload = async (file: File) => {
    setStep('uploading')

    try {
      // Start upload and poll for completion
      const interests = await upload(file)
      
      if (interests && interests.length > 0) {
        setInterestsCount(interests.length)
        setStep('success')
        setUploadedHistory(true)

        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })

        // Auto-redirect to interests page after showing success
        setTimeout(() => {
          handleReset()
          router.push('/dashboard/interests')
        }, 2000)
      } else if (interests && interests.length === 0) {
        // No interests found from history
        setStep('success')
        setUploadedHistory(true)
        setInterestsCount(0)
        
        setTimeout(() => {
          handleReset()
          router.push('/dashboard/interests')
        }, 2000)
      } else {
        // Upload failed
        setStep('error')
      }
    } catch (err) {
      console.error('Upload error:', err)
      setStep('error')
    }
  }

  // Update step based on progress
  useEffect(() => {
    if (progress.includes('Processing') || progress.includes('Analyzing')) {
      setStep('processing')
    }
  }, [progress])

  const handleReset = () => {
    setStep('idle')
    setFileName('')
    setInterestsCount(0)
    setModalOpen('uploadHistory', false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClose = () => {
    if (step !== 'success' && step !== 'uploading' && step !== 'processing') {
      setModalOpen('uploadHistory', false)
      setStep('idle')
      setFileName('')
    }
  }

  if (!mounted) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl p-6 space-y-6 shadow-xl">
              {/* Close Button */}
              {step !== 'success' && step !== 'uploading' && step !== 'processing' && (
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-1 hover:bg-white/80 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold" style={{ color: '#172b44' }}>Upload Your History</h2>
                  <p className="text-sm text-muted-foreground">
                    {step === 'success'
                      ? interestsCount > 0 
                        ? `Found ${interestsCount} interest${interestsCount > 1 ? 's' : ''} based on your history!`
                        : 'Your history has been processed. No matching interests found.'
                      : step === 'error'
                      ? 'Something went wrong. Please try again.'
                      : 'Upload a JSON history file to get personalized recommendations'}
                  </p>
              </div>

              {/* Content */}
              {step === 'idle' && (
                <div className="space-y-4">
                  {/* Upload Options */}
                  <div className="space-y-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-6 border-2 border-dashed rounded-xl hover:border-[#f97316]/50 hover:bg-[#f97316]/5 transition-colors flex flex-col items-center justify-center gap-3 cursor-pointer group"
                      style={{ borderColor: 'rgba(249,115,22,0.3)' }}
                    >
                      <div className="w-10 h-10 bg-[#f97316]/10 rounded-lg flex items-center justify-center group-hover:bg-[#f97316]/20 transition-colors">
                        <Upload className="w-5 h-5 text-[#f97316]" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-sm">Drag and drop your file</p>
                        <p className="text-xs text-muted-foreground">or click to browse</p>
                      </div>
                    </button>

                    <p className="text-xs text-muted-foreground text-center">
                      Supported format: JSON (Max 5MB)
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/30" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-white/90 text-muted-foreground">or</span>
                    </div>
                  </div>

                  {/* Browse Button */}
                  <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                    Browse Files
                  </Button>
                </div>
              )}

              {/* Uploading State */}
              {step === 'uploading' && (
                <div className="py-6 space-y-4">
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[#f97316] animate-spin" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-semibold" style={{ color: '#172b44' }}>Uploading file...</p>
                    <p className="text-sm text-muted-foreground">{fileName}</p>
                  </div>
                  <div className="w-full h-2 bg-white/80 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#f97316]"
                      initial={{ width: 0 }}
                      animate={{ width: '60%' }}
                      transition={{ duration: 2 }}
                    />
                  </div>
                </div>
              )}

              {/* Processing State */}
              {step === 'processing' && (
                <div className="py-6 space-y-4">
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[#f97316] animate-spin" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-semibold" style={{ color: '#172b44' }}>Analyzing with AI...</p>
                    <p className="text-sm text-muted-foreground">{progress || 'Finding interests based on your history'}</p>
                  </div>
                  <div className="w-full h-2 bg-white/80 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#f97316]"
                      initial={{ width: '60%' }}
                      animate={{ width: '95%' }}
                      transition={{ duration: 10 }}
                    />
                  </div>
                </div>
              )}

              {/* Error State */}
              {step === 'error' && (
                <div className="py-6 space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="flex justify-center"
                  >
                    <AlertCircle className="w-12 h-12 text-red-500" />
                  </motion.div>

                  <div className="text-center space-y-2">
                    <p className="font-semibold text-lg" style={{ color: '#172b44' }}>Upload Failed</p>
                    <p className="text-sm text-muted-foreground">
                      {uploadError || 'Something went wrong while processing your file.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      onClick={() => setStep('idle')} 
                      className="w-full bg-[#f97316] hover:bg-[#ea6c0a] text-white"
                    >
                      Try Again
                    </Button>
                    <Button variant="outline" onClick={handleReset} className="w-full">
                      Close
                    </Button>
                  </div>
                </div>
              )}

              {/* Success State */}
              {step === 'success' && (
                <div className="py-6 space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="flex justify-center"
                  >
                    <CheckCircle2 className="w-12 h-12 text-[#f97316]" />
                  </motion.div>

                  <div className="text-center space-y-2">
                    <p className="font-semibold text-lg" style={{ color: '#172b44' }}>Success!</p>
                    <p className="text-sm text-muted-foreground">
                      {interestsCount > 0 
                        ? `We found ${interestsCount} interest${interestsCount > 1 ? 's' : ''} for you. Check your recommendations.`
                        : 'Your history was processed but no matching interests were found for your field.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Link href="/dashboard/interests" className="block">
                      <Button className="w-full bg-[#f97316] hover:bg-[#ea6c0a] text-white gap-2">
                        View Interests
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" onClick={handleReset} className="w-full">
                      Close
                    </Button>
                  </div>
                </div>
              )}

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json,text/json"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
