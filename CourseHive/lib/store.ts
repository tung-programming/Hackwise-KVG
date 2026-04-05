import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const dedupeInterestsById = (interests: Interest[]) => {
  const seen = new Set<string>()
  return interests.filter((interest) => {
    if (seen.has(interest.id)) return false
    seen.add(interest.id)
    return true
  })
}

export interface Interest {
  id: string
  name: string
  status: 'pending' | 'accepted' | 'rejected'
}

export interface OnboardingState {
  field: string | null
  type: string | null
  username: string
}

export interface DashboardState {
  sidebarCollapsed: boolean
  modalOpen: {
    uploadHistory: boolean
  }
  uploadedHistory: boolean
  interests: Interest[]
  currentUser: {
    name: string
    email: string
    field: string
    type: string
  } | null
  hasSeenTour: boolean
}

interface AppStore extends OnboardingState, DashboardState {
  // Onboarding actions
  setField: (field: string) => void
  setType: (type: string) => void
  setUsername: (username: string) => void
  clearOnboarding: () => void

  // Dashboard actions
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebarCollapsed: () => void
  setModalOpen: (key: keyof DashboardState['modalOpen'], open: boolean) => void
  setUploadedHistory: (uploaded: boolean) => void
  addInterest: (interest: Interest) => void
  updateInterest: (id: string, status: Interest['status']) => void
  setCurrentUser: (user: DashboardState['currentUser']) => void
  setHasSeenTour: (seen: boolean) => void
  clearStore: () => void
}

const initialDashboardState: DashboardState = {
  sidebarCollapsed: false,
  modalOpen: {
    uploadHistory: false,
  },
  uploadedHistory: false,
  interests: [],
  currentUser: null,
  hasSeenTour: false,
}

const initialOnboardingState: OnboardingState = {
  field: null,
  type: null,
  username: '',
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialOnboardingState,
        ...initialDashboardState,

        // Onboarding actions
        setField: (field: string) => set({ field }),
        setType: (type: string) => set({ type }),
        setUsername: (username: string) => set({ username }),
        clearOnboarding: () =>
          set({
            field: null,
            type: null,
            username: '',
          }),

        // Dashboard actions
        setSidebarCollapsed: (collapsed: boolean) =>
          set({ sidebarCollapsed: collapsed }),
        toggleSidebarCollapsed: () =>
          set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
        setModalOpen: (key: keyof DashboardState['modalOpen'], open: boolean) =>
          set((state) => ({
            modalOpen: {
              ...state.modalOpen,
              [key]: open,
            },
          })),
        setUploadedHistory: (uploaded: boolean) =>
          set({ uploadedHistory: uploaded }),
        addInterest: (interest: Interest) =>
          set((state) => ({
            interests: state.interests.some((i) => i.id === interest.id)
              ? state.interests
              : [...state.interests, interest],
          })),
        updateInterest: (id: string, status: Interest['status']) =>
          set((state) => ({
            interests: state.interests.map((interest) =>
              interest.id === id ? { ...interest, status } : interest
            ),
          })),
        setCurrentUser: (user: DashboardState['currentUser']) =>
          set({ currentUser: user }),
        setHasSeenTour: (seen: boolean) =>
          set({ hasSeenTour: seen }),
        clearStore: () =>
          set({
            ...initialOnboardingState,
            ...initialDashboardState,
          }),
      }),
      {
        name: 'coursehive-store',
        version: 2,
        migrate: (persistedState: unknown, version: number) => {
          if (!persistedState || typeof persistedState !== 'object') {
            return persistedState
          }

          const state = persistedState as { interests?: Interest[] }
          if (!Array.isArray(state.interests)) {
            return persistedState
          }

          if (version < 2) {
            return {
              ...(persistedState as object),
              interests: dedupeInterestsById(state.interests),
            }
          }

          return persistedState
        },
      }
    ),
    {
      name: 'CourseHive Store',
    }
  )
)