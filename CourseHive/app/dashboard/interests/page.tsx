'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Heart, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'
import { mockInterests } from '@/lib/mock-data'
import { useAppStore } from '@/lib/store'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function InterestsPage() {
  const { interests, addInterest, updateInterest, uploadedHistory } = useAppStore()
  const [mounted, setMounted] = useState(false)
  const [localInterests, setLocalInterests] = useState(mockInterests)

  useEffect(() => {
    setMounted(true)
    // Initialize interests if not already set
    if (interests.length === 0) {
      const initialInterests = mockInterests.map((interest) => ({
        id: interest.id,
        name: interest.name,
        status: 'pending' as const,
      }))
      initialInterests.forEach((interest) => {
        addInterest(interest)
      })
    }
  }, [])

  if (!mounted) return null

  const handleAccept = (interestId: string) => {
    updateInterest(interestId, 'accepted')
  }

  const handleReject = (interestId: string) => {
    updateInterest(interestId, 'rejected')
  }

  const acceptedInterests = interests.filter((i) => i.status === 'accepted')
  const pendingInterests = interests.filter((i) => i.status === 'pending')

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-accent" />
          <h1 className="text-3xl sm:text-4xl font-bold">Your Interests</h1>
        </div>
        <p className="text-muted-foreground">
          {uploadedHistory
            ? 'Based on your learning history'
            : 'Select areas that interest you to get personalized recommendations'}
        </p>
      </motion.div>

      {/* Empty State */}
      {interests.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="text-center py-12 space-y-4"
        >
          <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">No interests yet</h3>
            <p className="text-muted-foreground">
              {uploadedHistory
                ? 'Upload your learning history to get personalized interests'
                : 'Start by exploring recommended interests below'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Accepted Interests */}
      {acceptedInterests.length > 0 && (
        <motion.div variants={containerVariants} className="space-y-4">
          <h2 className="text-lg font-semibold">Your Learning Paths</h2>
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-4"
          >
            {acceptedInterests.map((interest) => {
              const details = mockInterests.find((m) => m.id === interest.id)
              return (
                <motion.div
                  key={interest.id}
                  variants={itemVariants}
                  className="bg-card border border-border/50 rounded-2xl p-6 space-y-4 hover:border-accent/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-accent" />
                        <h3 className="font-semibold text-lg">{interest.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {details?.description}
                      </p>
                    </div>
                  </div>

                  <Link href={`/dashboard/interests/${interest.id}`} className="block">
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                    >
                      View Roadmap
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      )}

      {/* Pending Interests */}
      {pendingInterests.length > 0 && (
        <motion.div variants={containerVariants} className="space-y-4">
          <h2 className="text-lg font-semibold">Recommended for You</h2>
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-4"
          >
            {pendingInterests.map((interest) => {
              const details = mockInterests.find((m) => m.id === interest.id)
              const Icon = details ? (require('lucide-react')[details.icon] || Heart) : Heart
              return (
                <motion.div
                  key={interest.id}
                  variants={itemVariants}
                  className="bg-card border border-border/50 rounded-2xl p-6 space-y-4 hover:border-accent/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-accent" />
                        </div>
                        <h3 className="font-semibold text-lg">{interest.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {details?.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAccept(interest.id)}
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      Interested
                    </Button>
                    <Button
                      onClick={() => handleReject(interest.id)}
                      variant="outline"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
