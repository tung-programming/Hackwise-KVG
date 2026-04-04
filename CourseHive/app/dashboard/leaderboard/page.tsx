'use client'

import { motion } from 'framer-motion'
import { Trophy, Medal } from 'lucide-react'
import { mockLeaderboard } from '@/lib/mock-data'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
}

const getMedalIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Medal className="w-5 h-5 text-yellow-500" />
    case 2:
      return <Medal className="w-5 h-5 text-gray-400" />
    case 3:
      return <Medal className="w-5 h-5 text-orange-600" />
    default:
      return null
  }
}

export default function LeaderboardPage() {
  const userRank = 8 // Mock current user rank

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
          <Trophy className="w-6 h-6 text-accent" />
          <h1 className="text-3xl sm:text-4xl font-bold">Leaderboard</h1>
        </div>
        <p className="text-muted-foreground">
          See how you stack up against other learners
        </p>
      </motion.div>

      {/* Your Rank Card */}
      <motion.div
        variants={itemVariants}
        className="bg-accent/10 border border-accent/30 rounded-2xl p-6 space-y-4"
      >
        <h3 className="font-semibold text-sm text-muted-foreground">YOUR CURRENT RANK</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-4xl font-bold">#8</p>
            <p className="text-muted-foreground">2,100 points</p>
          </div>
          <Trophy className="w-12 h-12 text-accent" />
        </div>
        <p className="text-sm text-muted-foreground">
          You need 750 more points to reach the top 5!
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        variants={itemVariants}
        className="flex gap-2 border-b border-border/40 overflow-x-auto"
      >
        {['All Time', 'This Month', 'This Week'].map((filter) => (
          <button
            key={filter}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
              filter === 'All Time'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {filter}
          </button>
        ))}
      </motion.div>

      {/* Leaderboard Table */}
      <motion.div
        variants={containerVariants}
        className="space-y-2"
      >
        {mockLeaderboard.map((entry, index) => {
          const isCurrentUser = entry.rank === userRank
          return (
            <motion.div
              key={entry.rank}
              variants={itemVariants}
              whileHover={!isCurrentUser ? { scale: 1.02 } : {}}
              className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                isCurrentUser
                  ? 'bg-accent/10 border border-accent/30'
                  : 'bg-card border border-border/40 hover:border-accent/30'
              }`}
            >
              {/* Rank */}
              <div className="flex items-center gap-3 min-w-12">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center font-bold text-sm">
                  {entry.rank}
                </div>
                {getMedalIcon(entry.rank)}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{entry.name}</h3>
                  {isCurrentUser && (
                    <span className="px-2 py-0.5 text-xs rounded bg-accent text-accent-foreground">
                      You
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{entry.field}</p>
              </div>

              {/* Streak */}
              <div className="text-center hidden sm:block">
                <p className="text-sm font-semibold">{entry.streak}</p>
                <p className="text-xs text-muted-foreground">day streak</p>
              </div>

              {/* Points */}
              <div className="text-right min-w-20">
                <p className="text-lg font-bold text-accent">{entry.points.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">pts</p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* CTA */}
      <motion.div
        variants={itemVariants}
        className="bg-card border border-border/50 rounded-2xl p-6 text-center space-y-3"
      >
        <h3 className="font-semibold">Keep climbing the ranks!</h3>
        <p className="text-sm text-muted-foreground">
          Complete courses and maintain your streak to earn more points
        </p>
      </motion.div>
    </motion.div>
  )
}
