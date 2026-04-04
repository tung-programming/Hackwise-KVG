'use client'

import { Button } from '@/components/ui/button'
import { WifiOff } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-md text-center space-y-6">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
          <WifiOff className="w-8 h-8 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">You&apos;re Offline</h1>
          <p className="text-muted-foreground">
            It looks like you&apos;ve lost your internet connection. Please check your connection and try again.
          </p>
        </div>

        <Button
          onClick={() => window.location.reload()}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          Retry
        </Button>
      </div>
    </div>
  )
}
