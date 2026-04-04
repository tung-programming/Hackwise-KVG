import { useEffect, useState } from 'react'

export function useScrollEffect() {
  const [scrollY, setScrollY] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      setScrollY(window.scrollY)
      setIsScrolling(true)

      // Clear timeout if it exists
      clearTimeout(scrollTimeout)

      // Set a new timeout
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  return { scrollY, isScrolling }
}
