import type { AppData, UserSettings } from '../types'

const KEY = 'futuro-lab-data-v1'
const now = () => new Date().toISOString()

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

const initialTime = now()

export const defaultData: AppData = {
  version: 2,
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
  noteUpdatedAt: {},
  noteTags: {},
  favoriteNotes: [],
  goals: [
    { id: 'goal-english', title: 'Chegar ao inglês B2', target: 100, current: 5, unit: '%', priority: 'high', subtasks: [], updatedAt: initialTime },
    { id: 'goal-money', title: 'Meta para morar fora', target: 30000, current: 0, unit: 'R$', priority: 'high', subtasks: [], updatedAt: initialTime },
    { id: 'goal-code', title: 'Concluir trilha de programação', target: 100, current: 2, unit: '%', priority: 'normal', subtasks: [], updatedAt: initialTime }
  ],
  relocationChecklist: {},
  studyMinutes: 0,
  studySessions: [],
  recent: [],
  searchHistory: [],
  quizAttempts: [],
  flashcardReviews: {},
  notebooks: [],
  highlights: [],
  researchedCountries: [],
  visitedCountries: [],
  researchedCities: [],
  cityCosts: {},
  countryCompareWeights: { salary: 8, safety: 9, climate: 5, language: 8, immigration: 9, cost: 8 },
  financialPlan: {
    monthlyIncome: 0,
    fixedExpenses: 0,
    variableExpenses: 0,
    savedAmount: 0,
    goalAmount: 30000,
    monthlyContribution: 0,
    goalName: 'Morar fora',
    updatedAt: initialTime
  },
  financialHistory: [],
  portfolioProjects: [],
  playgroundState: {
    html: '<main class="card">\n  <h1>Meu projeto</h1>\n  <p>Edite HTML, CSS e JavaScript e clique em Executar.</p>\n</main>',
    css: 'body { font-family: system-ui; padding: 24px; }\n.card { max-width: 560px; margin: auto; padding: 24px; border: 1px solid #ccc; border-radius: 18px; }',
    javascript: "console.log('Futuro Lab')",
    updatedAt: initialTime
  },
  codeChallengeProgress: {},
  lastVisitedPath: '/',
  resumePoint: { path: '/', scrollY: 0, updatedAt: initialTime },
  settingsUpdatedAt: initialTime,
  updatedAt: initialTime,
  settings: defaultSettings
}

export function normalizeStoredData(parsed: Partial<AppData>): AppData {
  const base = structuredClone(defaultData)
  return {
    ...base,
    ...parsed,
    version: Math.max(2, parsed.version ?? 1),
    preferences: { ...base.preferences, ...(parsed.preferences ?? {}) },
    favorites: parsed.favorites ?? [],
    completed: parsed.completed ?? {},
    notes: parsed.notes ?? {},
    noteUpdatedAt: parsed.noteUpdatedAt ?? {},
    noteTags: parsed.noteTags ?? {},
    favoriteNotes: parsed.favoriteNotes ?? [],
    goals: (parsed.goals ?? base.goals).map(goal => ({ ...goal, priority: goal.priority ?? 'normal', subtasks: goal.subtasks ?? [], updatedAt: goal.updatedAt ?? parsed.updatedAt ?? initialTime })),
    relocationChecklist: parsed.relocationChecklist ?? {},
    studySessions: parsed.studySessions ?? [],
    recent: parsed.recent ?? [],
    searchHistory: parsed.searchHistory ?? [],
    quizAttempts: parsed.quizAttempts ?? [],
    flashcardReviews: parsed.flashcardReviews ?? {},
    notebooks: parsed.notebooks ?? [],
    highlights: parsed.highlights ?? [],
    researchedCountries: parsed.researchedCountries ?? [],
    visitedCountries: parsed.visitedCountries ?? [],
    researchedCities: parsed.researchedCities ?? [],
    cityCosts: parsed.cityCosts ?? {},
    countryCompareWeights: { ...base.countryCompareWeights, ...(parsed.countryCompareWeights ?? {}) },
    financialPlan: { ...base.financialPlan, ...(parsed.financialPlan ?? {}) },
    financialHistory: parsed.financialHistory ?? [],
    portfolioProjects: parsed.portfolioProjects ?? [],
    playgroundState: { ...base.playgroundState, ...(parsed.playgroundState ?? {}) },
    codeChallengeProgress: parsed.codeChallengeProgress ?? {},
    lastVisitedPath: parsed.lastVisitedPath ?? '/',
    resumePoint: { ...base.resumePoint, ...(parsed.resumePoint ?? { path: parsed.lastVisitedPath ?? '/', lessonId: parsed.lastLessonId, scrollY: 0, updatedAt: parsed.updatedAt ?? initialTime }) },
    settingsUpdatedAt: parsed.settingsUpdatedAt ?? parsed.updatedAt ?? initialTime,
    updatedAt: parsed.updatedAt ?? initialTime,
    settings: { ...defaultSettings, ...(parsed.settings ?? {}) }
  }
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return structuredClone(defaultData)
    return normalizeStoredData(JSON.parse(raw) as Partial<AppData>)
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

export function saveSafetyBackup(data: AppData, label = 'cloud-merge') {
  try {
    localStorage.setItem(`futuro-lab-backup-${label}-${Date.now()}`, JSON.stringify(data))
  } catch {
    // Backup extra é melhor esforço; nunca bloqueia o estudo.
  }
}

export function hasMeaningfulLocalProgress(data: AppData) {
  return Object.keys(data.completed).length > 0 || Object.keys(data.notes).some(key => data.notes[key]?.trim()) || data.studyMinutes > 0 || data.notebooks.length > 0 || data.portfolioProjects.length > 0 || data.financialHistory.length > 0 || Object.keys(data.cityCosts).length > 0
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
