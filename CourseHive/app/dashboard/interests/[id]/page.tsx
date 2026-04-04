'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2, Loader2, Lock } from 'lucide-react'
import { mockRoadmap } from '@/lib/mock-data'

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

export default function RoadmapPage({ params }: { params: { id: string } }) {
  // For now, use mockRoadmap. In production, fetch based on params.id
  const roadmap = mockRoadmap

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-accent" />
      case 'in-progress':
        return <Loader2 className="w-5 h-5 text-accent animate-spin" />
      default:
        return <Lock className="w-5 h-5 text-muted-foreground" />
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-4">
        <Link href="/dashboard/interests">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Interests
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">{roadmap.title}</h1>
          <p className="text-muted-foreground mt-2">
            Complete courses in sequence to master this field
          </p>
        </div>
      </motion.div>

      {/* Phases */}
      <motion.div variants={containerVariants} className="space-y-6">
        {roadmap.phases.map((phase, phaseIndex) => (
          <motion.div
            key={phase.phase}
            variants={itemVariants}
            className="space-y-4"
          >
            {/* Phase Header */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center font-bold text-accent">
                {phase.phase}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{phase.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {phase.courses.length} courses
                </p>
              </div>
            </div>

            {/* Courses */}
            <motion.div
              variants={containerVariants}
              className="grid md:grid-cols-2 gap-4 ml-14"
            >
              {phase.courses.map((course, courseIndex) => (
                <motion.div
                  key={course.id}
                  variants={itemVariants}
                  className={`border-2 rounded-xl p-6 space-y-4 transition-all ${
                    course.status === 'completed'
                      ? 'bg-accent/5 border-accent'
                      : course.status === 'in-progress'
                      ? 'bg-card border-accent/50'
                      : 'bg-card border-border/40 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(course.status)}
                        <h3 className="font-semibold">{course.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {course.duration}
                      </p>
                    </div>
                  </div>

                  {course.status !== 'todo' && (
                    <div className="text-xs font-semibold text-accent">
                      {course.status === 'completed' ? 'COMPLETED' : 'IN PROGRESS'}
                    </div>
                  )}

                  {course.status !== 'todo' && (
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={course.status === 'completed'}
                    >
                      {course.status === 'completed' ? 'Completed' : 'Continue Learning'}
                    </Button>
                  )}

                  {course.status === 'todo' && (
                    <Button variant="outline" className="w-full opacity-50" disabled>
                      Locked - Complete previous courses first
                    </Button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        variants={itemVariants}
        className="bg-accent/10 border border-accent/30 rounded-2xl p-8 text-center space-y-4"
      >
        <h3 className="text-xl font-bold">Ready to start learning?</h3>
        <p className="text-muted-foreground">
          Enroll in the first course to begin your learning journey
        </p>
        <Link href="/dashboard/courses">
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Explore Courses
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  )
}
