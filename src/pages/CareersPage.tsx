import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CareerSalaryPanel } from '../components/CareerSalaryPanel'
import { careers } from '../data/careers'

export function CareersPage(){
 const [params,setParams]=useSearchParams(); const requested=params.get('id'); const initial=careers.some(x=>x.id===requested)?requested!:careers[0].id
 const [active,setActive]=useState(initial); const c=careers.find(x=>x.id===active)!
 const choose=(id:string)=>{setActive(id);setParams({id},{replace:true})}
 return <div className="page"><section className="page-header glass-panel"><div className="mega-icon">💼</div><div><span className="eyebrow">Carreira</span><h1>Explore caminhos profissionais</h1><p>Entenda rotina, habilidades, vantagens, desafios, portfólio e referências salariais verificadas quando houver dados oficiais.</p></div></section><div className="career-layout"><aside className="career-list glass-panel">{careers.map(x=><button key={x.id} onClick={()=>choose(x.id)} className={active===x.id?'career-button active':'career-button'}><span>{x.icon}</span><div><strong>{x.name}</strong><small>{x.summary}</small></div></button>)}</aside><div className="career-main-stack"><section className="career-detail glass-panel"><span className="giant-career">{c.icon}</span><h1>{c.name}</h1><p>{c.summary}</p><h2>Habilidades</h2><div className="chip-row">{c.skills.map(x=><span className="chip static" key={x}>{x}</span>)}</div><h2>Roadmap</h2><ol className="roadmap">{c.roadmap.map((x,i)=><li key={x}><span>{i+1}</span>{x}</li>)}</ol><div className="split-grid"><div><h3>👍 Pontos positivos</h3>{c.pros.map(x=><p key={x}>• {x}</p>)}</div><div><h3>👎 Pontos de atenção</h3>{c.cons.map(x=><p key={x}>• {x}</p>)}</div></div><h2>Projetos de portfólio</h2>{c.portfolio.map(x=><div className="example-box" key={x}>{x}</div>)}</section><CareerSalaryPanel careerId={c.id}/></div></div></div>
}
