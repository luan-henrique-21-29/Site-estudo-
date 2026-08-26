import type { AppData, FinancialHistoryEntry, Goal, NotebookDocument, PortfolioProject, RecentItem, StudySession } from '../types'
import { normalizeStoredData } from './storage'

const stamp = (value?: string) => value ? Date.parse(value) || 0 : 0
const newest = <T,>(a: T, aTime?: string, b?: T, bTime?: string) => !b || stamp(aTime) >= stamp(bTime) ? a : b

function uniqueStrings(a: string[], b: string[]) {
  return [...new Set([...a, ...b])]
}

function mergeById<T extends { id: string }>(a: T[], b: T[], updatedAt: (item: T) => string | undefined): T[] {
  const map = new Map<string, T>()
  for (const item of [...a, ...b]) {
    const current = map.get(item.id)
    if (!current || stamp(updatedAt(item)) >= stamp(updatedAt(current))) map.set(item.id, item)
  }
  return [...map.values()]
}

function mergeStudySessions(a: StudySession[], b: StudySession[]) {
  return mergeById(a, b, item => item.startedAt).sort((x, y) => stamp(x.startedAt) - stamp(y.startedAt)).slice(-1000)
}

function mergeRecent(a: RecentItem[], b: RecentItem[]) {
  const map = new Map<string, RecentItem>()
  for (const item of [...a, ...b]) {
    const key = `${item.type}:${item.id}`
    const current = map.get(key)
    if (!current || stamp(item.viewedAt) > stamp(current.viewedAt)) map.set(key, item)
  }
  return [...map.values()].sort((x, y) => stamp(y.viewedAt) - stamp(x.viewedAt)).slice(0, 80)
}

function mergeGoals(a: Goal[], b: Goal[]) {
  return mergeById(a, b, item => item.updatedAt)
}

function mergeNotebooks(a: NotebookDocument[], b: NotebookDocument[]) {
  return mergeById(a, b, item => item.updatedAt).sort((x, y) => stamp(y.updatedAt) - stamp(x.updatedAt))
}

function mergePortfolio(a: PortfolioProject[], b: PortfolioProject[]) {
  return mergeById(a, b, item => item.updatedAt).sort((x, y) => stamp(y.updatedAt) - stamp(x.updatedAt))
}

function mergeFinancialHistory(a: FinancialHistoryEntry[], b: FinancialHistoryEntry[]) {
  return mergeById(a, b, item => item.createdAt).sort((x, y) => x.month.localeCompare(y.month))
}

