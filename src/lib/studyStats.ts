import type { AppData, StudySession } from '../types'
import { lessons } from '../data/lessons'

const DAY = 86_400_000
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()

export function minutesSince(sessions: StudySession[], days: number, now = new Date()) {
  const cutoff = startOfDay(now) - (days - 1) * DAY
  return sessions.filter(item => Date.parse(item.startedAt) >= cutoff).reduce((sum, item) => sum + item.minutes, 0)
}

export function minutesToday(sessions: StudySession[], now = new Date()) {
  const today = startOfDay(now)
  return sessions.filter(item => startOfDay(new Date(item.startedAt)) === today).reduce((sum, item) => sum + item.minutes, 0)
}

export function activeStudyDays(sessions: StudySession[]) {
  return new Set(sessions.map(item => new Date(item.startedAt).toISOString().slice(0, 10)))
}

export function studyStreak(sessions: StudySession[], now = new Date()) {
  const days = activeStudyDays(sessions)
  let streak = 0
  let cursor = startOfDay(now)
  const todayKey = new Date(cursor).toISOString().slice(0, 10)
  if (!days.has(todayKey)) cursor -= DAY
  while (days.has(new Date(cursor).toISOString().slice(0, 10))) {
    streak += 1
    cursor -= DAY
  }
  return streak
}

export function dueLessons(data: AppData, now = Date.now()) {
  return lessons.filter(lesson => {
    const item = data.completed[lesson.id]
    return item?.nextReviewAt ? Date.parse(item.nextReviewAt) <= now : false
  })
}

export function sessionsThisWeek(sessions: StudySession[], now = new Date()) {
  const day = now.getDay()
  const mondayOffset = day === 0 ? 6 : day - 1
  const monday = startOfDay(now) - mondayOffset * DAY
  return sessions.filter(item => Date.parse(item.startedAt) >= monday)
}

export function uniqueStudyDaysThisWeek(sessions: StudySession[], now = new Date()) {
  return new Set(sessionsThisWeek(sessions, now).map(item => item.startedAt.slice(0, 10))).size
}
