'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Upload, X, CheckCircle2, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

type UploadStep = 'idle' | 'uploading' | 'processing' | 'success'

export function UploadHistoryModal() {
  const { modalOpen, setModalOpen, setUploadedHistory } = useAppStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<UploadStep>('idle')
  const [fileName, setFileName] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isOpen = modalOpen.uploadHistory

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    const validTypes = ['text/csv', 'application/json']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
      alert('Please upload a CSV or JSON file')
      return
    }

    if (file.size > maxSize) {
      alert('File size must be less than 5MB')
      return
    }

    setFileName(file.name)
    simulateUpload()
  }

  const simulateUpload = () => {
    setStep('uploading')

    // Simulate upload
    setTimeout(() => {
      setStep('processing')

      // Simulate processing
      setTimeout(() => {
        setStep('success')
        setUploadedHistory(true)

        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }, 1500)
    }, 1500)
  }

  const handleReset = () => {
    setStep('idle')
    setFileName('')
    setModalOpen('uploadHistory', false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClose = () => {
    if (step !== 'success') {
      setModalOpen('uploadHistory', false)
      setStep('idle')
      setFileName('')
    }
  }

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
            <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
              {/* Close Button */}
              {step !== 'success' && (
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-1 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Upload Your History</h2>
                <p className="text-sm text-muted-foreground">
                  {step === 'success'
                    ? 'Your history has been processed successfully!'
                    : 'Upload a CSV or JSON file to get personalized recommendations'}
                </p>
              </div>

              {/* Content */}
              {step === 'idle' && (
                <div className="space-y-4">
                  {/* Upload Options */}
                  <div className="space-y-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-6 border-2 border-dashed border-border rounded-xl hover:border-accent/50 hover:bg-accent/5 transition-colors flex flex-col items-center justify-center gap-3 cursor-pointer group"
                    >
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <Upload className="w-5 h-5 text-accent" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-sm">Drag and drop your file</p>
                        <p className="text-xs text-muted-foreground">or click to browse</p>
                      </div>
                    </button>

                    <p className="text-xs text-muted-foreground text-center">
                      Supported formats: CSV, JSON (Max 5MB)
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/40" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-card text-muted-foreground">or</span>
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
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-semibold">Uploading file...</p>
                    <p className="text-sm text-muted-foreground">{fileName}</p>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.5 }}
                    />
                  </div>
                </div>
              )}

              {/* Processing State */}
              {step === 'processing' && (
                <div className="py-6 space-y-4">
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-semibold">Processing your data...</p>
                    <p className="text-sm text-muted-foreground">Analyzing learning patterns</p>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.5 }}
                    />
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
                    <CheckCircle2 className="w-12 h-12 text-accent" />
                  </motion.div>

                  <div className="text-center space-y-2">
                    <p className="font-semibold text-lg">Success!</p>
                    <p className="text-sm text-muted-foreground">
                      Your learning history has been analyzed. Check your recommendations.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Link href="/dashboard/interests" className="block">
                      <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
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
                accept=".csv,.json"
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
