import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type {
  AppData,
  CodeChallengeProgress,
  CourseId,
  Difficulty,
  FinancialHistoryEntry,
  FinancialPlan,
  Goal,
  Highlight,
  NotebookDocument,
  OnboardingPreferences,
  PortfolioProject,
  QuizAttempt,
  RecentItem,
  ResumePoint,
  UserSettings
} from '../types'
import { defaultData, hasMeaningfulLocalProgress, loadData, normalizeStoredData, saveData, saveSafetyBackup } from '../lib/storage'
import { mergeAppData } from '../lib/mergeAppData'
import { loadCloudSnapshot, saveCloudSnapshot } from '../services/cloudSync'
import { useAuth } from './useAuth'

const reviewIntervals = [1, 3, 7, 14, 30, 60]
const plusDays = (iso: string, days: number) => new Date(new Date(iso).getTime() + days * 86_400_000).toISOString()
const firstReviewDays = (difficulty: Difficulty) => difficulty === 'hard' ? 1 : difficulty === 'easy' ? 7 : 3

type SyncStatus = 'local' | 'connecting' | 'pending' | 'synced' | 'offline' | 'migration' | 'paused' | 'error'
type MigrationChoice = 'sync' | 'separate' | 'cloud'

interface AppStateValue {
  data: AppData
  syncStatus: SyncStatus
  lastSyncAt?: string
  migrationNeeded: boolean
  migrationRemoteExists: boolean
  syncNow: () => Promise<void>
  resolveMigration: (choice: MigrationChoice) => Promise<void>
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
  recordSearch: (query: string) => void
  clearSearchHistory: () => void
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
  setResumePoint: (point: Partial<ResumePoint> & Pick<ResumePoint, 'path'>) => void
  updateFinancialPlan: (patch: Partial<FinancialPlan>) => void
  addFinancialHistory: (entry: FinancialHistoryEntry) => void
  removeFinancialHistory: (id: string) => void
  savePortfolioProject: (project: PortfolioProject) => void
  deletePortfolioProject: (id: string) => void
  savePlaygroundState: (patch: Partial<AppData['playgroundState']>) => void
  saveCodeChallengeProgress: (progress: CodeChallengeProgress) => void
  replaceData: (data: AppData) => void
  resetData: () => void
}

