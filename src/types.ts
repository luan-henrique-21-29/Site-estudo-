export type CourseId = 'english' | 'investments' | 'programming'
export type Difficulty = 'hard' | 'normal' | 'easy'
export type Priority = 'low' | 'normal' | 'high'

export interface SourceRef {
  label: string
  url: string
  sourceName?: string
  publishedAt?: string
  retrievedAt?: string
}

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
  sources?: SourceRef[]
  updatedAt?: string
  prerequisites?: string[]
  nextLesson?: string
  quiz?: string[]
  flashcards?: string[]
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
  population?: number
  areaKm2?: number
  timezones?: string[]
  politicalSystem?: string
  transport?: string
  health?: string
  education?: string
  safety?: string
  internet?: string
  qualityOfLife?: string
  updatedAt?: string
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
  technologies?: string[]
  routine?: string[]
  difficulty?: string
  market?: string
  demandCountries?: string[]
}

export interface GoalSubtask {
  id: string
  title: string
  done: boolean
}

export interface Goal {
  id: string
  title: string
  target: number
  current: number
  unit: string
  deadline?: string
  priority?: Priority
  notes?: string
  subtasks?: GoalSubtask[]
  updatedAt?: string
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
  titleFontFamily: string
  codeFontFamily: string
  fontScale: number
  headingScale: number
  codeScale: number
  lineHeight: number
  cardScale: number
  radius: number
  density: 'compact' | 'normal' | 'spacious'
  animations: 'off' | 'soft' | 'normal' | 'more'
  shadow: 'off' | 'soft' | 'medium'
  backgroundMode: 'simple' | 'gradient' | 'particles' | 'stars' | 'geometry'
  sounds: boolean
  defaultStudyMinutes: number
}

export interface OnboardingPreferences {
  mainGoal: string
  sessionMinutes: number
  countries: string[]
  englishLevel: string
  programmingLevel: string
  financialGoal: string
}

export interface StudySession {
  id: string
  startedAt: string
  minutes: number
  course?: CourseId
  lessonId?: string
}

export interface RecentItem {
  id: string
  type: 'lesson' | 'country' | 'city' | 'career' | 'tool' | 'note' | 'english-lab' | 'portfolio'
  title: string
  path: string
  viewedAt: string
}

export interface QuizAttempt {
  id: string
  quizId: string
  completedAt: string
  score: number
  total: number
  wrongExerciseIds: string[]
}

export interface FlashcardReview {
  cardId: string
  difficulty: Difficulty
  reviewedAt: string
  nextReviewAt: string
  repetitions: number
}

export interface NotebookDocument {
  id: string
  title: string
  category: 'english' | 'investments' | 'programming' | 'countries' | 'free'
  content: string
  tags: string[]
  favorite: boolean
  createdAt: string
  updatedAt: string
  internalLinks: string[]
  imageUrl?: string
}

export interface Highlight {
  id: string
  lessonId: string
  text: string
  color: 'blue' | 'purple' | 'orange' | 'red' | 'pink'
  createdAt: string
}

export interface SearchHistoryItem {
  query: string
  searchedAt: string
}

export interface ResumePoint {
  path: string
  title?: string
  lessonId?: string
  sectionId?: string
  scrollY: number
  exerciseId?: string
  flashcardId?: string
  updatedAt: string
}

export interface FinancialPlan {
  monthlyIncome: number
  fixedExpenses: number
  variableExpenses: number
  savedAmount: number
  goalAmount: number
  monthlyContribution: number
  goalName: string
  updatedAt: string
}

export interface FinancialHistoryEntry {
  id: string
  month: string
  netWorth: number
  savedAmount?: number
  createdAt: string
}

export interface PortfolioProject {
  id: string
  name: string
  description: string
  technologies: string[]
  imageUrl?: string
  githubUrl?: string
  demoUrl?: string
  createdAt: string
  updatedAt: string
}

export interface PlaygroundState {
  html: string
  css: string
  javascript: string
  updatedAt: string
}

export interface CodeChallengeProgress {
  challengeId: string
  code: string
  completedAt?: string
  updatedAt: string
}

export interface AppData {
  version: number
  onboardingDone: boolean
  displayName: string
  preferences: OnboardingPreferences
  favorites: string[]
  completed: Record<string, { completedAt: string; difficulty: Difficulty; reviewStage?: number; nextReviewAt?: string }>
  notes: Record<string, string>
  noteUpdatedAt: Record<string, string>
  noteTags: Record<string, string[]>
  favoriteNotes: string[]
  goals: Goal[]
  relocationChecklist: Record<string, boolean>
  studyMinutes: number
  studySessions: StudySession[]
  recent: RecentItem[]
  searchHistory: SearchHistoryItem[]
  quizAttempts: QuizAttempt[]
  flashcardReviews: Record<string, FlashcardReview>
  notebooks: NotebookDocument[]
  highlights: Highlight[]
  researchedCountries: string[]
  visitedCountries: string[]
  researchedCities: string[]
  financialPlan: FinancialPlan
  financialHistory: FinancialHistoryEntry[]
  portfolioProjects: PortfolioProject[]
  playgroundState: PlaygroundState
  codeChallengeProgress: Record<string, CodeChallengeProgress>
  lastVisitedPath: string
  lastLessonId?: string
  resumePoint: ResumePoint
  settingsUpdatedAt: string
  updatedAt: string
  settings: UserSettings
}
