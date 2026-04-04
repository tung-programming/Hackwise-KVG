'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { User, Mail, BookOpen, Award, Calendar } from 'lucide-react'
import { mockUserProfile } from '@/lib/mock-data'

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

export default function ProfilePage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 max-w-2xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="flex items-center gap-2">
          <User className="w-6 h-6 text-accent" />
          <h1 className="text-3xl sm:text-4xl font-bold">Your Profile</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your account and learning preferences
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        variants={itemVariants}
        className="bg-card border border-border/50 rounded-2xl p-8 space-y-8"
      >
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
            <User className="w-10 h-10 text-accent" />
          </div>
          <div className="flex-1 space-y-2">
            <h2 className="text-2xl font-bold">{mockUserProfile.name}</h2>
            <p className="text-muted-foreground text-sm">
              {mockUserProfile.field} • {mockUserProfile.type}
            </p>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </div>

        {/* Divider */}
        <div className="border-t border-border/40" />

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <motion.div variants={containerVariants} className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase">
              Basic Information
            </h3>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Name</label>
              <div className="px-4 py-3 bg-secondary/50 rounded-lg text-sm">
                {mockUserProfile.name}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <div className="px-4 py-3 bg-secondary/50 rounded-lg text-sm flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {mockUserProfile.email}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Member Since</label>
              <div className="px-4 py-3 bg-secondary/50 rounded-lg text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(mockUserProfile.joinDate).toLocaleDateString()}
              </div>
            </motion.div>
          </motion.div>

          {/* Learning Info */}
          <motion.div variants={containerVariants} className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase">
              Learning Stats
            </h3>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Field</label>
              <div className="px-4 py-3 bg-secondary/50 rounded-lg text-sm">
                {mockUserProfile.field}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Specialization</label>
              <div className="px-4 py-3 bg-secondary/50 rounded-lg text-sm">
                {mockUserProfile.type}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Total Points</label>
              <div className="px-4 py-3 bg-accent/10 rounded-lg text-sm font-semibold text-accent">
                {mockUserProfile.totalPoints.toLocaleString()}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/40" />

        {/* Stats Section */}
        <motion.div variants={containerVariants} className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase">
            Achievement Summary
          </h3>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-3 gap-4"
          >
            <motion.div
              variants={itemVariants}
              className="bg-secondary/50 rounded-lg p-4 text-center space-y-2"
            >
              <p className="text-2xl font-bold text-accent">
                {mockUserProfile.completedCourses}
              </p>
              <p className="text-xs text-muted-foreground">Courses Completed</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-secondary/50 rounded-lg p-4 text-center space-y-2"
            >
              <p className="text-2xl font-bold text-accent">
                {mockUserProfile.certificatesEarned}
              </p>
              <p className="text-xs text-muted-foreground">Certificates</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-secondary/50 rounded-lg p-4 text-center space-y-2"
            >
              <p className="text-2xl font-bold text-accent">8</p>
              <p className="text-xs text-muted-foreground">Leaderboard Rank</p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-border/40" />

        {/* Actions */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase">
            Account Settings
          </h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
            <Button variant="outline" className="w-full">
              Download My Data
            </Button>
            <Button
              variant="outline"
              className="w-full text-red-600 hover:text-red-700"
            >
              Delete Account
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
