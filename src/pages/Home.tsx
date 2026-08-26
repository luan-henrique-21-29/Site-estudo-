import { ArrowRight, BookOpenCheck, Cloud, CloudOff, Flame, Sparkles, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { lessons, courseMeta } from '../data/lessons'
import { countries } from '../data/countries'
import { useAppState } from '../hooks/useAppState'
import { useAuth } from '../hooks/useAuth'

export function Home() {
  const { data, syncStatus } = useAppState()
  const { user, configured } = useAuth()
  const completed = Object.keys(data.completed).length
  const pct = lessons.length ? Math.round((completed / lessons.length) * 100) : 0
  const perCourse = (course: keyof typeof courseMeta) => {
    const all = lessons.filter(x=>x.course===course)
    const done = all.filter(x=>data.completed[x.id]).length
    return all.length ? Math.round(done/all.length*100) : 0
  }
  const continuePath = data.lastVisitedPath && data.lastVisitedPath !== '/' ? data.lastVisitedPath : '/today'
  const cloudText = !configured ? 'salvo neste aparelho' : !user ? 'entre para sincronizar' : syncStatus === 'synced' ? 'sincronizado entre dispositivos' : 'salvando alterações…'

  return <div className="page page-home simple-home">
    <section className="hero-card glass-panel simple-hero">
      <div><div className="eyebrow"><Sparkles size={16}/> Futuro Lab</div><h1>Oi, {data.displayName || 'Estudante'} 👋</h1><p>Escolha uma coisa e avance um pouco. Sem tela lotada e sem precisar decidir vinte coisas de uma vez.</p></div>
      <div className="hero-actions"><Link className="primary-button" to={continuePath}>Continuar de onde parei <ArrowRight size={18}/></Link><Link className="secondary-button" to="/today">Escolher estudo de hoje</Link></div>
      <div className="save-pill">{user?<Cloud size={16}/>:<CloudOff size={16}/>} {cloudText}</div>
    </section>

    <section className="stats-grid compact-stats">
      <article className="stat-card glass-panel"><BookOpenCheck/><div><strong>{pct}%</strong><span>progresso geral</span></div></article>
      <article className="stat-card glass-panel"><Flame/><div><strong>{data.studyMinutes}</strong><span>minutos estudados</span></div></article>
      <article className="stat-card glass-panel"><Target/><div><strong>{data.goals.length}</strong><span>metas ativas</span></div></article>
    </section>

    <section><div className="section-heading"><div><span className="eyebrow">Estudar</span><h2>Escolha uma área</h2></div></div><div className="simple-course-grid">
      {(Object.keys(courseMeta) as (keyof typeof courseMeta)[]).map(key=>{const meta=courseMeta[key];return <Link key={key} to={`/course/${key}`} className={`course-card course-${key} glass-panel simple-course-card`}><div className="course-icon">{meta.icon}</div><div><h3>{meta.title}</h3><p>{meta.description}</p></div><strong>{perCourse(key)}%</strong></Link>})}
      <Link to="/countries" className="course-card course-countries glass-panel simple-course-card"><div className="course-icon">🌍</div><div><h3>Países</h3><p>{countries.length} países para pesquisar e comparar.</p></div><span>Explorar</span></Link>
    </div></section>

    <section className="quick-actions glass-panel"><Link to="/review">🧠 Revisar</Link><Link to="/future">🎯 Minhas metas</Link><Link to="/tools">🛠️ Ferramentas</Link><Link to="/account">👤 Conta e sincronização</Link></section>
  </div>
}
