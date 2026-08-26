import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { lessons } from '../data/lessons'
import { countries } from '../data/countries'
import { careers } from '../data/careers'

export function SearchPage(){
 const [q,setQ]=useState(''); const query=q.trim().toLowerCase()
 const lessonResults=useMemo(()=>query?lessons.filter(x=>`${x.title} ${x.description} ${x.module}`.toLowerCase().includes(query)).slice(0,24):[],[query])
 const countryResults=useMemo(()=>query?countries.filter(x=>`${x.name} ${x.capital} ${x.languages.join(' ')} ${x.cities.join(' ')}`.toLowerCase().includes(query)).slice(0,12):[],[query])
 const careerResults=useMemo(()=>query?careers.filter(x=>`${x.name} ${x.summary} ${x.skills.join(' ')}`.toLowerCase().includes(query)).slice(0,12):[],[query])
 return <div className="page"><section className="page-header glass-panel"><Search className="mega-icon-svg"/><div><span className="eyebrow">Busca universal</span><h1>Encontre qualquer assunto</h1><p>Pesquise aulas, países, cidades, habilidades e carreiras.</p></div></section><div className="search-box glass-panel"><Search/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Ex.: inflação, Irlanda, JavaScript array..."/></div>{query&&<div className="search-sections"><section><h2>Aulas ({lessonResults.length})</h2><div className="result-list">{lessonResults.map(x=><Link key={x.id} to={`/lesson/${x.id}`} className="result-item glass-panel"><strong>{x.title}</strong><span>{x.course} • {x.module}</span></Link>)}</div></section><section><h2>Países ({countryResults.length})</h2><div className="result-list">{countryResults.map(x=><Link key={x.id} to={`/countries/${x.id}`} className="result-item glass-panel"><strong>{x.flag} {x.name}</strong><span>{x.capital} • {x.currency}</span></Link>)}</div></section><section><h2>Carreiras ({careerResults.length})</h2><div className="result-list">{careerResults.map(x=><Link key={x.id} to="/careers" className="result-item glass-panel"><strong>{x.icon} {x.name}</strong><span>{x.summary}</span></Link>)}</div></section></div>}</div>
}