export function mergeAppData(localInput: AppData, remoteInput: AppData): AppData {
  const local = normalizeStoredData(localInput)
  const remote = normalizeStoredData(remoteInput)
  const localNewer = stamp(local.updatedAt) >= stamp(remote.updatedAt)
  const base = localNewer ? local : remote
  const other = localNewer ? remote : local

  const completed = { ...other.completed }
  for (const [id, item] of Object.entries(base.completed)) {
    const previous = completed[id]
    const itemTime = Math.max(stamp(item.nextReviewAt), stamp(item.completedAt))
    const previousTime = previous ? Math.max(stamp(previous.nextReviewAt), stamp(previous.completedAt)) : 0
    if (!previous || itemTime >= previousTime) completed[id] = item
  }

  const notes = { ...other.notes }
  const noteUpdatedAt = { ...other.noteUpdatedAt }
  for (const [id, value] of Object.entries(base.notes)) {
    const baseTime = stamp(base.noteUpdatedAt[id] ?? base.updatedAt)
    const otherTime = stamp(other.noteUpdatedAt[id] ?? other.updatedAt)
    if (!(id in notes) || baseTime >= otherTime) {
      notes[id] = value
      noteUpdatedAt[id] = base.noteUpdatedAt[id] ?? base.updatedAt
    }
  }

  const noteTags = { ...other.noteTags, ...base.noteTags }
  for (const id of new Set([...Object.keys(local.noteTags), ...Object.keys(remote.noteTags)])) {
    noteTags[id] = uniqueStrings(local.noteTags[id] ?? [], remote.noteTags[id] ?? [])
  }

  const flashcardReviews = { ...other.flashcardReviews }
  for (const [id, value] of Object.entries(base.flashcardReviews)) {
    const previous = flashcardReviews[id]
    if (!previous || stamp(value.reviewedAt) >= stamp(previous.reviewedAt)) flashcardReviews[id] = value
  }

  const codeChallengeProgress = { ...other.codeChallengeProgress }
  for (const [id, value] of Object.entries(base.codeChallengeProgress)) {
    const previous = codeChallengeProgress[id]
    if (!previous || stamp(value.updatedAt) >= stamp(previous.updatedAt)) codeChallengeProgress[id] = value
  }

  const localSearch = new Map(local.searchHistory.map(item => [item.query.toLowerCase(), item]))
  for (const item of remote.searchHistory) {
    const key = item.query.toLowerCase()
    const previous = localSearch.get(key)
    if (!previous || stamp(item.searchedAt) > stamp(previous.searchedAt)) localSearch.set(key, item)
  }

  const quizAttempts = mergeById(local.quizAttempts, remote.quizAttempts, item => item.completedAt).sort((a, b) => stamp(a.completedAt) - stamp(b.completedAt)).slice(-400)
  const highlights = mergeById(local.highlights, remote.highlights, item => item.createdAt)

  const merged: AppData = {
    ...base,
    version: Math.max(local.version, remote.version, 2),
    favorites: uniqueStrings(local.favorites, remote.favorites),
    completed,
    notes,
    noteUpdatedAt,
    noteTags,
    favoriteNotes: uniqueStrings(local.favoriteNotes, remote.favoriteNotes),
    goals: mergeGoals(local.goals, remote.goals),
    relocationChecklist: { ...other.relocationChecklist, ...base.relocationChecklist },
    studyMinutes: Math.max(local.studyMinutes, remote.studyMinutes, mergeStudySessions(local.studySessions, remote.studySessions).reduce((sum, item) => sum + item.minutes, 0)),
    studySessions: mergeStudySessions(local.studySessions, remote.studySessions),
    recent: mergeRecent(local.recent, remote.recent),
    searchHistory: [...localSearch.values()].sort((a, b) => stamp(b.searchedAt) - stamp(a.searchedAt)).slice(0, 20),
    quizAttempts,
    flashcardReviews,
    notebooks: mergeNotebooks(local.notebooks, remote.notebooks),
    highlights,
    researchedCountries: uniqueStrings(local.researchedCountries, remote.researchedCountries),
    visitedCountries: uniqueStrings(local.visitedCountries, remote.visitedCountries),
    researchedCities: uniqueStrings(local.researchedCities, remote.researchedCities),
    financialPlan: newest(local.financialPlan, local.financialPlan.updatedAt, remote.financialPlan, remote.financialPlan.updatedAt),
    financialHistory: mergeFinancialHistory(local.financialHistory, remote.financialHistory),
    portfolioProjects: mergePortfolio(local.portfolioProjects, remote.portfolioProjects),
    playgroundState: newest(local.playgroundState, local.playgroundState.updatedAt, remote.playgroundState, remote.playgroundState.updatedAt),
    codeChallengeProgress,
    resumePoint: newest(local.resumePoint, local.resumePoint.updatedAt, remote.resumePoint, remote.resumePoint.updatedAt),
    lastVisitedPath: newest(local.lastVisitedPath, local.resumePoint.updatedAt, remote.lastVisitedPath, remote.resumePoint.updatedAt),
    lastLessonId: newest(local.lastLessonId, local.resumePoint.updatedAt, remote.lastLessonId, remote.resumePoint.updatedAt),
    settings: newest(local.settings, local.settingsUpdatedAt, remote.settings, remote.settingsUpdatedAt),
    settingsUpdatedAt: stamp(local.settingsUpdatedAt) >= stamp(remote.settingsUpdatedAt) ? local.settingsUpdatedAt : remote.settingsUpdatedAt,
    updatedAt: new Date(Math.max(stamp(local.updatedAt), stamp(remote.updatedAt), Date.now())).toISOString()
  }

  return normalizeStoredData(merged)
}
