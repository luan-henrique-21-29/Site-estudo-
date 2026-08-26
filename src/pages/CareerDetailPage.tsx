import { useEffect } from 'react'
import { ArrowLeft, BarChart3, BriefcaseBusiness, Heart } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { CareerSalaryPanel } from '../components/CareerSalaryPanel'
import { careers } from '../data/careers'
import { occupationWagesForCareer } from '../data/occupationWages'
import { countries } from '../data/countries'
import { useAppState } from '../hooks/useAppState'

export function CareerDetailPage(){
  const {id}=useParams(); const career=careers.find(c=>c.id===id); const {data,toggleFavorite,recordRecent}=useAppState()
  useEffect(()=>{if(career)recordRecent({id:career.id,type:'career',title:career.name,path:`/careers/${career.id}`})},[career?.id])
  if(!career)return <div className="page"><h1>Carreira não encontrada</h1><Link to="/careers">Voltar às carreiras</Link></div>
  const wageRefs=occupationWagesForCareer(career.id); const countryIds=[...new Set(wageRefs.map(w=>w.countryId))]; const demand=countryIds.map(cid=>countries.find(c=>c.id===cid)).filter((x):x is NonNullable<typeof x>=>Boolean(x))
  const favoriteId=`career:${career.id}`; const favorite=data.favorites.includes(favoriteId)
  const tech=career.technologies??career.skills
  const routine=career.routine??[`Aprender e aplicar ${career.skills.slice(0,2).join(' e ')}.`,`Colaborar com outras pessoas para resolver problemas da área.`,`Documentar decisões, revisar qualidade e melhorar o trabalho entregue.`]
  return <div className="page career-detail-page"><nav className="breadcrumbs"><Link to="/">Início</Link><span>›</span><Link to="/careers">Carreiras</Link><span>›</span><span>{career.name}</span></nav><section className="career-hero glass-panel"><span className="giant-career">{career.icon}</span><div><span className="eyebrow">Guia de carreira</span><h1>{career.name}</h1><p>{career.summary}</p><div className="tags">{tech.map(x=><span key={x}>{x}</span>)}</div></div><button className="icon-button big" onClick={()=>toggleFavorite(favoriteId)} aria-label="Favoritar carreira"><Heart fill={favorite?'currentColor':'none'}/></button></section>
    <div className="split-grid"><section className="glass-panel content-panel"><h2><BriefcaseBusiness/> O que faz no dia a dia</h2>{routine.map(x=><p key={x}>• {x}</p>)}<h3>Habilidades</h3><div className="chip-row">{career.skills.map(x=><span className="chip static" key={x}>{x}</span>)}</div></section><section className="glass-panel content-panel"><h2>Mercado e dificuldade</h2><dl className="facts"><div><dt>Dificuldade de entrada</dt><dd>{career.difficulty??(career.id.includes('data')||career.id.includes('ia')?'Intermediária a alta':'Intermediária')}</dd></div><div><dt>Mercado</dt><dd>{career.market??'Varia conforme país, experiência, portfólio e ciclo econômico.'}</dd></div><div><dt>Referências salariais cadastradas</dt><dd>{wageRefs.length}</dd></div></dl>{demand.length>0&&<><h3>Países com dados públicos cadastrados</h3><div className="preferred-countries compact-countries">{demand.map(c=><Link key={c.id} to={`/countries/${c.id}`}><span>{c.flag}</span><strong>{c.name}</strong></Link>)}</div></>}</section></div>
    <section className="glass-panel content-panel"><div className="section-heading"><div><span className="eyebrow"><BarChart3 size={15}/> Roadmap visual</span><h2>Uma ordem possível de aprendizado</h2></div></div><ol className="roadmap career-roadmap-animated">{career.roadmap.map((x,i)=><li key={x}><span>{i+1}</span><div><strong>{x}</strong><small>{i===0?'Construa a base antes de acelerar.':i===career.roadmap.length-1?'Transforme o aprendizado em projeto e experiência.':'Pratique em exercícios e pequenos projetos.'}</small></div></li>)}</ol></section>
    <div className="split-grid"><section className="glass-panel content-panel good"><h2>👍 Pontos positivos</h2>{career.pros.map(x=><p key={x}>• {x}</p>)}</section><section className="glass-panel content-panel caution"><h2>👎 Pontos de atenção</h2>{career.cons.map(x=><p key={x}>• {x}</p>)}</section></div>
    <section className="glass-panel content-panel"><h2>Projetos para portfólio</h2><div className="portfolio-project-grid">{career.portfolio.map((x,i)=><article className="example-box" key={x}><strong>Projeto {i+1}</strong><span>{x}</span><small>Documente objetivo, decisões, tecnologias, desafios e o que você aprendeu.</small></article>)}</div></section>
    <CareerSalaryPanel careerId={career.id}/><Link className="secondary-button" to="/careers"><ArrowLeft size={17}/> Voltar às carreiras</Link>
  </div>
}
