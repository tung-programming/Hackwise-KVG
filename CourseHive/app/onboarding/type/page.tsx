'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { fieldTypes } from '@/lib/mock-data'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
}

export default function TypeSelectionPage() {
  const router = useRouter()
  const { field, type, setType } = useAppStore()
  const [selected, setSelected] = useState<string | null>(type)
  const [customOther, setCustomOther] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!field) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold">Please select a field first</p>
          <Button onClick={() => router.push('/onboarding/field')}>Go Back</Button>
        </div>
      </div>
    )
  }

  const types = fieldTypes[field as keyof typeof fieldTypes] || []

  const handleSelect = (typeId: string) => {
    setSelected(typeId)
    setShowCustom(false)
  }

  const handleCustom = () => {
    setShowCustom(true)
    setSelected('custom')
  }

  const handleContinue = () => {
    if (selected === 'custom' && customOther) {
      setType(customOther)
      router.push('/signup')
    } else if (selected && selected !== 'custom') {
      setType(selected)
      router.push('/signup')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background py-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-4xl space-y-12"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Choose Your Specialization</h1>
          <p className="text-muted-foreground text-lg">
            Select {field} specialization that interests you most
          </p>
        </motion.div>

        {/* Type Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
        >
          {types.map((t) => (
            <motion.button
              key={t}
              variants={itemVariants}
              onClick={() => handleSelect(t)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-32 ${
                selected === t
                  ? 'border-accent bg-accent/10'
                  : 'border-border/40 hover:border-accent/50 bg-card'
              }`}
            >
              <span className="font-semibold text-sm text-center">{t}</span>

              {/* Checkmark */}
              {selected === t && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-5 h-5 bg-accent rounded-full flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-accent-foreground" />
                </motion.div>
              )}
            </motion.button>
          ))}

          {/* Other Option */}
          <motion.button
            variants={itemVariants}
            onClick={handleCustom}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-32 ${
              selected === 'custom'
                ? 'border-accent bg-accent/10'
                : 'border-border/40 hover:border-accent/50 bg-card'
            }`}
          >
            <span className="font-semibold text-sm">Other</span>

            {/* Checkmark */}
            {selected === 'custom' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-5 h-5 bg-accent rounded-full flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-accent-foreground" />
              </motion.div>
            )}
          </motion.button>
        </motion.div>

        {/* Custom Input */}
        {showCustom && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <label className="text-sm font-semibold">Enter your specialization</label>
            <Input
              type="text"
              placeholder="e.g., Cybersecurity, DevOps, etc."
              value={customOther}
              onChange={(e) => setCustomOther(e.target.value)}
              className="h-12"
              autoFocus
            />
          </motion.div>
        )}

        {/* Continue Button */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-3"
        >
          <Button
            onClick={handleContinue}
            disabled={!selected || (selected === 'custom' && !customOther)}
            size="lg"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed h-12"
          >
            Continue
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => router.push('/onboarding/field')}
            className="w-full h-12"
          >
            Back
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
