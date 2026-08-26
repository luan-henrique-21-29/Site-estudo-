import { useMemo, useState } from 'react'
import { Dice5, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { lessons } from '../data/lessons'
import type { CourseId } from '../types'
import { useAppState } from '../hooks/useAppState'

export function StudyToday() {
  const {data}=useAppState(); const [minutes,setMinutes]=useState(20); const [course,setCourse]=useState<'all'|CourseId>('all')
  const pool=useMemo(()=>lessons.filter(l=>(course==='all'||l.course===course)&&!data.completed[l.id]),[course,data.completed]); const pick=pool.length?pool[(new Date().getDate()+minutes)%pool.length]:lessons[0]
  return <div className="page"><section className="page-header glass-panel"><div className="mega-icon">📖</div><div><span className="eyebrow">Sessão rápida</span><h1>Estudar hoje</h1><p>Escolha quanto tempo você tem. O site sugere uma aula que ainda não foi concluída.</p></div></section><section className="glass-panel content-panel"><h2>Quanto tempo?</h2><div className="chip-row">{[5,10,20,30,45,60].map(x=><button key={x} className={minutes===x?'chip selected':'chip'} onClick={()=>setMinutes(x)}>{x} min</button>)}</div><h2>Qual área?</h2><div className="chip-row">{[['all','🎲 Escolha pra mim'],['english','🇬🇧 Inglês'],['investments','💰 Investimentos'],['programming','💻 Programação']].map(([k,l])=><button key={k} className={course===k?'chip selected':'chip'} onClick={()=>setCourse(k as typeof course)}>{l}</button>)}</div></section><section className="study-pick glass-panel"><Dice5 size={34}/><span className="eyebrow">Sugestão para agora</span><h2>{pick.title}</h2><p>{pick.description}</p><div className="meta-row"><span>{pick.module}</span><span>{pick.estimatedMinutes} min</span></div><div className="button-row"><Link className="primary-button" to={`/lesson/${pick.id}`}><Play size={18}/> Começar</Link><Link className="secondary-button" to={`/focus?lesson=${pick.id}`}>🎯 Modo foco</Link></div></section></div>
}
