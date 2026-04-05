'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  ApiError,
  Course,
  Interest,
  LeaderboardEntry,
  Project,
  User,
  UserStats,
  WeeklyActivity,
  coursesApi,
  historyApi,
  interestsApi,
  leaderboardApi,
  pollHistoryStatus,
  pollProjectValidation,
  projectsApi,
  statsApi,
  userApi,
} from '@/lib/api'

type HookState<T> = {
  data: T
  loading: boolean
  error: string | null
}

type InterestDetailShape = { interest: Interest; courses: Course[]; projects: Project[] }

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return 'Something went wrong'
}

function normalizeInterestDetailPayload(payload: unknown): InterestDetailShape | null {
  if (!payload || typeof payload !== 'object') return null
  const obj = payload as Record<string, unknown>

  if (obj.interest && typeof obj.interest === 'object') {
    return {
      interest: obj.interest as Interest,
      courses: Array.isArray(obj.courses) ? (obj.courses as Course[]) : [],
      projects: Array.isArray(obj.projects) ? (obj.projects as Project[]) : [],
    }
  }

  // Backend may return flattened interest object with courses/projects attached.
  if ('id' in obj && 'name' in obj) {
    const courses = Array.isArray(obj.courses) ? (obj.courses as Course[]) : []
    const projects = Array.isArray(obj.projects) ? (obj.projects as Project[]) : []
    const interest = obj as unknown as Interest
    return { interest, courses, projects }
  }

  return null
}

export function useInterests() {
  const [state, setState] = useState<HookState<Interest[]>>({
    data: [],
    loading: true,
    error: null,
  })

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await interestsApi.getAll()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({ data: [], loading: false, error: getErrorMessage(error) })
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { ...state, refetch }
}

export function useActiveInterest() {
  const [state, setState] = useState<HookState<Interest | null>>({
    data: null,
    loading: true,
    error: null,
  })

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await interestsApi.getActiveInterest()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({ data: null, loading: false, error: getErrorMessage(error) })
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { ...state, hasActive: Boolean(state.data), refetch }
}

export function useInterestActions(onDone?: () => void | Promise<void>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const accept = useCallback(
    async (interestId: string) => {
      setLoading(true)
      setError(null)
      try {
        await interestsApi.accept(interestId)
        if (onDone) await onDone()
        return true
      } catch (e) {
        setError(getErrorMessage(e))
        return false
      } finally {
        setLoading(false)
      }
    },
    [onDone]
  )

  const reject = useCallback(
    async (interestId: string) => {
      setLoading(true)
      setError(null)
      try {
        await interestsApi.reject(interestId)
        if (onDone) await onDone()
        return true
      } catch (e) {
        setError(getErrorMessage(e))
        return false
      } finally {
        setLoading(false)
      }
    },
    [onDone]
  )

  return { accept, reject, loading, error }
}