const AppStateContext = createContext<AppStateValue | null>(null)
const migrationKey = (userId: string) => `futuro-lab-sync-choice:${userId}`

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const { user, configured } = useAuth()
  const [data, setData] = useState<AppData>(() => loadData())
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('local')
  const [lastSyncAt, setLastSyncAt] = useState<string>()
  const [migrationNeeded, setMigrationNeeded] = useState(false)
  const [migrationRemoteExists, setMigrationRemoteExists] = useState(false)
  const dataRef = useRef(data)
  const remoteReady = useRef(false)
  const ignoreNextPush = useRef(false)
  const paused = useRef(false)
  const remoteCache = useRef<AppData | null>(null)

  useEffect(() => { dataRef.current = data }, [data])
  useEffect(() => saveData(data), [data])

  const mutate = useCallback((updater: (current: AppData) => AppData) => {
    setData(current => {
      const next = updater(current)
      if (next === current) return current
      return { ...next, version: Math.max(2, next.version ?? 2), updatedAt: new Date().toISOString() }
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

  const performSync = useCallback(async (force = false) => {
    if (!user || !configured) return
    if (!navigator.onLine) {
      setSyncStatus('offline')
      return
    }
    if (paused.current && !force) {
      setSyncStatus('paused')
      return
    }
    if (force) {
      paused.current = false
      localStorage.removeItem(migrationKey(user.id))
    }
    setSyncStatus('connecting')
    try {
      const remote = await loadCloudSnapshot(user.id)
      remoteCache.current = remote?.data ? normalizeStoredData(remote.data) : null
      const local = dataRef.current
      const choice = localStorage.getItem(migrationKey(user.id))

      if (!remote && hasMeaningfulLocalProgress(local) && !choice && !remoteReady.current) {
        setMigrationRemoteExists(false)
        setMigrationNeeded(true)
        setSyncStatus('migration')
        return
      }

      if (choice === 'separate') {
        paused.current = true
        setSyncStatus('paused')
        return
      }

      if (remote) {
        const merged = mergeAppData(local, remote.data)
        if (JSON.stringify(merged) !== JSON.stringify(local)) {
          saveSafetyBackup(local, 'before-cloud-merge')
          ignoreNextPush.current = true
          setData(merged)
          dataRef.current = merged
        }
        await saveCloudSnapshot(user.id, merged)
      } else {
        await saveCloudSnapshot(user.id, local)
      }

      remoteReady.current = true
      setMigrationNeeded(false)
      setLastSyncAt(new Date().toISOString())
      setSyncStatus('synced')
    } catch (error) {
      console.error('Futuro Lab cloud sync:', error)
      setSyncStatus(navigator.onLine ? 'error' : 'offline')
    }
  }, [configured, user])

  const resolveMigration = useCallback(async (choice: MigrationChoice) => {
    if (!user || !configured) return
    const local = dataRef.current
    if (choice === 'separate') {
      paused.current = true
      localStorage.setItem(migrationKey(user.id), 'separate')
      setMigrationNeeded(false)
      setSyncStatus('paused')
      return
    }
    if (choice === 'cloud' && remoteCache.current) {
      saveSafetyBackup(local, 'before-cloud-restore')
      const next = normalizeStoredData(remoteCache.current)
      ignoreNextPush.current = true
      setData(next)
      dataRef.current = next
      remoteReady.current = true
      localStorage.setItem(migrationKey(user.id), 'cloud')
      setMigrationNeeded(false)
      setLastSyncAt(new Date().toISOString())
      setSyncStatus('synced')
      return
    }
    await saveCloudSnapshot(user.id, local)
    remoteReady.current = true
    paused.current = false
    localStorage.setItem(migrationKey(user.id), 'sync')
    setMigrationNeeded(false)
    setLastSyncAt(new Date().toISOString())
    setSyncStatus('synced')
  }, [configured, user])

  useEffect(() => {
    remoteReady.current = false
    paused.current = false
    remoteCache.current = null
    setMigrationNeeded(false)
    if (!user || !configured) {
      setSyncStatus('local')
      return
    }
    void performSync(false)
  }, [configured, performSync, user])

  useEffect(() => {
    if (!user || !configured || !remoteReady.current || paused.current || migrationNeeded) return
    if (ignoreNextPush.current) {
      ignoreNextPush.current = false
      return
    }
    if (!navigator.onLine) {
      setSyncStatus('offline')
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
        setSyncStatus(navigator.onLine ? 'error' : 'offline')
      }
    }, 900)
    return () => window.clearTimeout(timer)
  }, [configured, data, migrationNeeded, user])

  useEffect(() => {
    if (!user || !configured) return
    const onOnline = () => void performSync(false)
    const onOffline = () => setSyncStatus('offline')
    const onVisibility = () => { if (document.visibilityState === 'visible' && navigator.onLine) void performSync(false) }
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    window.addEventListener('focus', onOnline)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
      window.removeEventListener('focus', onOnline)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [configured, performSync, user])

  const value = useMemo<AppStateValue>(() => ({
    data,
    syncStatus,
    lastSyncAt,
    migrationNeeded,
    migrationRemoteExists,
    syncNow: () => performSync(true),
    resolveMigration,
    setOnboarding: (name) => mutate(d => ({ ...d, onboardingDone: true, displayName: name.trim() })),
    completeOnboarding: (name, preferences) => mutate(d => ({ ...d, onboardingDone: true, displayName: name.trim(), preferences, settings: { ...d.settings, defaultStudyMinutes: preferences.sessionMinutes }, settingsUpdatedAt: new Date().toISOString() })),
    updateProfile: (name, preferences) => mutate(d => ({ ...d, displayName: name.trim(), preferences: { ...d.preferences, ...preferences }, settings: preferences.sessionMinutes ? { ...d.settings, defaultStudyMinutes: preferences.sessionMinutes } : d.settings, settingsUpdatedAt: preferences.sessionMinutes ? new Date().toISOString() : d.settingsUpdatedAt })),
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
    saveNote: (id, note) => mutate(d => ({ ...d, notes: { ...d.notes, [id]: note }, noteUpdatedAt: { ...d.noteUpdatedAt, [id]: new Date().toISOString() } })),
    setNoteTags: (id, tags) => mutate(d => ({ ...d, noteTags: { ...d.noteTags, [id]: [...new Set(tags.map(x => x.trim()).filter(Boolean))] } })),
    toggleFavoriteNote: (id) => mutate(d => ({ ...d, favoriteNotes: d.favoriteNotes.includes(id) ? d.favoriteNotes.filter(x => x !== id) : [...d.favoriteNotes, id] })),
    updateSettings: (patch) => mutate(d => ({ ...d, settings: { ...d.settings, ...patch }, settingsUpdatedAt: new Date().toISOString() })),
    updateGoal: (goal) => mutate(d => ({ ...d, goals: d.goals.map(g => g.id === goal.id ? { ...goal, updatedAt: new Date().toISOString() } : g) })),
    addGoal: (goal) => mutate(d => ({ ...d, goals: [...d.goals, { ...goal, priority: goal.priority ?? 'normal', subtasks: goal.subtasks ?? [], updatedAt: new Date().toISOString() }] })),
    removeGoal: (id) => mutate(d => ({ ...d, goals: d.goals.filter(g => g.id !== id) })),
    toggleGoalSubtask: (goalId, subtaskId) => mutate(d => ({ ...d, goals: d.goals.map(goal => goal.id !== goalId ? goal : { ...goal, updatedAt: new Date().toISOString(), subtasks: (goal.subtasks ?? []).map(task => task.id === subtaskId ? { ...task, done: !task.done } : task) }) })),
    toggleRelocationStep: (step) => mutate(d => ({ ...d, relocationChecklist: { ...d.relocationChecklist, [step]: !d.relocationChecklist[step] } })),
    addStudyMinutes: (minutes, course, lessonId) => mutate(d => {
      const safe = Math.max(0, minutes)
      if (!safe) return d
      const session = { id: `study-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, startedAt: new Date().toISOString(), minutes: safe, course, lessonId }
      return { ...d, studyMinutes: d.studyMinutes + safe, studySessions: [...d.studySessions.slice(-999), session] }
    }),
    recordRecent: (item) => mutate(d => {
      const next = { ...item, viewedAt: new Date().toISOString() }
      return { ...d, recent: [next, ...d.recent.filter(x => !(x.type === item.type && x.id === item.id))].slice(0, 80) }
    }),
    recordSearch: (query) => mutate(d => {
      const value = query.trim()
      if (!value) return d
      const next = { query: value, searchedAt: new Date().toISOString() }
      return { ...d, searchHistory: [next, ...d.searchHistory.filter(item => item.query.toLowerCase() !== value.toLowerCase())].slice(0, 20) }
    }),
    clearSearchHistory: () => mutate(d => ({ ...d, searchHistory: [] })),
    recordQuizAttempt: (attempt) => mutate(d => ({ ...d, quizAttempts: [...d.quizAttempts.slice(-399), { ...attempt, completedAt: new Date().toISOString() }] })),
    reviewFlashcard: (cardId, difficulty) => mutate(d => {
      const previous = d.flashcardReviews[cardId]
      const repetitions = (previous?.repetitions ?? 0) + 1
      const stage = Math.min(repetitions - 1, reviewIntervals.length - 1)
      let days = reviewIntervals[stage]
      if (difficulty === 'hard') days = 1
      if (difficulty === 'easy') days = Math.max(days, Math.round(days * 1.5))
      const now = new Date().toISOString()
      return { ...d, resumePoint: { ...d.resumePoint, flashcardId: cardId, updatedAt: now }, flashcardReviews: { ...d.flashcardReviews, [cardId]: { cardId, difficulty, reviewedAt: now, nextReviewAt: plusDays(now, days), repetitions } } }
    }),
    saveNotebook: (doc) => mutate(d => ({ ...d, notebooks: d.notebooks.some(x => x.id === doc.id) ? d.notebooks.map(x => x.id === doc.id ? doc : x) : [doc, ...d.notebooks] })),
    deleteNotebook: (id) => mutate(d => ({ ...d, notebooks: d.notebooks.filter(x => x.id !== id) })),
    addHighlight: (highlight) => mutate(d => ({ ...d, highlights: [highlight, ...d.highlights.filter(x => x.id !== highlight.id)] })),
    removeHighlight: (id) => mutate(d => ({ ...d, highlights: d.highlights.filter(x => x.id !== id) })),
    markCountryResearched: (id) => mutate(d => ({ ...d, researchedCountries: d.researchedCountries.includes(id) ? d.researchedCountries : [...d.researchedCountries, id] })),
    toggleVisitedCountry: (id) => mutate(d => ({ ...d, visitedCountries: d.visitedCountries.includes(id) ? d.visitedCountries.filter(x => x !== id) : [...d.visitedCountries, id] })),
    markCityResearched: (id) => mutate(d => ({ ...d, researchedCities: d.researchedCities.includes(id) ? d.researchedCities : [...d.researchedCities, id] })),
    setLastVisitedPath: (path, lessonId) => mutate(d => d.lastVisitedPath === path && (!lessonId || d.lastLessonId === lessonId) ? d : ({ ...d, lastVisitedPath: path, lastLessonId: lessonId ?? d.lastLessonId })),
    setResumePoint: (point) => mutate(d => {
      const updatedAt = new Date().toISOString()
      return { ...d, lastVisitedPath: point.path, lastLessonId: point.lessonId ?? d.lastLessonId, resumePoint: { ...d.resumePoint, ...point, updatedAt } }
    }),
    updateFinancialPlan: (patch) => mutate(d => ({ ...d, financialPlan: { ...d.financialPlan, ...patch, updatedAt: new Date().toISOString() } })),
    addFinancialHistory: (entry) => mutate(d => ({ ...d, financialHistory: [...d.financialHistory.filter(x => x.id !== entry.id), entry].sort((a, b) => a.month.localeCompare(b.month)) })),
    removeFinancialHistory: (id) => mutate(d => ({ ...d, financialHistory: d.financialHistory.filter(x => x.id !== id) })),
    savePortfolioProject: (project) => mutate(d => ({ ...d, portfolioProjects: d.portfolioProjects.some(x => x.id === project.id) ? d.portfolioProjects.map(x => x.id === project.id ? project : x) : [project, ...d.portfolioProjects] })),
    deletePortfolioProject: (id) => mutate(d => ({ ...d, portfolioProjects: d.portfolioProjects.filter(x => x.id !== id) })),
    savePlaygroundState: (patch) => mutate(d => ({ ...d, playgroundState: { ...d.playgroundState, ...patch, updatedAt: new Date().toISOString() } })),
    saveCodeChallengeProgress: (progress) => mutate(d => ({ ...d, codeChallengeProgress: { ...d.codeChallengeProgress, [progress.challengeId]: progress }, resumePoint: { ...d.resumePoint, path: '/code-challenges', updatedAt: progress.updatedAt } })),
    replaceData: (next) => mutate(() => normalizeStoredData(next)),
    resetData: () => mutate(() => structuredClone(defaultData))
  }), [data, lastSyncAt, migrationNeeded, migrationRemoteExists, mutate, performSync, resolveMigration, syncStatus])

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider')
  return ctx
}
