'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { FileText, Upload } from 'lucide-react'

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

export default function ResumePage() {
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
          <FileText className="w-6 h-6 text-accent" />
          <h1 className="text-3xl sm:text-4xl font-bold">Resume Analysis</h1>
        </div>
        <p className="text-muted-foreground">
          Get AI-powered insights on your resume and skills
        </p>
      </motion.div>

      {/* Empty State */}
      <motion.div
        variants={itemVariants}
        className="border-2 border-dashed border-border/40 rounded-2xl p-12 text-center space-y-4"
      >
        <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto">
          <Upload className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Upload Your Resume</h3>
          <p className="text-muted-foreground text-sm mt-2">
            Get personalized feedback and see skills gaps in your learning path
          </p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 mx-auto">
          <Upload className="w-4 h-4" />
          Upload Resume
        </Button>
      </motion.div>

      {/* Features */}
      <motion.div
        variants={containerVariants}
        className="grid md:grid-cols-3 gap-6"
      >
        {[
          { title: 'Skills Analysis', desc: 'Identify gaps in your current skills' },
          { title: 'Recommendations', desc: 'Get personalized course recommendations' },
          { title: 'Career Path', desc: 'Discover relevant career opportunities' },
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="bg-card border border-border/50 rounded-lg p-6 space-y-2"
          >
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
