import { useEffect, useState } from 'react'

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').catch(() => {
        // Service worker registration failed, but app will still work
      })
    }

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const installApp = async () => {
    if (!deferredPrompt) return

    ;(deferredPrompt as any).prompt()
    const { outcome } = await (deferredPrompt as any).userChoice
    console.log(`User response to the install prompt: ${outcome}`)

    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  return {
    isInstallable,
    installApp,
  }
}
