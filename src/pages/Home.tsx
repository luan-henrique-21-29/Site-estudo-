import { ArrowRight, BookOpenCheck, Flame, Sparkles, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { lessons, courseMeta } from '../data/lessons'
import { useAppState } from '../hooks/useAppState'

export function Home() {
  const { data } = useAppState()
  const completed = Object.keys(data.completed).length
  const pct = Math.round((completed / lessons.length) * 100)
  const perCourse = (course: keyof typeof courseMeta) => {
    const all = lessons.filter(x=>x.course===course)
    const done = all.filter(x=>data.completed[x.id]).length
    return Math.round(done/all.length*100)
  }
  return <div className="page page-home">
    <section className="hero-card glass-panel">
      <div className="eyebrow"><Sparkles size={16}/> Seu espaço pessoal de evolução</div>
      <h1>Oi, {data.displayName || 'Estudante'} 👋</h1>
      <p>Escolha um assunto, estude em partes pequenas e acompanhe seu futuro ficando mais claro.</p>
      <div className="hero-actions"><Link className="primary-button" to="/today">Estudar agora <ArrowRight size={18}/></Link><Link className="secondary-button" to="/future">Ver minhas metas <Target size={18}/></Link></div>
      <div className="hero-orbit" aria-hidden="true"><span>🇬🇧</span><span>💰</span><span>🌍</span><span>💻</span></div>
    </section>
    <section className="stats-grid">
      <article className="stat-card glass-panel"><Flame/><div><strong>{completed}</strong><span>aulas concluídas</span></div></article>
      <article className="stat-card glass-panel"><BookOpenCheck/><div><strong>{pct}%</strong><span>progresso geral</span></div></article>
      <article className="stat-card glass-panel"><Sparkles/><div><strong>{data.studyMinutes}</strong><span>minutos registrados</span></div></article>
    </section>
    <section><div className="section-heading"><div><span className="eyebrow">Trilhas</span><h2>O que você quer estudar?</h2></div></div><div className="course-grid">
      {(Object.keys(courseMeta) as (keyof typeof courseMeta)[]).map(key=>{const meta=courseMeta[key]; return <Link key={key} to={`/course/${key}`} className={`course-card course-${key} glass-panel`}><div className="course-icon">{meta.icon}</div><h3>{meta.title}</h3><p>{meta.description}</p><div className="progress-line"><span style={{width:`${perCourse(key)}%`}}/></div><small>{perCourse(key)}% concluído</small></Link>})}
      <Link to="/countries" className="course-card course-countries glass-panel"><div className="course-icon">🌍</div><h3>Países</h3><p>Compare países, cidades, idiomas, pontos positivos e desafios.</p><span className="text-link">Explorar países →</span></Link>
      <Link to="/careers" className="course-card course-careers glass-panel"><div className="course-icon">💼</div><h3>Carreiras</h3><p>Conheça rotinas, habilidades, roadmaps e ideias de portfólio.</p><span className="text-link">Ver carreiras →</span></Link>
    </div></section>
    <section className="split-grid"><article className="glass-panel feature-card"><span className="eyebrow">📓 Modo caderno</span><h2>Conteúdo pronto para copiar.</h2><p>Cada aula tem dica bônus, frase da página, exemplo e desenho fácil.</p><Link className="text-link" to="/course/english">Abrir uma aula →</Link></article><article className="glass-panel feature-card"><span className="eyebrow">🧠 Revisão</span><h2>Volte no que precisa fixar.</h2><p>As aulas concluídas entram em um sistema simples de revisão por dificuldade.</p><Link className="text-link" to="/review">Revisar agora →</Link></article></section>
  </div>
}
