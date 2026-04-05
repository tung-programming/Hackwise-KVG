'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  HelpCircle,
  BookOpen,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  Search,
  ChevronDown,
  ChevronUp,
  Video,
  FileText,
  Zap,
  Heart,
  Trophy,
  FolderOpen,
  Settings,
  User,
} from 'lucide-react'

const PRIMARY = '#172b44'
const ACCENT = '#f97316'

const fade = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }

const faqs = [
  {
    question: 'How do I get started with CourseHive?',
    answer: 'Simply select your interests from the Interests page, and our AI will generate personalized learning paths tailored to your goals. You can also upload your learning history for even more customized recommendations.',
  },
  {
    question: 'What is a learning roadmap?',
    answer: 'A learning roadmap is a structured path that guides you through courses, projects, and milestones to help you master a specific topic. Each roadmap is personalized based on your interests and learning history.',
  },
  {
    question: 'How does the AI recommendation work?',
    answer: 'Our AI analyzes your learning history, interests, and goals to recommend courses and projects that match your skill level and learning style. The more you use CourseHive, the better the recommendations become.',
  },
  {
    question: 'Can I track multiple learning paths at once?',
    answer: 'Yes! You can accept multiple interests and work on different learning paths simultaneously. Your progress is tracked separately for each path.',
  },
  {
    question: 'How do I earn points on the leaderboard?',
    answer: 'You earn points by completing courses, finishing projects, and maintaining learning streaks. The more consistent you are, the higher you\'ll rank!',
  },
  {
    question: 'Is my learning data private?',
    answer: 'Absolutely! Your learning history and personal data are encrypted and never shared with third parties. You have full control over your data and can delete it anytime.',
  },
  {
    question: 'Can I export my resume?',
    answer: 'Yes! Visit the Resume page to generate a professional resume based on your completed courses and projects. You can export it as PDF or JSON.',
  },
]

const quickLinks = [
  { icon: Heart, label: 'Browse Interests', description: 'Explore topics to learn', href: '/dashboard/interests' },
  { icon: BookOpen, label: 'View Courses', description: 'Access your learning paths', href: '/dashboard/courses' },
  { icon: FolderOpen, label: 'Your Projects', description: 'Track your projects', href: '/dashboard/projects' },
  { icon: Trophy, label: 'Leaderboard', description: 'See how you rank', href: '/dashboard/leaderboard' },
  { icon: User, label: 'Profile', description: 'Manage your profile', href: '/dashboard/profile' },
  { icon: Settings, label: 'Settings', description: 'Customize preferences', href: '/dashboard/settings' },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)

  const filteredFaqs = searchQuery
    ? faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs

  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6 max-w-5xl">
      
      {/* Header */}
      <motion.div variants={fade}>
        <h1 className="text-3xl font-extrabold tracking-tight mb-1" style={{ color: PRIMARY }}>
          Help Center
        </h1>
        <p className="text-muted-foreground text-sm">
          Get answers to common questions and learn how to use CourseHive
        </p>
      </motion.div>

      {/* Search FAQs */}
      <motion.div variants={fade} className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search help articles..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all text-sm"
            style={{ '--tw-ring-color': ACCENT } as React.CSSProperties}
          />
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div variants={fade}>
        <h2 className="text-xl font-bold mb-4" style={{ color: PRIMARY }}>Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <a
                key={link.label}
                href={link.href}
                className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border hover:border-orange-200 dark:hover:border-orange-900/30 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-0.5">{link.label}</p>
                  <p className="text-xs text-muted-foreground">{link.description}</p>
                </div>
              </a>
            )
          })}
        </div>
      </motion.div>

      {/* FAQs */}
      <motion.div variants={fade}>
        <h2 className="text-xl font-bold mb-4" style={{ color: PRIMARY }}>
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-8 text-center">
              <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No results found for &ldquo;{searchQuery}&rdquo;</p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isExpanded = expandedFaq === index
              return (
                <motion.div
                  key={index}
                  variants={fade}
                  className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setExpandedFaq(isExpanded ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0 mt-0.5">
                        <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="font-semibold text-sm pr-4">{faq.question}</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                  </button>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-5"
                    >
                      <div className="pl-11 pr-9">
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })
          )}
        </div>
      </motion.div>

      {/* Resources */}
      <motion.div variants={fade}>
        <h2 className="text-xl font-bold mb-4" style={{ color: PRIMARY }}>Learning Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-bold text-base mb-2">Video Tutorials</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Watch step-by-step guides on using CourseHive features
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all"
              style={{ color: ACCENT }}
            >
              Watch Now <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-base mb-2">Documentation</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Detailed guides and API documentation for developers
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all"
              style={{ color: ACCENT }}
            >
              Read Docs <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-bold text-base mb-2">Getting Started</h3>
            <p className="text-sm text-muted-foreground mb-4">
              New to CourseHive? Start with our beginner's guide
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all"
              style={{ color: ACCENT }}
            >
              Get Started <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Contact Support */}
      <motion.div variants={fade} className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4" style={{ color: PRIMARY }}>Still Need Help?</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Can't find what you're looking for? Our support team is here to help!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="mailto:support@coursehive.com"
            className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-sm text-blue-900 dark:text-blue-100">Email Us</p>
              <p className="text-xs text-blue-700 dark:text-blue-300">support@coursehive.com</p>
            </div>
          </a>

          <a
            href="#"
            className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/30 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-semibold text-sm text-green-900 dark:text-green-100">Live Chat</p>
              <p className="text-xs text-green-700 dark:text-green-300">Available 9am-5pm EST</p>
            </div>
          </a>

          <a
            href="tel:+1234567890"
            className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/30 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="font-semibold text-sm text-purple-900 dark:text-purple-100">Call Us</p>
              <p className="text-xs text-purple-700 dark:text-purple-300">+1 (234) 567-8900</p>
            </div>
          </a>
        </div>
      </motion.div>

      {/* Feedback */}
      <motion.div
        variants={fade}
        className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-2xl border border-orange-100 dark:border-orange-900/30 p-6 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-orange-900/50 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6" style={{ color: ACCENT }} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2" style={{ color: PRIMARY }}>
              Help Us Improve
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your feedback helps us make CourseHive better. Share your thoughts, suggestions, or report bugs.
            </p>
            <button
              className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              style={{ background: ACCENT }}
            >
              Send Feedback
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
