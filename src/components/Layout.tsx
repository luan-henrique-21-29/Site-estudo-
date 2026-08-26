import { NavLink, Outlet } from 'react-router-dom'
import { BookOpen, Brain, BriefcaseBusiness, ChartNoAxesCombined, ChevronDown, Code2, Globe2, GraduationCap, Home, Landmark, ListChecks, Menu, NotebookPen, Search, Settings, Sparkles, Target, UserRound, WalletCards, Wrench } from 'lucide-react'
import { AnimatedBackground } from './AnimatedBackground'
import { useAuth } from '../hooks/useAuth'
import { useAppState } from '../hooks/useAppState'

const primary = [
  ['/', Home, 'Início'],
  ['/today', Sparkles, 'Estudar'],
  ['/course/english', GraduationCap, 'Inglês'],
  ['/course/investments', Landmark, 'Investimentos'],
  ['/course/programming', Code2, 'Programação'],
  ['/countries', Globe2, 'Países'],
  ['/future', Target, 'Meu Futuro']
] as const

const extras = [
  ['/review', BookOpen, 'Revisar'],
  ['/flashcards', Brain, 'Flashcards'],
  ['/quizzes', ListChecks, 'Quizzes'],
  ['/english-lab', GraduationCap, 'Lab de inglês'],
  ['/notebook', NotebookPen, 'Caderno'],
  ['/salaries', WalletCards, 'Salários'],
  ['/careers', BriefcaseBusiness, 'Carreiras'],
  ['/playground', Code2, 'Playground'],
  ['/tools', Wrench, 'Ferramentas'],
  ['/progress', ChartNoAxesCombined, 'Progresso'],
  ['/search', Search, 'Buscar'],
  ['/settings', Settings, 'Personalizar']
] as const

function NavItems({ items }: { items: typeof primary | typeof extras }) {
  return <>{items.map(([href, Icon, label]) => <NavLink key={href} to={href} end={href === '/'} className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}><Icon size={18}/><span>{label}</span></NavLink>)}</>
}

export function Layout() {
  const { user, configured } = useAuth()
  const { syncStatus } = useAppState()
  const syncText = !configured ? 'Somente neste aparelho' : !user ? 'Entre para sincronizar' : syncStatus === 'synced' ? 'Sincronizado' : syncStatus === 'offline' ? 'Offline • salvo localmente' : syncStatus === 'paused' ? 'Nuvem pausada' : syncStatus === 'error' ? 'Erro • salvo localmente' : 'Salvando…'

  return (
    <div className="app-shell">
      <AnimatedBackground />
      <aside className="sidebar glass-panel">
        <div className="brand"><span className="brand-mark">FL</span><div><strong>Futuro Lab</strong><small>um passo por vez</small></div></div>
        <nav aria-label="Navegação principal">
          <NavItems items={primary}/>
          <details className="more-nav">
            <summary><ChevronDown size={17}/> Mais</summary>
            <div className="more-nav-list"><NavItems items={extras}/><NavLink to="/more" className={({isActive})=>isActive?'nav-item active':'nav-item'}><Menu size={18}/><span>Ver tudo</span></NavLink></div>
          </details>
        </nav>
        <NavLink to="/account" className={({isActive})=>isActive?'account-shortcut active':'account-shortcut'}>
          <UserRound size={19}/><div><strong>{user?.email ? 'Minha conta' : 'Conta'}</strong><small>{syncText}</small></div>
        </NavLink>
      </aside>
      <main className="main-content"><Outlet /></main>
      <nav className="mobile-nav glass-panel" aria-label="Navegação mobile">
        {[
          ['/', Home, 'Início'], ['/today', Sparkles, 'Estudar'], ['/search', Search, 'Buscar'], ['/progress', ChartNoAxesCombined, 'Progresso'], ['/more', Menu, 'Mais']
        ].map(([href, Icon, label]) => <NavLink key={href as string} to={href as string} end={href === '/'} className={({isActive}) => isActive ? 'mobile-nav-item active' : 'mobile-nav-item'}><Icon size={20}/><span>{label as string}</span></NavLink>)}
      </nav>
    </div>
  )
}
