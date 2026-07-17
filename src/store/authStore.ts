// Zustand store — Employee authentication state for Wodoh (وضُـوح)
// Lightweight session auth for the Operations Dashboard (in-memory only,
// resets on page reload — consistent with this being a hackathon prototype).

import { create } from 'zustand'
import { currentEmployee } from '@/data/mockData'

interface AuthState {
  isAuthenticated: boolean
  employeeEmail: string
  login: (email: string, password: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  employeeEmail: '',

  // Any non-empty email + password succeeds — this is a prototype, not a
  // real credential check. Swap in a real API call for production use.
  login: (email: string, password: string) => {
    if (!email.trim() || !password.trim()) return false
    set({ isAuthenticated: true, employeeEmail: email.trim() || currentEmployee.email })
    return true
  },

  logout: () => set({ isAuthenticated: false, employeeEmail: '' }),
}))
