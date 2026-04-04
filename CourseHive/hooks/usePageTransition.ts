import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export function usePageTransition() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Scroll to top on page change
    window.scrollTo(0, 0)
  }, [pathname])

  return { router, pathname }
}
