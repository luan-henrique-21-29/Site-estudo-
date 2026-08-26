import { lazy, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Onboarding } from './components/Onboarding'
import { RouteTracker } from './components/RouteTracker'
import { AppUpdateBanner } from './components/AppUpdateBanner'
import { Home } from './pages/Home'
import { CoursePage } from './pages/CoursePage'
import { LessonPage } from './pages/LessonPage'
import { StudyToday } from './pages/StudyToday'
import { FocusPage } from './pages/FocusPage'
import { SearchPage } from './pages/SearchPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { ReviewPage } from './pages/ReviewPage'
import { ProgressPage } from './pages/ProgressPage'
import { CountriesPage } from './pages/CountriesPage'
import { CountryPage } from './pages/CountryPage'
import { CitiesPage } from './pages/CitiesPage'
import { CareersPage } from './pages/CareersPage'
import { FuturePage } from './pages/FuturePage'
import { NotebookPage } from './pages/NotebookPage'
import { SettingsPage } from './pages/SettingsPage'
import { FlashcardsPage } from './pages/FlashcardsPage'
import { QuizzesPage } from './pages/QuizzesPage'
import { AccountPage } from './pages/AccountPage'
import { MorePage } from './pages/MorePage'
import { PrivacyPage } from './pages/PrivacyPage'
import { NotesPage } from './pages/NotesPage'
import { ProfilePage } from './pages/ProfilePage'
import { CalendarPage } from './pages/CalendarPage'
import { CareerDetailPage } from './pages/CareerDetailPage'
import { CityDetailPage } from './pages/CityDetailPage'
import { CountryComparePage } from './pages/CountryComparePage'
import { EnglishLabPage } from './pages/EnglishLabPage'
import { FinancialPlannerPage } from './pages/FinancialPlannerPage'
import { CityComparePage } from './pages/CityComparePage'
import { CountryGuidePage } from './pages/CountryGuidePage'
import { ProgrammingRoadmapPage } from './pages/ProgrammingRoadmapPage'
import { CodeChallengesPage } from './pages/CodeChallengesPage'
import { PortfolioPage } from './pages/PortfolioPage'
import { WorldMapPage } from './pages/WorldMapPage'

const SalariesPage = lazy(() => import('./pages/SalariesPage').then(m => ({ default: m.SalariesPage })))
const PlaygroundPage = lazy(() => import('./pages/PlaygroundPage').then(m => ({ default: m.PlaygroundPage })))
const ToolsPage = lazy(() => import('./pages/ToolsPage').then(m => ({ default: m.ToolsPage })))

function Loading(){return <div className="page"><div className="empty glass-panel">Carregando…</div></div>}
function NotFound(){return <div className="page"><div className="empty glass-panel"><h1>404</h1><p>Essa página resolveu fazer intercâmbio e ainda não voltou. 😅</p><a href="#/">Voltar ao início</a></div></div>}

export default function App(){
 return <HashRouter><RouteTracker/><Onboarding/><AppUpdateBanner/><Suspense fallback={<Loading/>}><Routes><Route element={<Layout/>}>
  <Route index element={<Home/>}/><Route path="today" element={<StudyToday/>}/><Route path="focus" element={<FocusPage/>}/>
  <Route path="course/:course" element={<CoursePage/>}/><Route path="lesson/:id" element={<LessonPage/>}/><Route path="english-lab" element={<EnglishLabPage/>}/>
  <Route path="countries" element={<CountriesPage/>}/><Route path="countries/:id" element={<CountryPage/>}/><Route path="country-guide/:id" element={<CountryGuidePage/>}/><Route path="compare-countries" element={<CountryComparePage/>}/><Route path="world-map" element={<WorldMapPage/>}/>
  <Route path="cities" element={<CitiesPage/>}/><Route path="cities/:countryId/:citySlug" element={<CityDetailPage/>}/><Route path="compare-cities" element={<CityComparePage/>}/><Route path="salaries" element={<SalariesPage/>}/>
  <Route path="programming-roadmap" element={<ProgrammingRoadmapPage/>}/><Route path="code-challenges" element={<CodeChallengesPage/>}/><Route path="playground" element={<PlaygroundPage/>}/><Route path="portfolio" element={<PortfolioPage/>}/>
  <Route path="careers" element={<CareersPage/>}/><Route path="careers/:id" element={<CareerDetailPage/>}/><Route path="future" element={<FuturePage/>}/><Route path="finance" element={<FinancialPlannerPage/>}/>
  <Route path="review" element={<ReviewPage/>}/><Route path="flashcards" element={<FlashcardsPage/>}/><Route path="quizzes" element={<QuizzesPage/>}/><Route path="notebook" element={<NotebookPage/>}/><Route path="notes" element={<NotesPage/>}/><Route path="favorites" element={<FavoritesPage/>}/><Route path="progress" element={<ProgressPage/>}/><Route path="calendar" element={<CalendarPage/>}/>
  <Route path="tools" element={<ToolsPage/>}/><Route path="search" element={<SearchPage/>}/><Route path="profile" element={<ProfilePage/>}/><Route path="settings" element={<SettingsPage/>}/><Route path="privacy" element={<PrivacyPage/>}/><Route path="account" element={<AccountPage/>}/><Route path="more" element={<MorePage/>}/>
  <Route path="*" element={<NotFound/>}/>
 </Route></Routes></Suspense></HashRouter>
}
