import type { AppData, UserSettings } from '../types'

const KEY = 'futuro-lab-data-v1'

export const defaultSettings: UserSettings = {
  themeName: 'Midnight',
  primary: '#6d5dfc',
  secondary: '#6aa8ff',
  accent: '#ff5d8f',
  background: '#0b1020',
  surface: '#151d33',
  text: '#f6f7fb',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontScale: 1,
  radius: 18,
  density: 'normal',
  animations: 'normal'
}

export const defaultData: AppData = {
  onboardingDone: false,
  displayName: '',
  favorites: [],
  completed: {},
  notes: {},
  goals: [
    { id: 'goal-english', title: 'Chegar ao inglês B2', target: 100, current: 5, unit: '%' },
    { id: 'goal-money', title: 'Meta para morar fora', target: 30000, current: 0, unit: 'R$' },
    { id: 'goal-code', title: 'Concluir trilha de programação', target: 100, current: 2, unit: '%' }
  ],
  studyMinutes: 0,
  settings: defaultSettings
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultData
    const parsed = JSON.parse(raw) as Partial<AppData>
    return {
      ...defaultData,
      ...parsed,
      settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
      goals: parsed.goals ?? defaultData.goals
    }
  } catch {
    return defaultData
  }
}

export function saveData(data: AppData) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function exportData(data: AppData) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `futuro-lab-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
