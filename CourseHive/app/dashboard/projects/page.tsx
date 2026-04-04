'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { FolderOpen, CheckCircle2, Clock } from 'lucide-react'
import { mockProjects } from '@/lib/mock-data'

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

export default function ProjectsPage() {
  const completedProjects = mockProjects.filter((p) => p.status === 'Completed')
  const inProgressProjects = mockProjects.filter((p) => p.status === 'In Progress')

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
          <FolderOpen className="w-6 h-6 text-accent" />
          <h1 className="text-3xl sm:text-4xl font-bold">Your Projects</h1>
        </div>
        <p className="text-muted-foreground">
          Build real-world projects to strengthen your portfolio
        </p>
      </motion.div>

      {/* In Progress Projects */}
      {inProgressProjects.length > 0 && (
        <motion.div variants={containerVariants} className="space-y-4">
          <h2 className="text-lg font-semibold">In Progress</h2>
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-4"
          >
            {inProgressProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="bg-card border border-border/50 rounded-2xl p-6 space-y-4 hover:border-accent/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-500" />
                      <h3 className="font-bold text-lg">{project.title}</h3>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 text-xs rounded-md bg-amber-100/50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200">
                        {project.difficulty}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-md bg-accent/10 text-accent">
                        {project.progress}% Complete
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${project.progress}%` }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                      className="h-full bg-accent rounded-full"
                    />
                  </div>
                </div>

                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  Continue Project
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Completed Projects */}
      {completedProjects.length > 0 && (
        <motion.div variants={containerVariants} className="space-y-4">
          <h2 className="text-lg font-semibold">Completed</h2>
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-4"
          >
            {completedProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="bg-card border border-border/50 rounded-2xl p-6 space-y-4 hover:border-accent/30 transition-colors opacity-75"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                      <h3 className="font-bold text-lg">{project.title}</h3>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 text-xs rounded-md bg-green-100/50 dark:bg-green-950/50 text-green-900 dark:text-green-200">
                        {project.difficulty}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-md bg-accent/10 text-accent">
                        Completed
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full w-full" />
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  View Certificate
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Empty State */}
      {mockProjects.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="text-center py-12 space-y-4"
        >
          <FolderOpen className="w-12 h-12 text-muted-foreground/30 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">No projects yet</h3>
            <p className="text-muted-foreground">
              Enroll in a course to start your first project
            </p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Explore Courses
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}
