import { ArrowRight, BookOpenCheck, Cloud, CloudOff, Flame, History, Sparkles, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { lessons, courseMeta } from '../data/lessons'
import { countries } from '../data/countries'
import { dueLessons, minutesSince, minutesToday, studyStreak, uniqueStudyDaysThisWeek } from '../lib/studyStats'
import { useAppState } from '../hooks/useAppState'
import { useAuth } from '../hooks/useAuth'

export function Home() {
  const { data, syncStatus } = useAppState()
  const { user, configured } = useAuth()
  const completed = Object.keys(data.completed).length
  const pct = lessons.length ? Math.round((completed / lessons.length) * 100) : 0
  const due = dueLessons(data)
  const weekMinutes = minutesSince(data.studySessions, 7)
  const todayMinutes = minutesToday(data.studySessions)
  const streak = studyStreak(data.studySessions)
  const weekDays = uniqueStudyDaysThisWeek(data.studySessions)
  const resumeLesson = lessons.find(item => item.id === (data.resumePoint.lessonId ?? data.lastLessonId))
  const continuePath = data.resumePoint.path && data.resumePoint.path !== '/' ? data.resumePoint.path : '/today'
  const cloudText = !configured ? 'salvo neste aparelho' : !user ? 'entre para sincronizar' : syncStatus === 'synced' ? 'sincronizado entre dispositivos' : syncStatus === 'offline' ? 'offline • salvo localmente' : syncStatus === 'error' ? 'falha na nuvem • salvo localmente' : 'salvando alterações…'
  const perCourse = (course: keyof typeof courseMeta) => {
    const all = lessons.filter(x=>x.course===course)
    const done = all.filter(x=>data.completed[x.id]).length
    return all.length ? Math.round(done/all.length*100) : 0
  }

  return <div className="page page-home simple-home">
    <section className="hero-card glass-panel simple-hero" data-resume-section="home">
      <div><div className="eyebrow"><Sparkles size={16}/> Futuro Lab</div><h1>Oi, {data.displayName || 'Estudante'} 👋</h1><p>Um passo por vez. O site escolhe o próximo estudo sem jogar cinquenta opções na sua cara.</p></div>
      <div className="hero-actions"><Link className="primary-button study-now-button" to="/today?auto=1">▶ Estudar agora</Link><Link className="secondary-button" to={continuePath}>Continuar de onde parei <ArrowRight size={18}/></Link></div>
      <div className="save-pill">{user?<Cloud size={16}/>:<CloudOff size={16}/>} {cloudText}</div>
    </section>

    <section className="home-priority-grid">
      <article className="glass-panel home-focus-card" data-resume-section="continue"><span className="eyebrow">Continuar estudando</span><h2>{resumeLesson?.title ?? 'Sua próxima sessão está pronta'}</h2><p>{resumeLesson ? `${resumeLesson.module} • ${resumeLesson.estimatedMinutes} min${data.resumePoint.sectionId ? ` • você estava em ${data.resumePoint.sectionId}` : ''}` : 'Escolha quanto tempo você tem e o Futuro Lab monta uma sessão.'}</p><Link className="primary-button" to={continuePath}>Continuar <ArrowRight size={18}/></Link></article>
      <article className="glass-panel home-focus-card" data-resume-section="review"><span className="eyebrow">Revisar</span><h2>{due.length ? `${due.length} revisão${due.length===1?'':'ões'} para hoje` : 'Nenhuma revisão vencida'}</h2><p>{due.length ? 'Revisar um pouco agora evita ter de reaprender tudo depois.' : 'Quando algo vencer, aparece aqui.'}</p><Link className="secondary-button" to="/review">Abrir revisão</Link></article>
    </section>

    <section className="stats-grid compact-stats">
      <article className="stat-card glass-panel"><BookOpenCheck/><div><strong>{pct}%</strong><span>progresso geral</span></div></article>
      <article className="stat-card glass-panel"><Flame/><div><strong>{streak}</strong><span>dias de sequência</span></div></article>
      <article className="stat-card glass-panel"><Sparkles/><div><strong>{todayMinutes} min</strong><span>hoje • {weekMinutes} na semana</span></div></article>
      <article className="stat-card glass-panel"><Target/><div><strong>{weekDays}/5</strong><span>dias da meta semanal</span></div></article>
    </section>

    <section data-resume-section="areas"><div className="section-heading"><div><span className="eyebrow">Estudar</span><h2>O que você quer aprender?</h2></div></div><div className="simple-course-grid">
      {(Object.keys(courseMeta) as (keyof typeof courseMeta)[]).map(key=>{const meta=courseMeta[key];return <Link key={key} to={`/course/${key}`} className={`course-card course-${key} glass-panel simple-course-card`}><div className="course-icon">{meta.icon}</div><div><h3>{meta.title}</h3><p>{meta.description}</p></div><strong>{perCourse(key)}%</strong></Link>})}
      <Link to="/countries" className="course-card course-countries glass-panel simple-course-card"><div className="course-icon">🌍</div><div><h3>Países</h3><p>{countries.length} países para pesquisar e comparar.</p></div><span>Explorar</span></Link>
    </div></section>

    <section className="split-grid" data-resume-section="goals"><article className="glass-panel content-panel"><div className="section-heading"><div><span className="eyebrow">Minhas metas</span><h2>Próximos objetivos</h2></div><Link className="text-link" to="/future">Ver todas →</Link></div>{data.goals.slice(0,3).map(goal=>{const value=goal.target>0?Math.min(100,Math.round(goal.current/goal.target*100)):0;return <div className="mini-goal" key={goal.id}><div><strong>{goal.title}</strong><span>{value}%</span></div><div className="progress-line"><span style={{width:`${value}%`}}/></div></div>})}</article><article className="glass-panel content-panel"><div className="section-heading"><div><span className="eyebrow">Últimos conteúdos</span><h2><History size={20}/> Visto recentemente</h2></div></div>{data.recent.slice(0,5).length?data.recent.slice(0,5).map(item=><Link className="recent-row" key={`${item.type}:${item.id}`} to={item.path}><span>{item.title}</span><small>{new Date(item.viewedAt).toLocaleDateString('pt-BR')}</small></Link>):<p className="muted">Seu histórico aparece conforme você explora aulas, países e ferramentas.</p>}</article></section>
  </div>
}
