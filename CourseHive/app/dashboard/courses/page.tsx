'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { BookOpen, MoreVertical } from 'lucide-react'
import { mockCourses } from '@/lib/mock-data'

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

export default function CoursesPage() {
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
          <BookOpen className="w-6 h-6 text-accent" />
          <h1 className="text-3xl sm:text-4xl font-bold">Your Courses</h1>
        </div>
        <p className="text-muted-foreground">
          Continue learning or enroll in new courses
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        variants={itemVariants}
        className="flex gap-2 border-b border-border/40"
      >
        {['All', 'In Progress', 'Completed'].map((filter) => (
          <button
            key={filter}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              filter === 'All'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {filter}
          </button>
        ))}
      </motion.div>

      {/* Courses Grid */}
      <motion.div
        variants={containerVariants}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {mockCourses.map((course) => (
          <motion.div
            key={course.id}
            variants={itemVariants}
            className="group bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-accent/30 transition-all hover:shadow-lg"
          >
            {/* Course Image */}
            <div className="relative h-40 overflow-hidden bg-secondary">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Course Info */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="font-bold text-lg">{course.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {course.instructor}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">{course.progress}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${course.progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    viewport={{ once: true }}
                    className="h-full bg-accent rounded-full"
                  />
                </div>
              </div>

              {/* Action Button */}
              <Button
                variant={course.progress === 100 ? 'outline' : 'default'}
                className={`w-full ${
                  course.progress === 100
                    ? ''
                    : 'bg-accent hover:bg-accent/90 text-accent-foreground'
                }`}
              >
                {course.progress === 100 ? 'Completed' : 'Continue Learning'}
              </Button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
