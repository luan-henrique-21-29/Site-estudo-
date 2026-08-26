import { NavLink, Outlet } from 'react-router-dom'
import { BookOpen, Brain, BriefcaseBusiness, ChartNoAxesCombined, ChevronDown, Code2, Globe2, GraduationCap, Home, Landmark, ListChecks, NotebookPen, Search, Settings, Sparkles, Target, UserRound, WalletCards, Wrench } from 'lucide-react'
import { AnimatedBackground } from './AnimatedBackground'
import { useAuth } from '../hooks/useAuth'
import { useAppState } from '../hooks/useAppState'

const primary = [
  ['/', Home, 'Início'],
  ['/today', Sparkles, 'Estudar'],
  ['/course/english', GraduationCap, 'Inglês'],
  ['/course/investments', Landmark, 'Investimentos'],
  ['/countries', Globe2, 'Países'],
  ['/course/programming', Code2, 'Programação'],
  ['/future', Target, 'Meu Futuro'],
  ['/progress', ChartNoAxesCombined, 'Progresso']
] as const

const extras = [
  ['/salaries', WalletCards, 'Salários'],
  ['/careers', BriefcaseBusiness, 'Carreiras'],
  ['/review', BookOpen, 'Revisar'],
  ['/flashcards', Brain, 'Flashcards'],
  ['/quizzes', ListChecks, 'Quizzes'],
  ['/notebook', NotebookPen, 'Caderno'],
  ['/playground', Code2, 'Playground'],
  ['/tools', Wrench, 'Ferramentas'],
  ['/search', Search, 'Buscar'],
  ['/settings', Settings, 'Personalizar']
] as const

function NavItems({ items }: { items: typeof primary | typeof extras }) {
  return <>{items.map(([href, Icon, label]) => <NavLink key={href} to={href} end={href === '/'} className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}><Icon size={18}/><span>{label}</span></NavLink>)}</>
}

export function Layout() {
  const { user, configured } = useAuth()
  const { syncStatus } = useAppState()
  const syncText = !configured ? 'Somente neste aparelho' : !user ? 'Entre para sincronizar' : syncStatus === 'synced' ? 'Sincronizado' : syncStatus === 'error' ? 'Erro de sincronização' : 'Salvando…'

  return (
    <div className="app-shell">
      <AnimatedBackground />
      <aside className="sidebar glass-panel">
        <div className="brand"><span className="brand-mark">FL</span><div><strong>Futuro Lab</strong><small>um passo por vez</small></div></div>
        <nav aria-label="Navegação principal">
          <NavItems items={primary}/>
          <details className="more-nav">
            <summary><ChevronDown size={17}/> Mais opções</summary>
            <div className="more-nav-list"><NavItems items={extras}/></div>
          </details>
        </nav>
        <NavLink to="/account" className={({isActive})=>isActive?'account-shortcut active':'account-shortcut'}>
          <UserRound size={19}/><div><strong>{user?.email ? 'Minha conta' : 'Conta'}</strong><small>{syncText}</small></div>
        </NavLink>
      </aside>
      <main className="main-content"><Outlet /></main>
      <nav className="mobile-nav glass-panel" aria-label="Navegação mobile">
        {[
          ['/', Home, 'Início'], ['/today', Sparkles, 'Estudar'], ['/search', Search, 'Buscar'], ['/progress', ChartNoAxesCombined, 'Progresso'], ['/account', UserRound, 'Conta']
        ].map(([href, Icon, label]) => <NavLink key={href as string} to={href as string} end={href === '/'} className={({isActive}) => isActive ? 'mobile-nav-item active' : 'mobile-nav-item'}><Icon size={20}/><span>{label as string}</span></NavLink>)}
      </nav>
    </div>
  )
}
