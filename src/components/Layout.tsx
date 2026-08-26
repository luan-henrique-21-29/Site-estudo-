import { NavLink, Outlet } from 'react-router-dom'
import { BookOpen, Brain, BriefcaseBusiness, ChartNoAxesCombined, CircleUserRound, Code2, Globe2, GraduationCap, Heart, Home, Landmark, ListChecks, NotebookPen, Search, Settings, Sparkles, Target, Wrench } from 'lucide-react'
import { AnimatedBackground } from './AnimatedBackground'

const nav = [
  ['/', Home, 'Início'],
  ['/today', Sparkles, 'Estudar Hoje'],
  ['/course/english', GraduationCap, 'Inglês'],
  ['/course/investments', Landmark, 'Investimentos'],
  ['/countries', Globe2, 'Países'],
  ['/course/programming', Code2, 'Programação'],
  ['/careers', BriefcaseBusiness, 'Carreiras'],
  ['/future', Target, 'Meu Futuro'],
  ['/review', BookOpen, 'Revisar'],
  ['/flashcards', Brain, 'Flashcards'],
  ['/quizzes', ListChecks, 'Quizzes'],
  ['/notebook', NotebookPen, 'Caderno'],
  ['/favorites', Heart, 'Favoritos'],
  ['/progress', ChartNoAxesCombined, 'Progresso'],
  ['/tools', Wrench, 'Ferramentas'],
  ['/search', Search, 'Buscar'],
  ['/settings', Settings, 'Personalizar']
] as const

export function Layout() {
  return (
    <div className="app-shell">
      <AnimatedBackground />
      <aside className="sidebar glass-panel">
        <div className="brand"><span className="brand-mark">FL</span><div><strong>Futuro Lab</strong><small>estude seu próximo passo</small></div></div>
        <nav aria-label="Navegação principal">
          {nav.map(([href, Icon, label]) => <NavLink key={href} to={href} end={href === '/'} className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}><Icon size={18}/><span>{label}</span></NavLink>)}
        </nav>
        <div className="sidebar-foot"><CircleUserRound size={18}/><span>Local-first • sem login</span></div>
      </aside>
      <main className="main-content"><Outlet /></main>
      <nav className="mobile-nav glass-panel" aria-label="Navegação mobile">
        {[
          ['/', Home, 'Início'], ['/today', Sparkles, 'Estudar'], ['/search', Search, 'Buscar'], ['/progress', ChartNoAxesCombined, 'Progresso'], ['/settings', Settings, 'Mais']
        ].map(([href, Icon, label]) => <NavLink key={href as string} to={href as string} end={href === '/'} className={({isActive}) => isActive ? 'mobile-nav-item active' : 'mobile-nav-item'}><Icon size={20}/><span>{label as string}</span></NavLink>)}
      </nav>
    </div>
  )
}
