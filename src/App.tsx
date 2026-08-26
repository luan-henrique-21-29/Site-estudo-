import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Onboarding } from './components/Onboarding'
import { RouteTracker } from './components/RouteTracker'
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
import { SalariesPage } from './pages/SalariesPage'
import { PlaygroundPage } from './pages/PlaygroundPage'
import { CareersPage } from './pages/CareersPage'
import { FuturePage } from './pages/FuturePage'
import { NotebookPage } from './pages/NotebookPage'
import { ToolsPage } from './pages/ToolsPage'
import { SettingsPage } from './pages/SettingsPage'
import { FlashcardsPage } from './pages/FlashcardsPage'
import { QuizzesPage } from './pages/QuizzesPage'
import { AccountPage } from './pages/AccountPage'

function NotFound(){return <div className="page"><div className="empty glass-panel"><h1>404</h1><p>Essa página resolveu fazer intercâmbio e ainda não voltou. 😅</p><a href="#/">Voltar ao início</a></div></div>}

export default function App(){
 return <HashRouter><RouteTracker/><Onboarding/><Routes><Route element={<Layout/>}><Route index element={<Home/>}/><Route path="today" element={<StudyToday/>}/><Route path="focus" element={<FocusPage/>}/><Route path="course/:course" element={<CoursePage/>}/><Route path="lesson/:id" element={<LessonPage/>}/><Route path="countries" element={<CountriesPage/>}/><Route path="countries/:id" element={<CountryPage/>}/><Route path="cities" element={<CitiesPage/>}/><Route path="salaries" element={<SalariesPage/>}/><Route path="playground" element={<PlaygroundPage/>}/><Route path="careers" element={<CareersPage/>}/><Route path="future" element={<FuturePage/>}/><Route path="review" element={<ReviewPage/>}/><Route path="flashcards" element={<FlashcardsPage/>}/><Route path="quizzes" element={<QuizzesPage/>}/><Route path="notebook" element={<NotebookPage/>}/><Route path="favorites" element={<FavoritesPage/>}/><Route path="progress" element={<ProgressPage/>}/><Route path="tools" element={<ToolsPage/>}/><Route path="search" element={<SearchPage/>}/><Route path="settings" element={<SettingsPage/>}/><Route path="account" element={<AccountPage/>}/><Route path="*" element={<NotFound/>}/></Route></Routes></HashRouter>
}
