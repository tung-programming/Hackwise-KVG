'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { useAppStore } from '@/lib/store'

const fields = [
  { id: 'engineering', label: 'Engineering', emoji: '💻' },
  { id: 'law', label: 'Law', emoji: '⚖️' },
  { id: 'business', label: 'Business', emoji: '💼' },
  { id: 'medical', label: 'Medical', emoji: '🏥' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export default function FieldSelectionPage() {
  const router = useRouter()
  const { field, setField } = useAppStore()
  const [selected, setSelected] = useState<string | null>(field)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleSelect = (fieldId: string) => {
    setSelected(fieldId)
  }

  const handleContinue = () => {
    if (selected) {
      const selectedField = fields.find((f) => f.id === selected)
      if (selectedField) {
        setField(selectedField.label)
        router.push('/onboarding/type')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-2xl space-y-12"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Choose Your Field</h1>
          <p className="text-muted-foreground text-lg">
            Tell us what field you want to learn in to get personalized recommendations
          </p>
        </motion.div>

        {/* Field Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 gap-6"
        >
          {fields.map((f) => (
            <motion.button
              key={f.id}
              variants={itemVariants}
              onClick={() => handleSelect(f.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative p-8 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-4 min-h-40 ${
                selected === f.id
                  ? 'border-accent bg-accent/10'
                  : 'border-border/40 hover:border-accent/50 bg-card'
              }`}
            >
              <span className="text-5xl">{f.emoji}</span>
              <span className="font-semibold text-lg">{f.label}</span>

              {/* Checkmark */}
              {selected === f.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-6 h-6 bg-accent rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-accent-foreground" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Continue Button */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-3"
        >
          <Button
            onClick={handleContinue}
            disabled={!selected}
            size="lg"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed h-12"
          >
            Continue
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full h-12"
          >
            Skip for Now
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
