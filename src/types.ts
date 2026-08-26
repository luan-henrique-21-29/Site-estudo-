export type CourseId = 'english' | 'investments' | 'programming'

export interface Lesson {
  id: string
  slug: string
  title: string
  description: string
  course: CourseId
  module: string
  level: string
  estimatedMinutes: number
  content: string[]
  examples: string[]
  warnings: string[]
  tip: string
  quote: string
  notebookDrawing: string
  tags: string[]
}

export interface Country {
  id: string
  name: string
  flag: string
  capital: string
  currency: string
  languages: string[]
  region: string
  climate: string
  cities: string[]
  pros: string[]
  cons: string[]
  bestFor: string[]
  harderFor: string[]
  dynamicNote: string
  sources: string[]
}

export interface Career {
  id: string
  name: string
  icon: string
  summary: string
  skills: string[]
  roadmap: string[]
  pros: string[]
  cons: string[]
  portfolio: string[]
}

export interface Goal {
  id: string
  title: string
  target: number
  current: number
  unit: string
  deadline?: string
}

export interface UserSettings {
  themeName: string
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  fontFamily: string
  fontScale: number
  radius: number
  density: 'compact' | 'normal' | 'spacious'
  animations: 'off' | 'soft' | 'normal' | 'more'
}

export interface AppData {
  onboardingDone: boolean
  displayName: string
  favorites: string[]
  completed: Record<string, { completedAt: string; difficulty: 'hard' | 'normal' | 'easy' }>
  notes: Record<string, string>
  goals: Goal[]
  relocationChecklist: Record<string, boolean>
  studyMinutes: number
  settings: UserSettings
}
