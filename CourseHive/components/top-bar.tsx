'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Bell, Upload, Menu, CircleUser } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'

interface TopBarProps {
  onMenuClick?: () => void
  username?: string
}

export function TopBar({ onMenuClick, username = 'Jordan' }: TopBarProps) {
  const { theme, setTheme } = useTheme()
  const { setModalOpen } = useAppStore()
  const [notificationCount] = useState(3)

  return (
    <header className="h-16 border-b border-border/40 bg-card/40 backdrop-blur-sm sticky top-0 z-40">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden sm:block">
            <p className="text-sm font-medium">Hello, {username}</p>
            <p className="text-xs text-muted-foreground">Welcome back</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Upload History Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setModalOpen('uploadHistory', true)}
            className="gap-2 hidden sm:flex"
          >
            <Upload className="w-4 h-4" />
            <span>Upload History</span>
          </Button>

          {/* Notification Bell */}
          <button
            className="relative p-2 hover:bg-secondary rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Avatar */}
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <CircleUser className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
