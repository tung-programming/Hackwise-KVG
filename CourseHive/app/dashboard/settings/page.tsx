'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  Mail,
  Shield,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  ChevronRight,
} from 'lucide-react'

const PRIMARY = 'var(--primary)'
const ACCENT = 'var(--accent)'

const fade = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [language, setLanguage] = useState('English')
  const [timezone, setTimezone] = useState('UTC-5 (Eastern Time)')

  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6 max-w-5xl">
      
      {/* Header */}
      <motion.div variants={fade}>
        <h1 className="text-3xl font-extrabold tracking-tight mb-1" style={{ color: PRIMARY }}>
          Settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your account settings and preferences
        </p>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={fade} className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg--900/20 dark:bg-purple-950/30 flex items-center justify-center">
            <Bell className="w-5 h-5 text-purple-600 dark:text--400 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: PRIMARY }}>Notifications</h2>
            <p className="text-xs text-muted-foreground">Configure how you receive updates</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-semibold text-sm">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Receive updates via email</p>
              </div>
            </div>
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                emailNotifications ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-card transition-transform ${
                  emailNotifications ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-semibold text-sm">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Receive push notifications on your device</p>
              </div>
            </div>
            <button
              onClick={() => setPushNotifications(!pushNotifications)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                pushNotifications ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-card transition-transform ${
                  pushNotifications ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-semibold text-sm">Weekly Digest</p>
                <p className="text-xs text-muted-foreground">Get a summary every Monday</p>
              </div>
            </div>
            <button
              onClick={() => setWeeklyDigest(!weeklyDigest)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                weeklyDigest ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-card transition-transform ${
                  weeklyDigest ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div variants={fade} className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg--900/20 dark:bg-orange-950/30 flex items-center justify-center">
            <Palette className="w-5 h-5 text-orange-600 dark:text--400 dark:text-orange-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: PRIMARY }}>Appearance</h2>
            <p className="text-xs text-muted-foreground">Customize how CourseHive looks</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-3 text-foreground">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-orange-500 bg-orange-50 dark:bg--900/20 dark:bg-orange-950/20">
                <Sun className="w-6 h-6" style={{ color: ACCENT }} />
                <span className="text-xs font-semibold" style={{ color: ACCENT }}>Light</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-border hover:border-muted-foreground transition-colors">
                <Moon className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground">Dark</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-border hover:border-muted-foreground transition-colors">
                <Monitor className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground">System</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div variants={fade} className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center">
            <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: PRIMARY }}>Preferences</h2>
            <p className="text-xs text-muted-foreground">Language and regional settings</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all text-sm"
              style={{ '--tw-ring-color': ACCENT } as React.CSSProperties}
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Japanese</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all text-sm"
              style={{ '--tw-ring-color': ACCENT } as React.CSSProperties}
            >
              <option>UTC-5 (Eastern Time)</option>
              <option>UTC-6 (Central Time)</option>
              <option>UTC-7 (Mountain Time)</option>
              <option>UTC-8 (Pacific Time)</option>
              <option>UTC+0 (GMT)</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div variants={fade} className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg--900/20 dark:bg-red-950/30 flex items-center justify-center">
            <Lock className="w-5 h-5 text-red-600 dark:text--400 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: PRIMARY }}>Security</h2>
            <p className="text-xs text-muted-foreground">Manage your account security</p>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-muted-foreground" />
              <div className="text-left">
                <p className="font-semibold text-sm">Change Password</p>
                <p className="text-xs text-muted-foreground">Update your password</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </button>

          <button className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div className="text-left">
                <p className="font-semibold text-sm">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </button>

          <button className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <div className="text-left">
                <p className="font-semibold text-sm">Active Sessions</p>
                <p className="text-xs text-muted-foreground">Manage logged-in devices</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div variants={fade} className="bg-card rounded-2xl border border-red-200 dark:border-red-900/30 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg--900/20 dark:bg-red-950/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-600 dark:text--400 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-red-600 dark:text--400 dark:text-red-400">Danger Zone</h2>
            <p className="text-xs text-muted-foreground">Irreversible actions</p>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full px-6 py-3 rounded-xl border-2 border-red-200 dark:border-red-900/30 text-red-600 dark:text--400 dark:text-red-400 font-semibold text-sm hover:bg-red-50 dark:bg--900/20 dark:hover:bg-red-950/20 transition-all">
            Delete Account
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
