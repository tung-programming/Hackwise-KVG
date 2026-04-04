'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface AnalyticsCardProps {
  icon: LucideIcon
  title: string
  value: string | number
  subtitle?: string
  trend?: { value: number; isPositive: boolean }
}

export function AnalyticsCard({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
}: AnalyticsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-card border border-border/50 rounded-2xl p-6 space-y-4 hover:border-accent/30 transition-colors"
    >
      {/* Icon */}
      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
        <Icon className="w-6 h-6 text-accent" />
      </div>

      {/* Content */}
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl sm:text-3xl font-bold">{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {/* Trend */}
      {trend && (
        <div className={`text-sm font-semibold ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {trend.isPositive ? '+' : ''}{trend.value}%
        </div>
      )}
    </motion.div>
  )
}
