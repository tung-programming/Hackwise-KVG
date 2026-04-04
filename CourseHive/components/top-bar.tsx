'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { usePathname, useRouter } from 'next/navigation'
import { Search, Bell, Mail, Sun, Moon, Menu } from 'lucide-react'
import { useAppStore } from '@/lib/store'

const PRIMARY = '#172b44'
const ACCENT = '#f97316'

interface TopBarProps {
  onMenuClick?: () => void
}

const searchTargets = [
  { label: 'Dashboard', href: '/dashboard', keywords: ['home', 'overview', 'stats'] },
  { label: 'Interests', href: '/dashboard/interests', keywords: ['topics', 'skills', 'preferences'] },
  { label: 'Courses', href: '/dashboard/courses', keywords: ['learning', 'roadmap', 'modules'] },
  { label: 'Projects', href: '/dashboard/projects', keywords: ['portfolio', 'build', 'tasks'] },
  { label: 'Leaderboard', href: '/dashboard/leaderboard', keywords: ['rank', 'xp', 'points'] },
  { label: 'Resume', href: '/dashboard/resume', keywords: ['cv', 'ats', 'analysis'] },
  { label: 'Profile', href: '/dashboard/profile', keywords: ['account', 'user', 'settings'] },
]

export function TopBar({ onMenuClick }: TopBarProps) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const { currentUser } = useAppStore()
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const name = currentUser?.name || 'Jordan Smith'
  const email = 'jordan@example.com'
  const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  const filteredTargets = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return searchTargets

    return searchTargets.filter((target) => {
      const inLabel = target.label.toLowerCase().includes(normalized)
      const inHref = target.href.toLowerCase().includes(normalized)
      const inKeywords = target.keywords.some((keyword) => keyword.includes(normalized))
      return inLabel || inHref || inKeywords
    })
  }, [query])

  const goToTarget = (href: string) => {
    if (pathname === href) {
      setShowSuggestions(false)
      setQuery('')
      return
    }
    router.push(href)
    setShowSuggestions(false)
    setQuery('')
  }

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'f') {
        event.preventDefault()
        inputRef.current?.focus()
        setShowSuggestions(true)
      }
    }

    window.addEventListener('keydown', onShortcut)
    return () => window.removeEventListener('keydown', onShortcut)
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
          <div className="relative flex-1" data-tour="search">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                window.setTimeout(() => setShowSuggestions(false), 120)
              }}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && filteredTargets.length > 0) {
                  event.preventDefault()
                  goToTarget(filteredTargets[0].href)
                }
                if (event.key === 'Escape') {
                  setShowSuggestions(false)
                }
              }}
              placeholder="Search dashboard pages..."
              className="w-full pl-9 pr-14 py-2.5 text-sm bg-white/60 dark:bg-white/10 border border-border/40 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-muted-foreground/50 backdrop-blur-sm"
              style={{ '--tw-ring-color': ACCENT } as React.CSSProperties}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-white/80 dark:bg-white/20 rounded-md px-1.5 py-0.5">
              <span className="text-[10px] text-muted-foreground font-medium">⌘</span>
              <span className="text-[10px] text-muted-foreground font-medium">F</span>
            </div>

            {showSuggestions && (
              <div className="absolute top-[calc(100%+0.45rem)] left-0 right-0 rounded-xl border border-border bg-white dark:bg-[#0c1e36] shadow-2xl overflow-hidden z-50">
                {filteredTargets.length > 0 ? (
                  <ul className="py-1">
                    {filteredTargets.slice(0, 6).map((target) => {
                      const active = pathname === target.href
                      return (
                        <li key={target.href}>
                          <button
                            type="button"
                            onMouseDown={(event) => {
                              event.preventDefault()
                              goToTarget(target.href)
                            }}
                            className="w-full text-left px-3.5 py-2.5 hover:bg-secondary/80 transition-colors"
                          >
                            <p className="text-sm font-medium text-foreground">{target.label}</p>
                            <p className="text-[11px] text-muted-foreground">{target.href}</p>
                            {active && <p className="text-[10px] text-accent font-semibold mt-0.5">Current page</p>}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="px-3.5 py-3 text-sm text-muted-foreground">No matching page found.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right — icons + user */}
        <div className="flex items-center gap-2">
          {/* Theme */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-xl bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 text-muted-foreground hover:text-foreground transition-all backdrop-blur-sm"
            data-tour="theme-toggle"
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* Mail */}
          <button className="p-2.5 rounded-xl bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 text-muted-foreground hover:text-foreground transition-all backdrop-blur-sm">
            <Mail className="w-4.5 h-4.5" />
          </button>

          {/* Bell */}
          <button 
            className="relative p-2.5 rounded-xl bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 text-muted-foreground hover:text-foreground transition-all backdrop-blur-sm"
            data-tour="notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span
              className="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-card"
              style={{ background: ACCENT }}
            />
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-border/60 mx-1" />

          {/* User */}
          <div className="flex items-center gap-3 cursor-pointer group" data-tour="profile">
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