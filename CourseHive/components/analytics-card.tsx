'use client'

import { motion } from 'framer-motion'
import { LucideIcon, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react'

const PRIMARY = '#1a3d2c'

interface AnalyticsCardProps {
  icon: LucideIcon
  title: string
  value: string | number
  subtitle?: string
  trend?: { value: number; isPositive: boolean }
  variant?: 'primary' | 'default'
}

export function AnalyticsCard({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  variant = 'default',
}: AnalyticsCardProps) {
  const isPrimary = variant === 'primary'

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      viewport={{ once: true }}
      whileHover={{ y: -2, transition: { duration: 0.18 } }}
      className={`rounded-2xl p-5 border border-border/50 relative overflow-hidden cursor-default ${
        isPrimary ? '' : 'bg-card'
      }`}
      style={isPrimary ? { background: PRIMARY } : {}}
    >
      {/* Arrow out button */}
      <button
        className={`absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
          isPrimary ? 'bg-white/15 hover:bg-white/25' : 'bg-secondary hover:bg-secondary/80'
        }`}
      >
        <ArrowUpRight className={`w-3.5 h-3.5 ${isPrimary ? 'text-white' : 'text-muted-foreground'}`} />
      </button>

      <p className={`text-xs font-medium mt-1 ${isPrimary ? 'text-white/70' : 'text-muted-foreground'}`}>
        {title}
      </p>
      <p className={`text-3xl font-black mt-1 ${isPrimary ? 'text-white' : ''}`}>{value}</p>

      {subtitle && !trend && (
        <p className={`text-[10px] font-medium mt-3 ${isPrimary ? 'text-white/50' : 'text-muted-foreground'}`}>
          {subtitle}
        </p>
      )}

      {trend && (
        <div className="flex items-center gap-1 mt-3">
          {trend.isPositive
            ? <TrendingUp className={`w-3 h-3 ${isPrimary ? 'text-white/60' : 'text-emerald-600'}`} />
            : <TrendingDown className={`w-3 h-3 ${isPrimary ? 'text-white/60' : 'text-red-500'}`} />}
          <span className={`text-[10px] font-medium ${isPrimary ? 'text-white/60' : trend.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}% from last month
          </span>
        </div>
      )}
    </motion.div>
  )
}
