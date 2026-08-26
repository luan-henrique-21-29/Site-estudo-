import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type {
  AppData,
  CourseId,
  Difficulty,
  Goal,
  Highlight,
  NotebookDocument,
  OnboardingPreferences,
  QuizAttempt,
  RecentItem,
  UserSettings
} from '../types'
import { defaultData, loadData, saveData } from '../lib/storage'
import { loadCloudSnapshot, saveCloudSnapshot } from '../services/cloudSync'
import { useAuth } from './useAuth'

const reviewIntervals = [1, 3, 7, 14, 30, 60]
const plusDays = (iso: string, days: number) => new Date(new Date(iso).getTime() + days * 86_400_000).toISOString()
const firstReviewDays = (difficulty: Difficulty) => difficulty === 'hard' ? 1 : difficulty === 'easy' ? 7 : 3
const timeValue = (iso?: string) => iso ? Date.parse(iso) || 0 : 0

type SyncStatus = 'local' | 'connecting' | 'pending' | 'synced' | 'error'

function normalizeData(next: Partial<AppData>): AppData {
  return {
    ...structuredClone(defaultData),
    ...next,
    preferences: { ...defaultData.preferences, ...(next.preferences ?? {}) },
    settings: { ...defaultData.settings, ...(next.settings ?? {}) },
    favorites: next.favorites ?? [],
    completed: next.completed ?? {},
    notes: next.notes ?? {},
    noteTags: next.noteTags ?? {},
    favoriteNotes: next.favoriteNotes ?? [],
    goals: (next.goals ?? defaultData.goals).map(goal => ({ ...goal, priority: goal.priority ?? 'normal', subtasks: goal.subtasks ?? [] })),
    relocationChecklist: next.relocationChecklist ?? {},
    studySessions: next.studySessions ?? [],
    recent: next.recent ?? [],
    quizAttempts: next.quizAttempts ?? [],
    flashcardReviews: next.flashcardReviews ?? {},
    notebooks: next.notebooks ?? [],
    highlights: next.highlights ?? [],
    researchedCountries: next.researchedCountries ?? [],
    visitedCountries: next.visitedCountries ?? [],
    researchedCities: next.researchedCities ?? [],
    lastVisitedPath: next.lastVisitedPath ?? '/',
    updatedAt: next.updatedAt ?? ''
  }
}

interface AppStateValue {
  data: AppData
  syncStatus: SyncStatus
  lastSyncAt?: string
  syncNow: () => Promise<void>
  setOnboarding: (name: string) => void
  completeOnboarding: (name: string, preferences: OnboardingPreferences) => void
  updateProfile: (name: string, preferences: Partial<OnboardingPreferences>) => void
  toggleFavorite: (id: string) => void
  markCompleted: (id: string, difficulty?: Difficulty) => void
  reviewLesson: (id: string, difficulty: Difficulty) => void
  saveNote: (id: string, note: string) => void
  setNoteTags: (id: string, tags: string[]) => void
  toggleFavoriteNote: (id: string) => void
  updateSettings: (patch: Partial<UserSettings>) => void
  updateGoal: (goal: Goal) => void
  addGoal: (goal: Goal) => void
  removeGoal: (id: string) => void
  toggleGoalSubtask: (goalId: string, subtaskId: string) => void
  toggleRelocationStep: (step: string) => void
  addStudyMinutes: (minutes: number, course?: CourseId, lessonId?: string) => void
  recordRecent: (item: Omit<RecentItem, 'viewedAt'>) => void
  recordQuizAttempt: (attempt: Omit<QuizAttempt, 'completedAt'>) => void
  reviewFlashcard: (cardId: string, difficulty: Difficulty) => void
  saveNotebook: (doc: NotebookDocument) => void
  deleteNotebook: (id: string) => void
  addHighlight: (highlight: Highlight) => void
  removeHighlight: (id: string) => void
  markCountryResearched: (id: string) => void
  toggleVisitedCountry: (id: string) => void
  markCityResearched: (id: string) => void
  setLastVisitedPath: (path: string, lessonId?: string) => void
  replaceData: (data: AppData) => void
  resetData: () => void
}

