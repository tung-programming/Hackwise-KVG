'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Hexagon, Zap, Target, Sparkles, Menu, X } from 'lucide-react'
import { useTheme } from 'next-themes'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
}

const floatingVariants = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
}

export default function LandingPage() {
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-sm bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Hexagon className="w-5 h-5 text-accent-foreground" />
              </div>
              <span>CourseHive</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm hover:text-accent transition-colors">
                Features
              </a>
              <a href="#about" className="text-sm hover:text-accent transition-colors">
                About
              </a>
              <Link href="/login" className="text-sm hover:text-accent transition-colors">
                Sign In
              </Link>
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <Link href="/onboarding/field">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden pb-4 space-y-3"
            >
              <a href="#features" className="block text-sm hover:text-accent py-2">
                Features
              </a>
              <a href="#about" className="block text-sm hover:text-accent py-2">
                About
              </a>
              <Link href="/login" className="block text-sm hover:text-accent py-2">
                Sign In
              </Link>
              <Link href="/onboarding/field" className="block pt-2">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center space-y-8"
          >
            {/* Floating Hexagons Background */}
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="absolute right-10 top-20 w-20 h-20 opacity-10"
            >
              <Hexagon className="w-full h-full text-accent" />
            </motion.div>
            <motion.div
              variants={floatingVariants}
              animate="animate"
              transition={{ delay: 0.5 }}
              className="absolute left-10 bottom-20 w-16 h-16 opacity-10"
            >
              <Hexagon className="w-full h-full text-accent" />
            </motion.div>

            {/* Main Heading */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Learn What You <span className="text-accent">Love</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Personalized AI-powered learning platform with project-based growth and intelligent course roadmaps designed for your success.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/onboarding/field">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Start Learning Today
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline">
                  Explore Features
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-4 pt-8 max-w-2xl mx-auto"
            >
              <div className="space-y-1">
                <p className="text-2xl font-bold text-accent">50k+</p>
                <p className="text-xs text-muted-foreground">Active Learners</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-accent">200+</p>
                <p className="text-xs text-muted-foreground">Expert Courses</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-accent">95%</p>
                <p className="text-xs text-muted-foreground">Satisfaction</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold">Why Choose CourseHive?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to accelerate your learning journey
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Sparkles,
                  title: 'Personalized Learning',
                  description: 'AI-powered recommendations tailored to your goals, pace, and learning style.',
                },
                {
                  icon: Target,
                  title: 'Project-Based Growth',
                  description: 'Build real-world projects that strengthen your portfolio and practical skills.',
                },
                {
                  icon: Zap,
                  title: 'Intelligent Roadmaps',
                  description: 'Structured learning paths with clear milestones and progress tracking.',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-xl bg-card border border-border hover:border-accent/50 transition-colors space-y-3"
                >
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl font-bold">Built for Learners Like You</h2>
            <p className="text-lg text-muted-foreground">
              CourseHive combines cutting-edge AI technology with educational expertise to create a learning platform that adapts to your unique goals. Whether you&apos;re exploring a new field or mastering advanced concepts, we&apos;re here to guide you every step of the way.
            </p>
            <div className="flex justify-center pt-4">
              <Link href="/onboarding/field">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Begin Your Journey
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-secondary/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 font-bold mb-4">
                <Hexagon className="w-5 h-5 text-accent" />
                <span>CourseHive</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Personalized learning for everyone
              </p>
            </div>
            {[
              { title: 'Platform', links: ['Features', 'Pricing', 'Security'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers'] },
              { title: 'Resources', links: ['Help Center', 'Contact', 'Status'] },
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-semibold mb-4 text-sm">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border/40 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>Built by Team Hacktivists</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition-colors">Twitter</a>
              <a href="#" className="hover:text-accent transition-colors">GitHub</a>
              <a href="#" className="hover:text-accent transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
