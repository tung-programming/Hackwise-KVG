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
  Menu,
  X,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'interests', label: 'Interests', icon: Heart, href: '/dashboard/interests' },
  { id: 'courses', label: 'Courses', icon: BookOpen, href: '/dashboard/courses' },
  { id: 'projects', label: 'Projects', icon: FolderOpen, href: '/dashboard/projects' },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, href: '/dashboard/leaderboard' },
  { id: 'resume', label: 'Resume Analysis', icon: FileText, href: '/dashboard/resume' },
  { id: 'profile', label: 'Profile', icon: User, href: '/dashboard/profile' },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { clearStore, toggleSidebarCollapsed, sidebarCollapsed } = useAppStore()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleLogout = () => {
    clearStore()
    router.push('/')
  }

  const handleCollapse = () => {
    if (!isMobile) {
      toggleSidebarCollapsed()
    }
  }

  const sidebarVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -300 },
  }

  const sidebarContent = (
    <motion.div
      initial={isMobile ? 'closed' : 'open'}
      animate={isMobile && !isOpen ? 'closed' : 'open'}
      variants={sidebarVariants}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-accent-foreground text-sm">H</span>
          </div>
          {!sidebarCollapsed && <span>CourseHive</span>}
        </div>
        {isMobile && onClose && (
          <button onClick={onClose} className="p-1 hover:bg-sidebar-accent rounded">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => isMobile && onClose?.()}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-accent/10 text-accent border-l-2 border-accent'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4 space-y-3">
        {!sidebarCollapsed && !isMobile && (
          <button
            onClick={handleCollapse}
            className="w-full text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground py-2 px-4 rounded hover:bg-sidebar-accent/50 transition-colors text-left"
          >
            Collapse
          </button>
        )}
        <Button
          onClick={handleLogout}
          variant="outline"
          className={`w-full gap-2 ${sidebarCollapsed ? 'px-2' : ''}`}
        >
          <LogOut className="w-4 h-4" />
          {!sidebarCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </motion.div>
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
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
        <motion.aside
          className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border z-50 md:hidden flex flex-col"
          animate={isOpen ? { x: 0 } : { x: -300 }}
          transition={{ duration: 0.3 }}
        >
          {sidebarContent}
        </motion.aside>
      </>
    )
  }

  return (
    <aside
      className={`h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {sidebarContent}
    </aside>
  )
}
