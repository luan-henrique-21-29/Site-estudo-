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
  titleFontFamily: 'Poppins, Inter, system-ui, sans-serif',
  codeFontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  fontScale: 1,
  headingScale: 1,
  codeScale: 1,
  lineHeight: 1.6,
  cardScale: 1,
  radius: 18,
  density: 'normal',
  animations: 'normal',
  shadow: 'soft',
  backgroundMode: 'gradient',
  sounds: false,
  defaultStudyMinutes: 20
}

export const defaultData: AppData = {
  onboardingDone: false,
  displayName: '',
  preferences: {
    mainGoal: 'Todos',
    sessionMinutes: 20,
    countries: [],
    englishLevel: 'Não sei',
    programmingLevel: 'Nunca programei',
    financialGoal: 'Aprender investimentos'
  },
  favorites: [],
  completed: {},
  notes: {},
  noteTags: {},
  favoriteNotes: [],
  goals: [
    { id: 'goal-english', title: 'Chegar ao inglês B2', target: 100, current: 5, unit: '%', priority: 'high', subtasks: [] },
    { id: 'goal-money', title: 'Meta para morar fora', target: 30000, current: 0, unit: 'R$', priority: 'high', subtasks: [] },
    { id: 'goal-code', title: 'Concluir trilha de programação', target: 100, current: 2, unit: '%', priority: 'normal', subtasks: [] }
  ],
  relocationChecklist: {},
  studyMinutes: 0,
  studySessions: [],
  recent: [],
  quizAttempts: [],
  flashcardReviews: {},
  notebooks: [],
  highlights: [],
  researchedCountries: [],
  visitedCountries: [],
  researchedCities: [],
  lastVisitedPath: '/',
  updatedAt: '',
  settings: defaultSettings
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return structuredClone(defaultData)
    const parsed = JSON.parse(raw) as Partial<AppData>
    return {
      ...structuredClone(defaultData),
      ...parsed,
      preferences: { ...defaultData.preferences, ...(parsed.preferences ?? {}) },
      favorites: parsed.favorites ?? [],
      completed: parsed.completed ?? {},
      notes: parsed.notes ?? {},
      noteTags: parsed.noteTags ?? {},
      favoriteNotes: parsed.favoriteNotes ?? [],
      goals: (parsed.goals ?? defaultData.goals).map(goal => ({ ...goal, priority: goal.priority ?? 'normal', subtasks: goal.subtasks ?? [] })),
      relocationChecklist: parsed.relocationChecklist ?? {},
      studySessions: parsed.studySessions ?? [],
      recent: parsed.recent ?? [],
      quizAttempts: parsed.quizAttempts ?? [],
      flashcardReviews: parsed.flashcardReviews ?? {},
      notebooks: parsed.notebooks ?? [],
      highlights: parsed.highlights ?? [],
      researchedCountries: parsed.researchedCountries ?? [],
      visitedCountries: parsed.visitedCountries ?? [],
      researchedCities: parsed.researchedCities ?? [],
      lastVisitedPath: parsed.lastVisitedPath ?? '/',
      updatedAt: parsed.updatedAt ?? '',
      settings: { ...defaultSettings, ...(parsed.settings ?? {}) }
    }
  } catch {
    return structuredClone(defaultData)
  }
}

export function saveData(data: AppData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // A aplicação continua utilizável mesmo se o navegador bloquear armazenamento.
  }
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