export function useInterestDetail(interestId: string | null | undefined) {
  const [state, setState] = useState<
    HookState<InterestDetailShape | null>
  >({
    data: null,
    loading: true,
    error: null,
  })

  const refetch = useCallback(async () => {
    if (!interestId) {
      setState({ data: null, loading: false, error: null })
      return
    }
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const raw = await interestsApi.getById(interestId)
      const data = normalizeInterestDetailPayload(raw)
      if (!data) {
        setState({ data: null, loading: false, error: 'Invalid interest payload from server' })
        return
      }
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({ data: null, loading: false, error: getErrorMessage(error) })
    }
  }, [interestId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { ...state, refetch }
}

export function useCourses(interestId: string | null | undefined) {
  const [state, setState] = useState<HookState<Course[]>>({
    data: [],
    loading: true,
    error: null,
  })

  const refetch = useCallback(async () => {
    if (!interestId) {
      setState({ data: [], loading: false, error: null })
      return
    }
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await coursesApi.getByInterest(interestId)
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({ data: [], loading: false, error: getErrorMessage(error) })
    }
  }, [interestId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { ...state, refetch }
}

export function useProjects(interestId: string | null | undefined) {
  const [state, setState] = useState<HookState<Project[]>>({
    data: [],
    loading: true,
    error: null,
  })

  const refetch = useCallback(async () => {
    if (!interestId) {
      setState({ data: [], loading: false, error: null })
      return
    }
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await projectsApi.getByInterest(interestId)
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({ data: [], loading: false, error: getErrorMessage(error) })
    }
  }, [interestId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { ...state, refetch }
}

export function useCourseCompletion(onDone?: () => void | Promise<void>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const complete = useCallback(
    async (courseId: string) => {
      setLoading(true)
      setError(null)
      try {
        const result = await coursesApi.complete(courseId)
        if (onDone) await onDone()
        return { success: true, ...result }
      } catch (e) {
        const message = getErrorMessage(e)
        setError(message)
        return { success: false, error: message }
      } finally {
        setLoading(false)
      }
    },
    [onDone]
  )

  return { complete, loading, error }
}

export function useProjectSubmit(onDone?: () => void | Promise<void>) {
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState<string | null>(null)

  const submit = useCallback(
    async (
      projectId: string,
      data: { repo_url?: string; live_url?: string; technologies?: string[] }
    ) => {
      setSubmitting(true)
      setProgress('Submitting project...')
      setError(null)
      try {
        await projectsApi.submit(projectId, data)
        setProgress('Validating with AI...')
        await pollProjectValidation(projectId, (status) => {
          setProgress(status === 'validated' ? 'Validated' : `Validation: ${status}`)
        })
        if (onDone) await onDone()
        return { success: true }
      } catch (e) {
        const message = getErrorMessage(e)
        setError(message)
        return { success: false, error: message }
      } finally {
        setSubmitting(false)
      }
    },
    [onDone]
  )

  return { submit, submitting, progress, error }
}

export function useHistoryUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(async (file: File) => {
    setUploading(true)
    setProgress('Uploading history...')
    setError(null)
    try {
      const uploaded = await historyApi.upload(file)
      setProgress('Processing history...')
      const interests = await pollHistoryStatus(uploaded.id, (status) => {
        if (status === 'pending') setProgress('Queued for processing...')
        else if (status === 'processing') setProgress('Analyzing history with AI...')
        else if (status === 'completed') setProgress('Processing complete')
        else if (status === 'failed') setProgress('Processing failed')
      })
      return interests ?? []
    } catch (e) {
      const message = getErrorMessage(e)
      setError(message)
      return null
    } finally {
      setUploading(false)
    }
  }, [])

  return { upload, uploading, progress, error }
}

export function useDashboardData() {
  const [state, setState] = useState<
    HookState<{
      user: User
      stats: UserStats
      interests: Interest[]
      activeInterest: Interest | null
    } | null>
  >({
    data: null,
    loading: true,
    error: null,
  })

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const [user, stats, interests] = await Promise.all([
        userApi.getProfile(),
        userApi.getStats(),
        interestsApi.getAll(),
      ])
      const activeInterest =
        interests.find((i) => i.status === 'accepted' && !i.is_completed) ?? null
      setState({
        data: { user, stats, interests, activeInterest },
        loading: false,
        error: null,
      })
    } catch (error) {
      setState({ data: null, loading: false, error: getErrorMessage(error) })
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { ...state, refetch }
}

export function useWeeklyActivity() {
  const [state, setState] = useState<HookState<WeeklyActivity[]>>({
    data: [],
    loading: true,
    error: null,
  })

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await statsApi.getWeeklyActivity()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({ data: [], loading: false, error: getErrorMessage(error) })
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { ...state, refetch }
}

export function useUser() {
  const [state, setState] = useState<HookState<User | null>>({
    data: null,
    loading: true,
    error: null,
  })

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await userApi.getProfile()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({ data: null, loading: false, error: getErrorMessage(error) })
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { ...state, refetch }
}

export function useUserStats() {
  const [state, setState] = useState<HookState<UserStats | null>>({
    data: null,
    loading: true,
    error: null,
  })

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await userApi.getStats()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({ data: null, loading: false, error: getErrorMessage(error) })
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { ...state, refetch }
}

export function useLeaderboard(period: 'all' | 'month' | 'week' = 'all') {
  const [state, setState] = useState<HookState<LeaderboardEntry[]>>({
    data: [],
    loading: true,
    error: null,
  })

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await leaderboardApi.getAll(period)
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({ data: [], loading: false, error: getErrorMessage(error) })
    }
  }, [period])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { ...state, refetch }
}

export function useMyRank() {
  const [state, setState] = useState<
    HookState<{ rank: number; totalUsers: number } | null>
  >({
    data: null,
    loading: true,
    error: null,
  })

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await leaderboardApi.getMyRank()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({ data: null, loading: false, error: getErrorMessage(error) })
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { ...state, refetch }
}
