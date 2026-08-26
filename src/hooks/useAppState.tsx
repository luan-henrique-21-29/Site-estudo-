import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { AppData, Goal, UserSettings } from '../types'
import { defaultData, loadData, saveData } from '../lib/storage'

type Difficulty = 'hard' | 'normal' | 'easy'

interface AppStateValue {
  data: AppData
  setOnboarding: (name: string) => void
  toggleFavorite: (id: string) => void
  markCompleted: (id: string, difficulty?: Difficulty) => void
  saveNote: (id: string, note: string) => void
  updateSettings: (patch: Partial<UserSettings>) => void
  updateGoal: (goal: Goal) => void
  addGoal: (goal: Goal) => void
  addStudyMinutes: (minutes: number) => void
  replaceData: (data: AppData) => void
  resetData: () => void
}

const AppStateContext = createContext<AppStateValue | null>(null)

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData())

  useEffect(() => saveData(data), [data])

  useEffect(() => {
    const s = data.settings
    const root = document.documentElement
    root.style.setProperty('--primary', s.primary)
    root.style.setProperty('--secondary', s.secondary)
    root.style.setProperty('--accent', s.accent)
    root.style.setProperty('--bg', s.background)
    root.style.setProperty('--surface', s.surface)
    root.style.setProperty('--text', s.text)
    root.style.setProperty('--font-family', s.fontFamily)
    root.style.setProperty('--font-scale', String(s.fontScale))
    root.style.setProperty('--radius', `${s.radius}px`)
    root.dataset.density = s.density
    root.dataset.animations = s.animations
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', s.background)
  }, [data.settings])

  const value = useMemo<AppStateValue>(() => ({
    data,
    setOnboarding: (name) => setData(d => ({ ...d, onboardingDone: true, displayName: name.trim() })),
    toggleFavorite: (id) => setData(d => ({ ...d, favorites: d.favorites.includes(id) ? d.favorites.filter(x => x !== id) : [...d.favorites, id] })),
    markCompleted: (id, difficulty = 'normal') => setData(d => ({ ...d, completed: { ...d.completed, [id]: { completedAt: new Date().toISOString(), difficulty } } })),
    saveNote: (id, note) => setData(d => ({ ...d, notes: { ...d.notes, [id]: note } })),
    updateSettings: (patch) => setData(d => ({ ...d, settings: { ...d.settings, ...patch } })),
    updateGoal: (goal) => setData(d => ({ ...d, goals: d.goals.map(g => g.id === goal.id ? goal : g) })),
    addGoal: (goal) => setData(d => ({ ...d, goals: [...d.goals, goal] })),
    addStudyMinutes: (minutes) => setData(d => ({ ...d, studyMinutes: Math.max(0, d.studyMinutes + minutes) })),
    replaceData: (next) => setData(next),
    resetData: () => setData(structuredClone(defaultData))
  }), [data])

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider')
  return ctx
}
