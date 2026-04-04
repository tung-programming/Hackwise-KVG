'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/top-bar'
import { UploadHistoryModal } from '@/components/upload-history-modal'
import { DashboardChatbot } from '@/components/dashboard-chatbot'
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
    <div 
      className="flex h-screen overflow-hidden relative"
      style={{ 
        background: 'linear-gradient(180deg, #a8c8e8 0%, #c0d9f0 14%, #d8edf8 30%, #edf5fb 48%, #f3e9da 72%, #ecdcc8 100%)',
      }}
    >
      {/* Subtle animated particles overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/40 animate-pulse"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              left: `${5 + i * 8}%`,
              top: `${10 + (i * 7) % 40}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + (i % 2)}s`,
            }}
          />
        ))}
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-5 sm:p-6 lg:p-8 max-w-screen-2xl">
            {children}
          </div>
        </main>
      </div>

      <UploadHistoryModal />
      <DashboardChatbot />

      {/* Dark mode gradient override */}
      <style jsx global>{`
        .dark .flex.h-screen {
          background: linear-gradient(180deg, #07121f 0%, #0c1e36 40%, #091628 100%) !important;
        }
      `}</style>
    </div>
  )
}
