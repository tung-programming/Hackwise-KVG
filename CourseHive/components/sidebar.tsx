'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Heart,
  BookOpen,
  FolderOpen,
  Trophy,
  FileText,
  User,
  LogOut,
  X,
  Settings,
  HelpCircle,
  Smartphone,
  Hexagon,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { useState, useEffect } from 'react'

const PRIMARY = '#172b44'
const ACCENT = '#f97316'

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Interests', icon: Heart, href: '/dashboard/interests', badge: '5+' },
  { label: 'Courses', icon: BookOpen, href: '/dashboard/courses' },
  { label: 'Projects', icon: FolderOpen, href: '/dashboard/projects' },
  { label: 'Leaderboard', icon: Trophy, href: '/dashboard/leaderboard' },
]

const generalItems = [
  { label: 'Resume', icon: FileText, href: '/dashboard/resume' },
  { label: 'Profile', icon: User, href: '/dashboard/profile' },
  { label: 'Settings', icon: Settings, href: '#', disabled: true },
  { label: 'Help', icon: HelpCircle, href: '#', disabled: true },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { clearStore } = useAppStore()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleLogout = () => {
    clearStore()
    router.push('/')
  }

  const isActive = (href: string) =>
    href !== '/dashboard'
      ? pathname.startsWith(href)
      : pathname === '/dashboard'

  const NavLink = ({
    item,
  }: {
    item: { label: string; icon: React.ElementType; href: string; badge?: string; disabled?: boolean }
  }) => {
    const active = isActive(item.href)
    const Icon = item.icon
    const inner = (
      <span
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all relative ${
          active
            ? 'font-semibold'
            : item.disabled
            ? 'opacity-40 cursor-not-allowed'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
        }`}
        style={active ? { color: PRIMARY } : {}}
      >
        {/* Left active bar */}
        {active && (
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
            style={{ background: PRIMARY }}
          />
        )}
        <Icon className="w-4.5 h-4.5 shrink-0" style={active ? { color: PRIMARY } : {}} />
        <span className="text-sm">{item.label}</span>
        {item.badge && (
          <span
            className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
            style={{ background: ACCENT }}
          >
            {item.badge}
          </span>
        )}
      </span>
    )
    if (item.disabled) return <div>{inner}</div>
    return (
      <Link href={item.href} onClick={() => isMobile && onClose?.()}>
        {inner}
      </Link>
    )
  }

  const content = (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 pt-6 pb-5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
            style={{ background: PRIMARY }}
          >
            <Hexagon className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: PRIMARY }}>CourseHive</span>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto space-y-0.5">
        {/* MENU */}
        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.12em] px-4 mb-2 mt-1">
          Menu
        </p>
        {menuItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {/* GENERAL */}
        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.12em] px-4 mb-2 mt-5">
          General
        </p>
        {generalItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all text-sm mt-0.5"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          Logout
        </button>
      </nav>

      {/* CTA Card */}
      <div className="p-4 mt-2">
        <div
          className="rounded-2xl p-4 text-white relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #2c4a6a 100%)` }}
        >
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/10" />
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center mb-3">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <p className="font-bold text-sm leading-snug">
            Download our<br />Mobile App
          </p>
          <p className="text-white/50 text-xs mt-1">Get easy in another way</p>
          <button
            className="mt-3 w-full py-2 rounded-xl text-xs font-semibold transition-all"
            style={{ background: ACCENT }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
          />
        )}
        <motion.aside
          className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar/90 backdrop-blur-xl border-r border-sidebar-border z-50 md:hidden"
          animate={isOpen ? { x: 0 } : { x: -280 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          {content}
        </motion.aside>
      </>
    )
  }

  return (
    <aside className="w-60 shrink-0 h-screen bg-sidebar/80 backdrop-blur-xl border-r border-sidebar-border flex flex-col">
      {content}
    </aside>
  )
}
