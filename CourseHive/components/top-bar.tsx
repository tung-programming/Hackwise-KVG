'use client'

import { useTheme } from 'next-themes'
import { Search, Bell, Mail, Sun, Moon, Menu, Hexagon } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const PRIMARY = '#172b44'
const ACCENT = '#f97316'

interface TopBarProps {
  onMenuClick?: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { theme, setTheme } = useTheme()
  const { currentUser } = useAppStore()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  const name =
    (currentUser && 'username' in currentUser
      ? (currentUser as { username?: string }).username
      : currentUser?.name) || 'Jordan Smith'
  const email = currentUser?.email || 'user@example.com'
  const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to interests page with search query
      // In the future, the interests/courses pages can implement filtering
      router.push(`/dashboard/interests?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Handle keyboard shortcut (Cmd/Ctrl + F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="h-17.5 bg-card/60 backdrop-blur-xl border-b border-border/50 sticky top-0 z-40 flex items-center">
      <div className="flex-1 flex items-center justify-between px-6 gap-4">
        {/* Mobile menu + Search */}
        <div className="flex items-center gap-3 flex-1 max-w-sm">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search bar — Helio style */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, projects..."
              className="w-full pl-9 pr-14 py-2.5 text-sm bg-white/60 dark:bg-white/10 border border-border/40 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-muted-foreground/50 backdrop-blur-sm"
              style={{ '--tw-ring-color': ACCENT } as React.CSSProperties}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-white/80 dark:bg-white/20 rounded-md px-1.5 py-0.5">
              <span className="text-[10px] text-muted-foreground font-medium">⌘</span>
              <span className="text-[10px] text-muted-foreground font-medium">F</span>
            </div>
          </form>
        </div>

        {/* Right — icons + user */}
        <div className="flex items-center gap-2">
          {/* Theme */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-xl bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 text-muted-foreground hover:text-foreground transition-all backdrop-blur-sm"
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* Mail */}
          <button className="p-2.5 rounded-xl bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 text-muted-foreground hover:text-foreground transition-all backdrop-blur-sm">
            <Mail className="w-4.5 h-4.5" />
          </button>

          {/* Bell */}
          <button className="relative p-2.5 rounded-xl bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 text-muted-foreground hover:text-foreground transition-all backdrop-blur-sm">
            <Bell className="w-4.5 h-4.5" />
            <span
              className="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-card"
              style={{ background: ACCENT }}
            />
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-border/60 mx-1" />

          {/* User */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md"
              style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #2c4a6a 100%)` }}
            >
              {initials}
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-semibold text-foreground">{name}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
