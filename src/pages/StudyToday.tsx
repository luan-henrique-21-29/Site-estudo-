import { useMemo, useState } from 'react'
import { Brain, Dice5, Layers3, Play, TimerReset } from 'lucide-react'
import { Link } from 'react-router-dom'
import { lessons } from '../data/lessons'
import { flashcards } from '../data/activities'
import type { CourseId } from '../types'
import { useAppState } from '../hooks/useAppState'

interface SessionItem {id:string;kind:'lesson'|'review'|'flashcards';title:string;description:string;minutes:number;path:string;icon:string}

export function StudyToday() {
  const {data}=useAppState(); const [minutes,setMinutes]=useState(data.settings.defaultStudyMinutes||20); const [course,setCourse]=useState<'all'|CourseId>('all'); const [seed,setSeed]=useState(0)
  const plan=useMemo<SessionItem[]>(()=>{
    let remaining=minutes; const result:SessionItem[]=[]; const now=Date.now()
    const due=lessons.filter(l=>{const c=data.completed[l.id];return (course==='all'||l.course===course)&&c?.nextReviewAt&&new Date(c.nextReviewAt).getTime()<=now})
    if(due.length&&remaining>=5){const l=due[(new Date().getDate()+seed)%due.length];const use=Math.min(8,remaining);result.push({id:`review-${l.id}`,kind:'review',title:`Revisar: ${l.title}`,description:'Uma volta curta antes de aprender algo novo.',minutes:use,path:`/lesson/${l.id}`,icon:'🧠'});remaining-=use}
    const fresh=lessons.filter(l=>(course==='all'||l.course===course)&&!data.completed[l.id])
    let cursor=(new Date().getDate()*7+minutes+seed)%Math.max(1,fresh.length)
    while(remaining>=5&&fresh.length&&result.filter(x=>x.kind==='lesson').length<3){const l=fresh[cursor%fresh.length];if(!result.some(x=>x.id.includes(l.id))){const use=Math.min(remaining,Math.max(5,Math.min(l.estimatedMinutes,20)));result.push({id:`lesson-${l.id}`,kind:'lesson',title:l.title,description:l.description,minutes:use,path:`/lesson/${l.id}`,icon:l.course==='english'?'🇬🇧':l.course==='investments'?'💰':'💻'});remaining-=use}cursor++}
    const dueCards=flashcards.filter(c=>{if(course!=='all'&&c.course!==course)return false;const r=data.flashcardReviews[c.id];return !r||new Date(r.nextReviewAt).getTime()<=now})
    if(remaining>=3&&dueCards.length)result.push({id:'flashcards',kind:'flashcards',title:'Flashcards rápidos',description:`Revise alguns cards de ${course==='all'?'todas as áreas':'sua área escolhida'}.`,minutes:remaining,path:'/flashcards',icon:'🃏'})
    if(!result.length){const l=lessons[(new Date().getDate()+seed)%lessons.length];result.push({id:`lesson-${l.id}`,kind:'lesson',title:l.title,description:l.description,minutes:Math.min(minutes,l.estimatedMinutes),path:`/lesson/${l.id}`,icon:'📚'})}
    return result
  },[minutes,course,data.completed,data.flashcardReviews,seed])
  const total=plan.reduce((a,x)=>a+x.minutes,0)
  return <div className="page study-today-page"><section className="page-header glass-panel"><div className="mega-icon">📖</div><div><span className="eyebrow">Sessão adaptativa</span><h1>Estudar hoje</h1><p>Escolha o tempo e a área. O site combina conteúdo novo, revisão e flashcards sem ultrapassar muito a sua janela.</p></div></section><section className="glass-panel content-panel"><div className="study-controls"><div><h2>Quanto tempo?</h2><div className="chip-row">{[5,10,20,30,45,60].map(x=><button key={x} className={minutes===x?'chip selected':'chip'} onClick={()=>setMinutes(x)}>{x} min</button>)}</div></div><div><h2>Qual área?</h2><div className="chip-row">{([['all','🎲 Escolha pra mim'],['english','🇬🇧 Inglês'],['investments','💰 Investimentos'],['programming','💻 Programação']] as const).map(([k,l])=><button key={k} className={course===k?'chip selected':'chip'} onClick={()=>setCourse(k)}>{l}</button>)}</div></div></div><button className="secondary-button" onClick={()=>setSeed(v=>v+1)}><Dice5 size={18}/> Montar outra sessão</button></section>
    <section className="study-plan glass-panel"><div className="section-heading"><div><span className="eyebrow"><Layers3 size={15}/> Plano de hoje</span><h2>{total} minutos em {plan.length} bloco(s)</h2></div><span className="pill"><TimerReset size={14}/> estimativa</span></div><div className="study-plan-list">{plan.map((item,i)=><article key={item.id}><span className="study-plan-number">{i+1}</span><span className="study-plan-icon">{item.icon}</span><div><strong>{item.title}</strong><p>{item.description}</p><small>{item.minutes} min • {item.kind==='review'?'revisão':item.kind==='flashcards'?'memória ativa':'conteúdo novo'}</small></div><Link className="secondary-button" to={item.path}>Abrir <Play size={15}/></Link></article>)}</div><div className="study-plan-actions"><Link className="primary-button" to={plan[0].path}><Play size={18}/> Começar pelo primeiro</Link>{plan.find(x=>x.kind==='lesson')&&<Link className="secondary-button" to={`/focus?lesson=${plan.find(x=>x.kind==='lesson')!.id.replace('lesson-','')}&minutes=${minutes}`}>🎯 Abrir modo foco</Link>}</div></section>
    <section className="glass-panel content-panel"><h2>💡 Como usar</h2><p>Se acabar antes do tempo, ótimo. Se uma aula pedir mais atenção, pare nela. O relógio serve para organizar, não para apressar.</p></section></div>
}
