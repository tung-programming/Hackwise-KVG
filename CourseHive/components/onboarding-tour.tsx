'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface OnboardingTourProps {
  onComplete: () => void
  onOpenUpload?: () => void
}

const STEPS = [
  {
    target: '[data-tour="upload-history"]',
    title: "Upload your history",
    description: "Start here — drop your browsing history and we'll discover what you're curious about.",
    position: "bottom" as const,
  },
  {
    target: '[data-tour="interests"]',
    title: "Your interests",
    description: "AI-recommended topics appear here. Accept the ones you want to learn.",
    position: "right" as const,
  },
  {
    target: '[data-tour="courses"]',
    title: "Course roadmaps",
    description: "Each interest becomes a step-by-step learning path with free resources.",
    position: "right" as const,
  },
  {
    target: '[data-tour="projects"]',
    title: "Build projects",
    description: "Complete all courses to unlock a hands-on project. AI validates your submission.",
    position: "right" as const,
  },
  {
    target: '[data-tour="leaderboard"]',
    title: "Climb the leaderboard",
    description: "Earn XP from courses and projects. Compete with learners in your field.",
    position: "right" as const,
  },
  {
    target: '[data-tour="search"]',
    title: "Quick search",
    description: "Find any course, project, or resource instantly. Press ⌘F for keyboard shortcut.",
    position: "bottom" as const,
  },
  {
    target: '[data-tour="theme-toggle"]',
    title: "Dark mode",
    description: "Switch between light and dark themes for comfortable studying day or night.",
    position: "bottom" as const,
  },
  {
    target: '[data-tour="notifications"]',
    title: "Stay notified",
    description: "Get alerts when you level up, unlock projects, or receive achievement badges.",
    position: "bottom" as const,
  },
  {
    target: '[data-tour="resume"]',
    title: "ATS resume checker",
    description: "Upload your resume and get AI-powered feedback to beat applicant tracking systems.",
    position: "right" as const,
  },
  {
    target: '[data-tour="profile"]',
    title: "Your profile",
    description: "Track your progress, view achievements, and customize your learning journey.",
    position: "bottom" as const,
  },
]

export default function OnboardingTour({ onComplete, onOpenUpload }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [mounted, setMounted] = useState(false)

  const step = STEPS[currentStep]
  const isLastStep = currentStep === STEPS.length - 1

  const updateTargetRect = useCallback(() => {
    if (currentStep >= STEPS.length) {
      onComplete()
      return
    }
    
    const target = document.querySelector(STEPS[currentStep].target)
    if (target) {
      setTargetRect(target.getBoundingClientRect())
    } else {
      // Auto-skip if target not found
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(prev => prev + 1)
      } else {
        onComplete()
      }
    }
  }, [currentStep, onComplete])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    updateTargetRect()
  }, [mounted, currentStep, updateTargetRect])

  // Resize and scroll listeners
  useEffect(() => {
    if (!mounted) return

    const handleResize = () => updateTargetRect()
    const handleScroll = () => updateTargetRect()

    window.addEventListener('resize', handleResize)
    
    // Listen to scroll on main content area
    const mainContent = document.querySelector('main')
    mainContent?.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('resize', handleResize)
      mainContent?.removeEventListener('scroll', handleScroll)
    }
  }, [mounted, updateTargetRect])

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onComplete()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onComplete])

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
      onOpenUpload?.()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  if (!mounted || !targetRect) return null

  // Calculate tooltip position
  const getTooltipPosition = () => {
    const cardWidth = 300
    const cardHeight = 180 // approximate
    const padding = 16

    let top: number
    let left: number
    let actualPosition = step.position

    if (step.position === 'right') {
      // Check if it would overflow right edge
      if (targetRect.right + padding + cardWidth > window.innerWidth) {
        actualPosition = 'bottom'
      }
    }

    if (actualPosition === 'bottom') {
      top = targetRect.bottom + padding
      left = targetRect.left + targetRect.width / 2 - cardWidth / 2

      // Prevent overflow on sides
      if (left < padding) left = padding
      if (left + cardWidth > window.innerWidth - padding) {
        left = window.innerWidth - cardWidth - padding
      }
    } else {
      // right
      top = targetRect.top + targetRect.height / 2 - cardHeight / 2
      left = targetRect.right + padding
    }

    return { top, left, actualPosition }
  }

  const { top: tooltipTop, left: tooltipLeft, actualPosition } = getTooltipPosition()

  const overlay = (
    <div 
      className="fixed inset-0 z-[9999]"
      style={{ pointerEvents: 'none' }}
    >
      {/* Layer 1 — Backdrop with cutout */}
      <svg
        className="fixed inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      >
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect
              x={targetRect.left - 8}
              y={targetRect.top - 8}
              width={targetRect.width + 16}
              height={targetRect.height + 16}
              rx="12"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="black"
          opacity="0.6"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* Layer 2 — Pulsing ring */}
      <div
        className="absolute border-2 rounded-xl transition-all duration-300 ease-in-out"
        style={{
          top: targetRect.top - 8,
          left: targetRect.left - 8,
          width: targetRect.width + 16,
          height: targetRect.height + 16,
          borderColor: 'hsl(var(--primary))',
          animation: 'pulse-ring 1.5s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Layer 3 — Tooltip card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute bg-card border border-border rounded-xl shadow-xl p-4 w-[300px]"
          style={{
            top: tooltipTop,
            left: tooltipLeft,
            pointerEvents: 'auto',
          }}
        >
          {/* Arrow */}
          {actualPosition === 'bottom' && (
            <div
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderBottom: '8px solid hsl(var(--border))',
              }}
            />
          )}
          {actualPosition === 'right' && (
            <div
              className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0"
              style={{
                borderTop: '8px solid transparent',
                borderBottom: '8px solid transparent',
                borderRight: '8px solid hsl(var(--border))',
              }}
            />
          )}

          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx === currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Title */}
          <p className="font-semibold text-sm text-foreground mt-3">{step.title}</p>

          {/* Description */}
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{step.description}</p>

          {/* Button row */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handleSkip}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip tour
            </button>
            <button
              onClick={handleNext}
              className="bg-primary text-primary-foreground text-sm font-medium px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity"
            >
              {isLastStep ? 'Get started' : 'Next'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pulse ring animation styles */}
      <style jsx global>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.06); opacity: 0.4; }
          100% { transform: scale(1); opacity: 0.8; }
        }
      `}</style>
    </div>
  )

  return createPortal(overlay, document.body)
}