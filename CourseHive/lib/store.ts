import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

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
            interests: [...state.interests, interest],
          })),
        updateInterest: (id: string, status: Interest['status']) =>
          set((state) => ({
            interests: state.interests.map((interest) =>
              interest.id === id ? { ...interest, status } : interest
            ),
          })),
        setCurrentUser: (user: DashboardState['currentUser']) =>
          set({ currentUser: user }),
        clearStore: () =>
          set({
            ...initialOnboardingState,
            ...initialDashboardState,
          }),
      }),
      {
        name: 'coursehive-store',
        version: 1,
      }
    ),
    {
      name: 'CourseHive Store',
    }
  )
)
