'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/top-bar'
import { UploadHistoryModal } from '@/components/upload-history-modal'
import { useAppStore } from '@/lib/store'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { } = useAppStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-5 sm:p-6 lg:p-8 max-w-screen-2xl">
            {children}
          </div>
        </main>
      </div>

      <UploadHistoryModal />
    </div>
  )
}
