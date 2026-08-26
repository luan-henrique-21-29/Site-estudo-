import { CheckCircle2, Circle, CircleDot, Code2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { lessons } from '../data/lessons'
import { useAppState } from '../hooks/useAppState'

const stages=[
  {id:'computer',title:'Computador',keywords:['computador','hardware','software','internet','servidor','cliente']},
  {id:'logic',title:'Lógica',keywords:['lógica','algoritmo','variável','boolean','condicional','loop']},
  {id:'html',title:'HTML',keywords:['html']},
  {id:'css',title:'CSS',keywords:['css','flex','grid','responsiv']},
  {id:'javascript',title:'JavaScript',keywords:['javascript','array','objeto','função','dom','async','fetch']},
  {id:'git',title:'Git',keywords:['git ']},
  {id:'github',title:'GitHub',keywords:['github']},
  {id:'typescript',title:'TypeScript',keywords:['typescript']},
  {id:'react',title:'React',keywords:['react','hook','component']},
  {id:'api',title:'APIs',keywords:['api','http','rest','json']},
  {id:'backend',title:'Back-end',keywords:['node','backend','back-end','servidor']},
  {id:'database',title:'Banco de dados',keywords:['banco de dados','sql','postgres','mongodb']},
  {id:'projects',title:'Projetos',keywords:['projeto','portfólio','portfolio']}
]

export function ProgrammingRoadmapPage(){
 const {data}=useAppState(); const programming=lessons.filter(l=>l.course==='programming')
 const rows=stages.map(stage=>{const related=programming.filter(l=>{const text=`${l.title} ${l.module} ${l.tags.join(' ')} ${l.description}`.toLowerCase();return stage.keywords.some(k=>text.includes(k))});const done=related.filter(l=>data.completed[l.id]).length;const pct=related.length?Math.round(done/related.length*100):0;return {...stage,related,done,pct}})
 return <div className="page roadmap-page"><section className="page-header glass-panel"><Code2 className="mega-icon-svg"/><div><span className="eyebrow">Programação sem pular degraus</span><h1>Roadmap principal</h1><p>Computador → lógica → web → JavaScript → ferramentas → React → back-end → projetos. O progresso vem das aulas que você realmente concluiu.</p></div></section><section className="roadmap-visual glass-panel">{rows.map((row,index)=>{const state=row.pct===100?'done':row.pct>0?'current':'open';return <article className={`roadmap-stage ${state}`} key={row.id}><div className="roadmap-marker">{state==='done'?<CheckCircle2/>:state==='current'?<CircleDot/>:<Circle/>}</div><div className="roadmap-stage-body"><div className="section-heading"><div><span className="eyebrow">Etapa {index+1}</span><h2>{row.title}</h2></div><strong>{row.pct}%</strong></div><div className="progress-line"><span style={{width:`${row.pct}%`}}/></div><p>{row.related.length?`${row.done} de ${row.related.length} aulas relacionadas concluídas.`:'Esta etapa ainda será ligada a mais aulas conforme o conteúdo crescer.'}</p><div className="chip-row">{row.related.slice(0,4).map(l=><Link className="chip" key={l.id} to={`/lesson/${l.id}`}>{data.completed[l.id]?'✅':'○'} {l.title}</Link>)}</div></div></article>})}</section><section className="glass-panel content-panel"><h2>Prática</h2><div className="button-row"><Link className="primary-button" to="/code-challenges">Abrir desafios de código</Link><Link className="secondary-button" to="/playground">Abrir playground</Link><Link className="secondary-button" to="/portfolio">Meus projetos</Link></div></section></div>
}
