'use client'

import { useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useActiveInterest } from '@/hooks/use-api'

const ACCENT = 'var(--accent)'

export default function CoursesPage() {
  const router = useRouter()
  const { data: activeInterest, loading, error } = useActiveInterest()
  const [, startTransition] = useTransition()

  useEffect(() => {
    if (!loading && activeInterest?.id) {
      startTransition(() => {
        router.replace(`/dashboard/courses/${activeInterest.id}`)
      })
    }
  }, [activeInterest?.id, loading, router, startTransition])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#f97316]" />
      </div>
    )
  }

  if (!activeInterest) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-10 w-10 text-red-500 dark:text--400" />
        <p className="text-sm text-muted-foreground">{error || 'No active interest found.'}</p>
        <Link href="/dashboard/interests" className="text-sm font-semibold" style={{ color: ACCENT }}>
          Go to Interests
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[#f97316]" />
    </div>
  )
}
