import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { lessons } from '../data/lessons'
import { countries } from '../data/countries'
import { careers } from '../data/careers'
import { wages } from '../data/wages'
import { occupationWages } from '../data/occupationWages'
import { formatMoney, hourlyEquivalent, monthlyEquivalent } from '../lib/wageMath'
import { occupationHourly, occupationMonthly } from '../lib/occupationWageMath'
import { useAppState } from '../hooks/useAppState'
import type { CourseId } from '../types'

const countryMap=new Map(countries.map(c=>[c.id,c]))
type Category='all'|'lessons'|'countries'|'careers'|'salaries'|'cities'|'notes'

export function SearchPage(){
  const {data}=useAppState(); const [q,setQ]=useState(''); const [category,setCategory]=useState<Category>('all'); const [course,setCourse]=useState<'all'|CourseId>('all'); const [level,setLevel]=useState('all'); const [duration,setDuration]=useState('all'); const [status,setStatus]=useState<'all'|'done'|'open'>('all'); const query=q.trim().toLowerCase()
  const match=(text:string)=>!query||text.toLowerCase().includes(query)
  const lessonResults=useMemo(()=>lessons.filter(x=>{
    if(category!=='all'&&category!=='lessons')return false
    if(!match(`${x.title} ${x.description} ${x.module} ${x.tags.join(' ')} ${x.content.join(' ')}`))return false
    if(course!=='all'&&x.course!==course)return false
    if(level!=='all'&&x.level!==level)return false
    if(duration==='short'&&x.estimatedMinutes>10)return false
    if(duration==='medium'&&(x.estimatedMinutes<=10||x.estimatedMinutes>20))return false
    if(duration==='long'&&x.estimatedMinutes<=20)return false
    if(status==='done'&&!data.completed[x.id])return false
    if(status==='open'&&data.completed[x.id])return false
    return true
  }).slice(0,40),[query,category,course,level,duration,status,data.completed])
  const countryResults=useMemo(()=>category!=='all'&&category!=='countries'?[]:countries.filter(x=>match(`${x.name} ${x.capital} ${x.languages.join(' ')} ${x.cities.join(' ')} ${x.region} ${x.bestFor.join(' ')}`)).slice(0,24),[query,category])
  const cityResults=useMemo(()=>category!=='all'&&category!=='cities'?[]:countries.flatMap(c=>c.cities.map(city=>({city,country:c}))).filter(x=>match(`${x.city} ${x.country.name} ${x.country.region}`)).slice(0,30),[query,category])
  const careerResults=useMemo(()=>category!=='all'&&category!=='careers'?[]:careers.filter(x=>match(`${x.name} ${x.summary} ${x.skills.join(' ')} ${x.roadmap.join(' ')}`)).slice(0,20),[query,category])
  const wageResults=useMemo(()=>category!=='all'&&category!=='salaries'?[]:wages.filter(x=>{const c=countryMap.get(x.countryId);return match(`${c?.name??''} salário minimo salário mínimo piso ${x.headline} ${x.currency}`)}).slice(0,20),[query,category])
  const occupationResults=useMemo(()=>category!=='all'&&category!=='salaries'?[]:occupationWages.filter(x=>{const c=countryMap.get(x.countryId);return match(`${c?.name??''} salário profissão carreira ${x.occupation} ${x.currency}`)}).slice(0,24),[query,category])
  const noteResults=useMemo(()=>category!=='all'&&category!=='notes'?[]:Object.entries(data.notes).filter(([,note])=>note.trim()).map(([id,note])=>({id,note,lesson:lessons.find(l=>l.id===id),tags:data.noteTags[id]??[]})).filter(x=>match(`${x.note} ${x.lesson?.title??''} ${x.tags.join(' ')}`)).slice(0,20),[query,category,data.notes,data.noteTags])
  const levels=[...new Set(lessons.map(l=>l.level))]
  const total=lessonResults.length+countryResults.length+cityResults.length+careerResults.length+wageResults.length+occupationResults.length+noteResults.length
  return <div className="page search-page"><section className="page-header glass-panel"><Search className="mega-icon-svg"/><div><span className="eyebrow">Busca universal</span><h1>Encontre qualquer assunto</h1><p>Pesquise aulas, países, cidades, habilidades, carreiras, salários e suas próprias notas.</p></div></section><section className="search-controls glass-panel"><div className="search-box"><Search/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Ex.: inflação, Irlanda, JavaScript array, salário programador Canadá..."/></div><div className="search-filter-grid"><label>Categoria<select value={category} onChange={e=>setCategory(e.target.value as Category)}><option value="all">Tudo</option><option value="lessons">Aulas</option><option value="countries">Países</option><option value="cities">Cidades</option><option value="careers">Carreiras</option><option value="salaries">Salários</option><option value="notes">Minhas notas</option></select></label><label>Matéria<select value={course} onChange={e=>setCourse(e.target.value as typeof course)}><option value="all">Todas</option><option value="english">Inglês</option><option value="investments">Investimentos</option><option value="programming">Programação</option></select></label><label>Nível<select value={level} onChange={e=>setLevel(e.target.value)}><option value="all">Todos</option>{levels.map(x=><option key={x}>{x}</option>)}</select></label><label>Duração<select value={duration} onChange={e=>setDuration(e.target.value)}><option value="all">Qualquer</option><option value="short">Até 10 min</option><option value="medium">11–20 min</option><option value="long">Mais de 20 min</option></select></label><label>Progresso<select value={status} onChange={e=>setStatus(e.target.value as typeof status)}><option value="all">Tudo</option><option value="open">Não concluído</option><option value="done">Concluído</option></select></label></div><small>{total} resultado(s) carregados para os filtros atuais.</small></section>
    {(query||category!=='all')&&<div className="search-sections">
      {lessonResults.length>0&&<section><h2>Aulas ({lessonResults.length})</h2><div className="result-list">{lessonResults.map(x=><Link key={x.id} to={`/lesson/${x.id}`} className="result-item glass-panel"><strong>{x.title}</strong><span>{x.course==='english'?'Inglês':x.course==='investments'?'Investimentos':'Programação'} • {x.level} • {x.estimatedMinutes} min {data.completed[x.id]?'• ✅':''}</span></Link>)}</div></section>}
      {countryResults.length>0&&<section><h2>Países ({countryResults.length})</h2><div className="result-list">{countryResults.map(x=><Link key={x.id} to={`/countries/${x.id}`} className="result-item glass-panel"><strong>{x.flag} {x.name}</strong><span>{x.capital} • {x.currency} • {x.region}</span></Link>)}</div></section>}
      {cityResults.length>0&&<section><h2>Cidades ({cityResults.length})</h2><div className="result-list">{cityResults.map(x=><Link key={`${x.country.id}-${x.city}`} to={`/cities?country=${x.country.id}&city=${encodeURIComponent(x.city)}`} className="result-item glass-panel"><strong>{x.country.flag} {x.city}</strong><span>{x.country.name} • {x.country.currency}</span></Link>)}</div></section>}
      {careerResults.length>0&&<section><h2>Carreiras ({careerResults.length})</h2><div className="result-list">{careerResults.map(x=><Link key={x.id} to={`/careers/${x.id}`} className="result-item glass-panel"><strong>{x.icon} {x.name}</strong><span>{x.summary}</span></Link>)}</div></section>}
      {(wageResults.length>0||occupationResults.length>0)&&<section><h2>Salários ({wageResults.length+occupationResults.length})</h2><div className="result-list">{occupationResults.map(x=>{const c=countryMap.get(x.countryId);const hourly=occupationHourly(x);const monthly=occupationMonthly(x);return <Link key={x.id} to={`/careers/${x.careerIds[0]}`} className="result-item glass-panel"><strong>{c?.flag} {x.occupation}</strong><span>{c?.name} • {formatMoney(hourly,x.currency)}/h • ≈ {formatMoney(monthly,x.currency)}/mês • {x.referencePeriod}</span></Link>})}{wageResults.map(x=>{const c=countryMap.get(x.countryId);return <Link key={`min-${x.countryId}`} to={`/countries/${x.countryId}`} className="result-item glass-panel"><strong>{c?.flag} Salário mínimo/piso — {c?.name}</strong><span>{formatMoney(hourlyEquivalent(x),x.currency)}/h • ≈ {formatMoney(monthlyEquivalent(x),x.currency)}/mês</span></Link>})}</div></section>}
      {noteResults.length>0&&<section><div className="section-heading"><h2>Minhas notas ({noteResults.length})</h2><Link className="text-link" to="/notes">Central de notas →</Link></div><div className="result-list">{noteResults.map(x=><Link key={x.id} to={x.lesson?`/lesson/${x.id}`:'/notes'} className="result-item glass-panel"><strong>📝 {x.lesson?.title??x.id}</strong><span>{x.note.slice(0,130)}{x.note.length>130?'…':''}</span></Link>)}</div></section>}
      {total===0&&<div className="empty glass-panel">Nada encontrado com esses filtros. Tente uma palavra menor ou remova algum filtro.</div>}
    </div>}
  </div>
}
