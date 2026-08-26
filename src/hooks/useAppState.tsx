import { createContext, useContext, useEffect, useMemo, useState } from 'react'
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

const reviewIntervals = [1, 3, 7, 14, 30, 60]
const plusDays = (iso: string, days: number) => new Date(new Date(iso).getTime() + days * 86_400_000).toISOString()
const firstReviewDays = (difficulty: Difficulty) => difficulty === 'hard' ? 1 : difficulty === 'easy' ? 7 : 3

interface AppStateValue {
  data: AppData
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

  const value = useMemo<AppStateValue>(() => ({
    data,
    setOnboarding: (name) => setData(d => ({ ...d, onboardingDone: true, displayName: name.trim() })),
    completeOnboarding: (name, preferences) => setData(d => ({ ...d, onboardingDone: true, displayName: name.trim(), preferences, settings: { ...d.settings, defaultStudyMinutes: preferences.sessionMinutes } })),
    updateProfile: (name, preferences) => setData(d => ({ ...d, displayName: name.trim(), preferences: { ...d.preferences, ...preferences }, settings: preferences.sessionMinutes ? { ...d.settings, defaultStudyMinutes: preferences.sessionMinutes } : d.settings })),
    toggleFavorite: (id) => setData(d => ({ ...d, favorites: d.favorites.includes(id) ? d.favorites.filter(x => x !== id) : [...d.favorites, id] })),
    markCompleted: (id, difficulty = 'normal') => setData(d => {
      const now = new Date().toISOString()
      const previous = d.completed[id]
      const next = plusDays(now, firstReviewDays(difficulty))
      return { ...d, completed: { ...d.completed, [id]: { completedAt: previous?.completedAt ?? now, difficulty, reviewStage: previous?.reviewStage ?? 0, nextReviewAt: next } } }
    }),
    reviewLesson: (id, difficulty) => setData(d => {
      const previous = d.completed[id]
      if (!previous) return d
      const stage = Math.min((previous.reviewStage ?? 0) + 1, reviewIntervals.length - 1)
      let days = reviewIntervals[stage]
      if (difficulty === 'hard') days = Math.max(1, Math.round(days * .6))
      if (difficulty === 'easy') days = Math.max(days, Math.round(days * 1.5))
      const now = new Date().toISOString()
      return { ...d, completed: { ...d.completed, [id]: { ...previous, difficulty, reviewStage: stage, nextReviewAt: plusDays(now, days) } } }
    }),
    saveNote: (id, note) => setData(d => ({ ...d, notes: { ...d.notes, [id]: note } })),
    setNoteTags: (id, tags) => setData(d => ({ ...d, noteTags: { ...d.noteTags, [id]: [...new Set(tags.map(x => x.trim()).filter(Boolean))] } })),
    toggleFavoriteNote: (id) => setData(d => ({ ...d, favoriteNotes: d.favoriteNotes.includes(id) ? d.favoriteNotes.filter(x => x !== id) : [...d.favoriteNotes, id] })),
    updateSettings: (patch) => setData(d => ({ ...d, settings: { ...d.settings, ...patch } })),
    updateGoal: (goal) => setData(d => ({ ...d, goals: d.goals.map(g => g.id === goal.id ? goal : g) })),
    addGoal: (goal) => setData(d => ({ ...d, goals: [...d.goals, { ...goal, priority: goal.priority ?? 'normal', subtasks: goal.subtasks ?? [] }] })),
    removeGoal: (id) => setData(d => ({ ...d, goals: d.goals.filter(g => g.id !== id) })),
    toggleGoalSubtask: (goalId, subtaskId) => setData(d => ({ ...d, goals: d.goals.map(goal => goal.id !== goalId ? goal : { ...goal, subtasks: (goal.subtasks ?? []).map(task => task.id === subtaskId ? { ...task, done: !task.done } : task) }) })),
    toggleRelocationStep: (step) => setData(d => ({ ...d, relocationChecklist: { ...d.relocationChecklist, [step]: !d.relocationChecklist[step] } })),
    addStudyMinutes: (minutes, course, lessonId) => setData(d => {
      const safe = Math.max(0, minutes)
      if (!safe) return d
      const session = { id: `study-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, startedAt: new Date().toISOString(), minutes: safe, course, lessonId }
      return { ...d, studyMinutes: d.studyMinutes + safe, studySessions: [...d.studySessions.slice(-499), session] }
    }),
    recordRecent: (item) => setData(d => {
      const next = { ...item, viewedAt: new Date().toISOString() }
      return { ...d, recent: [next, ...d.recent.filter(x => !(x.type === item.type && x.id === item.id))].slice(0, 60) }
    }),
    recordQuizAttempt: (attempt) => setData(d => ({ ...d, quizAttempts: [...d.quizAttempts.slice(-199), { ...attempt, completedAt: new Date().toISOString() }] })),
    reviewFlashcard: (cardId, difficulty) => setData(d => {
      const previous = d.flashcardReviews[cardId]
      const repetitions = (previous?.repetitions ?? 0) + 1
      const stage = Math.min(repetitions - 1, reviewIntervals.length - 1)
      let days = reviewIntervals[stage]
      if (difficulty === 'hard') days = 1
      if (difficulty === 'easy') days = Math.max(days, Math.round(days * 1.5))
      const now = new Date().toISOString()
      return { ...d, flashcardReviews: { ...d.flashcardReviews, [cardId]: { cardId, difficulty, reviewedAt: now, nextReviewAt: plusDays(now, days), repetitions } } }
    }),
    saveNotebook: (doc) => setData(d => ({ ...d, notebooks: d.notebooks.some(x => x.id === doc.id) ? d.notebooks.map(x => x.id === doc.id ? doc : x) : [doc, ...d.notebooks] })),
    deleteNotebook: (id) => setData(d => ({ ...d, notebooks: d.notebooks.filter(x => x.id !== id) })),
    addHighlight: (highlight) => setData(d => ({ ...d, highlights: [highlight, ...d.highlights.filter(x => x.id !== highlight.id)] })),
    removeHighlight: (id) => setData(d => ({ ...d, highlights: d.highlights.filter(x => x.id !== id) })),
    markCountryResearched: (id) => setData(d => ({ ...d, researchedCountries: d.researchedCountries.includes(id) ? d.researchedCountries : [...d.researchedCountries, id] })),
    toggleVisitedCountry: (id) => setData(d => ({ ...d, visitedCountries: d.visitedCountries.includes(id) ? d.visitedCountries.filter(x => x !== id) : [...d.visitedCountries, id] })),
    markCityResearched: (id) => setData(d => ({ ...d, researchedCities: d.researchedCities.includes(id) ? d.researchedCities : [...d.researchedCities, id] })),
    replaceData: (next) => setData({
      ...structuredClone(defaultData),
      ...next,
      preferences: { ...defaultData.preferences, ...(next.preferences ?? {}) },
      settings: { ...defaultData.settings, ...next.settings },
      relocationChecklist: next.relocationChecklist ?? {},
      noteTags: next.noteTags ?? {},
      favoriteNotes: next.favoriteNotes ?? [],
      studySessions: next.studySessions ?? [],
      recent: next.recent ?? [],
      quizAttempts: next.quizAttempts ?? [],
      flashcardReviews: next.flashcardReviews ?? {},
      notebooks: next.notebooks ?? [],
      highlights: next.highlights ?? [],
      researchedCountries: next.researchedCountries ?? [],
      visitedCountries: next.visitedCountries ?? [],
      researchedCities: next.researchedCities ?? []
    }),
    resetData: () => setData(structuredClone(defaultData))
  }), [data])

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider')
  return ctx
}
