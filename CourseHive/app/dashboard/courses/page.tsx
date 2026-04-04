'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Plus, Download, MoreHorizontal, ArrowUpRight, Clock, Users, CheckCircle2 } from 'lucide-react'
import { mockCourses } from '@/lib/mock-data'

const PRIMARY = '#1a3d2c'
type Filter = 'All' | 'In Progress' | 'Completed'

const fade = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } }
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }

export default function CoursesPage() {
  const [filter, setFilter] = useState<Filter>('All')

  const filtered = mockCourses.filter((c) => {
    if (filter === 'In Progress') return c.progress > 0 && c.progress < 100
    if (filter === 'Completed') return c.progress === 100
    return true
  })

  const stats = [
    { label: 'Total Enrolled', value: mockCourses.length },
    { label: 'In Progress', value: mockCourses.filter(c => c.progress > 0 && c.progress < 100).length },
    { label: 'Completed', value: mockCourses.filter(c => c.progress === 100).length },
  ]

  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6">

      {/* Header */}
      <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Courses</h1>
          <p className="text-muted-foreground text-sm mt-1">Continue learning or enroll in new courses</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-colors"
            style={{ background: PRIMARY }}
          >
            <Plus className="w-4 h-4" /> Enroll Course
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-border hover:bg-secondary transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </motion.div>

      {/* Stat strip */}
      <motion.div variants={stagger} className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value }, i) => (
          <motion.div
            key={label}
            variants={fade}
            className={`rounded-2xl p-5 border border-border/50 ${i === 0 ? 'text-white' : 'bg-card'}`}
            style={i === 0 ? { background: PRIMARY } : {}}
          >
            {i !== 0 && (
              <button className="float-right w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
            <p className={`text-xs font-medium ${i === 0 ? 'text-white/70' : 'text-muted-foreground'}`}>{label}</p>
            <p className={`text-3xl font-black mt-1 ${i === 0 ? 'text-white' : ''}`}>{value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Filter tabs */}
      <motion.div variants={fade} className="flex gap-1 bg-secondary/40 p-1 rounded-xl w-fit">
        {(['All', 'In Progress', 'Completed'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              filter === f ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* Grid */}
      <motion.div variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((course) => {
          const done = course.progress === 100
          return (
            <motion.div
              key={course.id}
              variants={fade}
              whileHover={{ y: -3, transition: { duration: 0.18 } }}
              className="bg-card border border-border/50 rounded-2xl overflow-hidden group"
            >
              {/* Thumbnail */}
              <div className="relative h-44 bg-secondary overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                <button className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-sm leading-snug">{course.title}</h3>
                  <div className="flex items-center gap-1.5 mt-1.5 text-muted-foreground text-xs">
                    <Users className="w-3.5 h-3.5" />
                    <span>{course.instructor}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-bold" style={{ color: done ? '#059669' : PRIMARY }}>{course.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${course.progress}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      viewport={{ once: true }}
                      className="h-full rounded-full"
                      style={{ background: done ? '#059669' : PRIMARY }}
                    />
                  </div>
                </div>

                <button
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  style={
                    done
                      ? { background: '#f0fdf4', color: '#059669', border: '1px solid #bbf7d0' }
                      : { background: PRIMARY + '15', color: PRIMARY, border: `1px solid ${PRIMARY}30` }
                  }
                >
                  {done ? <><CheckCircle2 className="w-4 h-4" /> Certificate</> : <><Clock className="w-4 h-4" /> Continue</>}
                </button>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
