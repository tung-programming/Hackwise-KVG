'use client'

import { motion } from 'framer-motion'
import { Flame, CheckCircle2, Loader2, FolderOpen, TrendingUp } from 'lucide-react'
import { AnalyticsCard } from '@/components/analytics-card'
import { mockAnalytics, mockTimeActivityData, mockProjectsData } from '@/lib/mock-data'
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

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

export default function DashboardPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s your learning overview</p>
      </motion.div>

      {/* Analytics Cards Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants}>
          <AnalyticsCard
            icon={Flame}
            title="Current Streak"
            value={mockAnalytics.streak}
            subtitle="days of learning"
            trend={{ value: 40, isPositive: true }}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <AnalyticsCard
            icon={CheckCircle2}
            title="Completed Courses"
            value={mockAnalytics.completedCourses}
            subtitle="total courses finished"
            trend={{ value: 20, isPositive: true }}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <AnalyticsCard
            icon={Loader2}
            title="Ongoing Interests"
            value={mockAnalytics.ongoingInterests}
            subtitle="active learning paths"
            trend={{ value: 15, isPositive: true }}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <AnalyticsCard
            icon={FolderOpen}
            title="Projects Completed"
            value={mockAnalytics.projectsCompleted}
            subtitle="hands-on projects"
            trend={{ value: 30, isPositive: true }}
          />
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <motion.div
        variants={containerVariants}
        className="grid lg:grid-cols-2 gap-6"
      >
        {/* Time Activity Chart */}
        <motion.div
          variants={itemVariants}
          className="bg-card border border-border/50 rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold">Time Activity</h2>
              <p className="text-sm text-muted-foreground">Learning hours per day</p>
            </div>
            <div className="flex gap-2">
              {['7d', '30d'].map((period) => (
                <button
                  key={period}
                  className="px-3 py-1 text-xs rounded-lg hover:bg-secondary transition-colors"
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockTimeActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'var(--color-foreground)' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-accent)"
                dot={{ fill: 'var(--color-accent)', r: 5 }}
                activeDot={{ r: 7 }}
                strokeWidth={2}
                name="Hours"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Projects Breakdown Chart */}
        <motion.div
          variants={itemVariants}
          className="bg-card border border-border/50 rounded-2xl p-6 space-y-4"
        >
          <div className="space-y-1">
            <h2 className="text-xl font-bold">Projects by Type</h2>
            <p className="text-sm text-muted-foreground">Distribution of completed projects</p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockProjectsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {mockProjectsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'var(--color-foreground)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        variants={itemVariants}
        className="bg-card border border-border/50 rounded-2xl p-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">You&apos;re on track!</h3>
            <p className="text-sm text-muted-foreground">
              Complete 3 more courses to reach your monthly goal
            </p>
          </div>
          <button className="px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg transition-colors font-medium">
            View Goal
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