const AppStateContext = createContext<AppStateValue | null>(null)

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const { user, configured } = useAuth()
  const [data, setData] = useState<AppData>(() => loadData())
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('local')
  const [lastSyncAt, setLastSyncAt] = useState<string>()
  const dataRef = useRef(data)
  const remoteReady = useRef(false)
  const ignoreNextPush = useRef(false)

  useEffect(() => { dataRef.current = data }, [data])
  useEffect(() => saveData(data), [data])

  const mutate = useCallback((updater: (current: AppData) => AppData) => {
    setData(current => {
      const next = updater(current)
      if (next === current) return current
      return { ...next, updatedAt: new Date().toISOString() }
    })
  }, [])

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
    root.style.setProperty('--title-font-family', s.titleFontFamily)
    root.style.setProperty('--code-font-family', s.codeFontFamily)
    root.style.setProperty('--font-scale', String(s.fontScale))
    root.style.setProperty('--heading-scale', String(s.headingScale))
    root.style.setProperty('--code-scale', String(s.codeScale))
    root.style.setProperty('--line-height', String(s.lineHeight))
    root.style.setProperty('--card-scale', String(s.cardScale))
    root.style.setProperty('--radius', `${s.radius}px`)
    root.dataset.density = s.density
    root.dataset.animations = s.animations
    root.dataset.shadow = s.shadow
    root.dataset.background = s.backgroundMode
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', s.background)
  }, [data.settings])

  const pullOrPush = useCallback(async (force = false) => {
    if (!user || !configured) return
    setSyncStatus('connecting')
    try {
      const remote = await loadCloudSnapshot(user.id)
      const local = dataRef.current
      if (remote && timeValue(remote.updatedAt || remote.data.updatedAt) > timeValue(local.updatedAt)) {
        ignoreNextPush.current = true
        const normalized = normalizeData(remote.data)
        setData(normalized)
        dataRef.current = normalized
      } else if (force || !remote || timeValue(local.updatedAt) >= timeValue(remote.updatedAt)) {
        await saveCloudSnapshot(user.id, local)
      }
      remoteReady.current = true
      setLastSyncAt(new Date().toISOString())
      setSyncStatus('synced')
    } catch (error) {
      console.error('Futuro Lab cloud sync:', error)
      setSyncStatus('error')
    }
  }, [configured, user])

  useEffect(() => {
    remoteReady.current = false
    if (!user || !configured) {
      setSyncStatus('local')
      return
    }
    void pullOrPush(true)
  }, [configured, pullOrPush, user])

  useEffect(() => {
    if (!user || !configured || !remoteReady.current) return
    if (ignoreNextPush.current) {
      ignoreNextPush.current = false
      return
    }
    setSyncStatus('pending')
    const timer = window.setTimeout(async () => {
      try {
        await saveCloudSnapshot(user.id, data)
        setLastSyncAt(new Date().toISOString())
        setSyncStatus('synced')
      } catch (error) {
        console.error('Futuro Lab cloud save:', error)
        setSyncStatus('error')
      }
    }, 900)
    return () => window.clearTimeout(timer)
  }, [configured, data, user])

  useEffect(() => {
    if (!user || !configured) return
    const refresh = () => void pullOrPush(false)
    const onVisibility = () => { if (document.visibilityState === 'visible') refresh() }
    window.addEventListener('online', refresh)
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('online', refresh)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [configured, pullOrPush, user])

  const value = useMemo<AppStateValue>(() => ({
    data,
    syncStatus,
    lastSyncAt,
    syncNow: () => pullOrPush(true),
    setOnboarding: (name) => mutate(d => ({ ...d, onboardingDone: true, displayName: name.trim() })),
    completeOnboarding: (name, preferences) => mutate(d => ({ ...d, onboardingDone: true, displayName: name.trim(), preferences, settings: { ...d.settings, defaultStudyMinutes: preferences.sessionMinutes } })),
    updateProfile: (name, preferences) => mutate(d => ({ ...d, displayName: name.trim(), preferences: { ...d.preferences, ...preferences }, settings: preferences.sessionMinutes ? { ...d.settings, defaultStudyMinutes: preferences.sessionMinutes } : d.settings })),
    toggleFavorite: (id) => mutate(d => ({ ...d, favorites: d.favorites.includes(id) ? d.favorites.filter(x => x !== id) : [...d.favorites, id] })),
    markCompleted: (id, difficulty = 'normal') => mutate(d => {
      const now = new Date().toISOString()
      const previous = d.completed[id]
      return { ...d, lastLessonId: id, completed: { ...d.completed, [id]: { completedAt: previous?.completedAt ?? now, difficulty, reviewStage: previous?.reviewStage ?? 0, nextReviewAt: plusDays(now, firstReviewDays(difficulty)) } } }
    }),
    reviewLesson: (id, difficulty) => mutate(d => {
      const previous = d.completed[id]
      if (!previous) return d
      const stage = Math.min((previous.reviewStage ?? 0) + 1, reviewIntervals.length - 1)
      let days = reviewIntervals[stage]
      if (difficulty === 'hard') days = Math.max(1, Math.round(days * .6))
      if (difficulty === 'easy') days = Math.max(days, Math.round(days * 1.5))
      const now = new Date().toISOString()
      return { ...d, completed: { ...d.completed, [id]: { ...previous, difficulty, reviewStage: stage, nextReviewAt: plusDays(now, days) } } }
    }),
    saveNote: (id, note) => mutate(d => ({ ...d, notes: { ...d.notes, [id]: note } })),
    setNoteTags: (id, tags) => mutate(d => ({ ...d, noteTags: { ...d.noteTags, [id]: [...new Set(tags.map(x => x.trim()).filter(Boolean))] } })),
    toggleFavoriteNote: (id) => mutate(d => ({ ...d, favoriteNotes: d.favoriteNotes.includes(id) ? d.favoriteNotes.filter(x => x !== id) : [...d.favoriteNotes, id] })),
    updateSettings: (patch) => mutate(d => ({ ...d, settings: { ...d.settings, ...patch } })),
    updateGoal: (goal) => mutate(d => ({ ...d, goals: d.goals.map(g => g.id === goal.id ? goal : g) })),
    addGoal: (goal) => mutate(d => ({ ...d, goals: [...d.goals, { ...goal, priority: goal.priority ?? 'normal', subtasks: goal.subtasks ?? [] }] })),
    removeGoal: (id) => mutate(d => ({ ...d, goals: d.goals.filter(g => g.id !== id) })),
    toggleGoalSubtask: (goalId, subtaskId) => mutate(d => ({ ...d, goals: d.goals.map(goal => goal.id !== goalId ? goal : { ...goal, subtasks: (goal.subtasks ?? []).map(task => task.id === subtaskId ? { ...task, done: !task.done } : task) }) })),
    toggleRelocationStep: (step) => mutate(d => ({ ...d, relocationChecklist: { ...d.relocationChecklist, [step]: !d.relocationChecklist[step] } })),
    addStudyMinutes: (minutes, course, lessonId) => mutate(d => {
      const safe = Math.max(0, minutes)
      if (!safe) return d
      const session = { id: `study-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, startedAt: new Date().toISOString(), minutes: safe, course, lessonId }
      return { ...d, studyMinutes: d.studyMinutes + safe, studySessions: [...d.studySessions.slice(-499), session] }
    }),
    recordRecent: (item) => mutate(d => {
      const next = { ...item, viewedAt: new Date().toISOString() }
      return { ...d, recent: [next, ...d.recent.filter(x => !(x.type === item.type && x.id === item.id))].slice(0, 60) }
    }),
    recordQuizAttempt: (attempt) => mutate(d => ({ ...d, quizAttempts: [...d.quizAttempts.slice(-199), { ...attempt, completedAt: new Date().toISOString() }] })),
    reviewFlashcard: (cardId, difficulty) => mutate(d => {
      const previous = d.flashcardReviews[cardId]
      const repetitions = (previous?.repetitions ?? 0) + 1
      const stage = Math.min(repetitions - 1, reviewIntervals.length - 1)
      let days = reviewIntervals[stage]
      if (difficulty === 'hard') days = 1
      if (difficulty === 'easy') days = Math.max(days, Math.round(days * 1.5))
      const now = new Date().toISOString()
      return { ...d, flashcardReviews: { ...d.flashcardReviews, [cardId]: { cardId, difficulty, reviewedAt: now, nextReviewAt: plusDays(now, days), repetitions } } }
    }),
    saveNotebook: (doc) => mutate(d => ({ ...d, notebooks: d.notebooks.some(x => x.id === doc.id) ? d.notebooks.map(x => x.id === doc.id ? doc : x) : [doc, ...d.notebooks] })),
    deleteNotebook: (id) => mutate(d => ({ ...d, notebooks: d.notebooks.filter(x => x.id !== id) })),
    addHighlight: (highlight) => mutate(d => ({ ...d, highlights: [highlight, ...d.highlights.filter(x => x.id !== highlight.id)] })),
    removeHighlight: (id) => mutate(d => ({ ...d, highlights: d.highlights.filter(x => x.id !== id) })),
    markCountryResearched: (id) => mutate(d => ({ ...d, researchedCountries: d.researchedCountries.includes(id) ? d.researchedCountries : [...d.researchedCountries, id] })),
    toggleVisitedCountry: (id) => mutate(d => ({ ...d, visitedCountries: d.visitedCountries.includes(id) ? d.visitedCountries.filter(x => x !== id) : [...d.visitedCountries, id] })),
    markCityResearched: (id) => mutate(d => ({ ...d, researchedCities: d.researchedCities.includes(id) ? d.researchedCities : [...d.researchedCities, id] })),
    setLastVisitedPath: (path, lessonId) => mutate(d => d.lastVisitedPath === path && (!lessonId || d.lastLessonId === lessonId) ? d : ({ ...d, lastVisitedPath: path, lastLessonId: lessonId ?? d.lastLessonId })),
    replaceData: (next) => mutate(() => normalizeData(next)),
    resetData: () => mutate(() => structuredClone(defaultData))
  }), [data, lastSyncAt, mutate, pullOrPush, syncStatus])

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider')
  return ctx
}
