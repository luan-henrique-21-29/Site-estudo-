import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { careers } from '../data/careers'
import { occupationWagesForCareer } from '../data/occupationWages'

export function CareersPage(){
  const [query,setQuery]=useState('')
  const filtered=useMemo(()=>careers.filter(c=>`${c.name} ${c.summary} ${c.skills.join(' ')} ${c.roadmap.join(' ')}`.toLowerCase().includes(query.toLowerCase())),[query])
  return <div className="page careers-page"><section className="page-header glass-panel"><div className="mega-icon">💼</div><div><span className="eyebrow">Carreiras</span><h1>Explore caminhos profissionais</h1><p>{careers.length} carreiras com habilidades, rotina, roadmap, portfólio, pontos bons/ruins e salário público quando houver fonte confiável.</p></div></section><section className="toolbar glass-panel"><div className="inline-input"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ex.: front-end, dados, segurança, engenharia..."/></div><span>{filtered.length} resultado(s)</span></section><div className="career-directory-grid">{filtered.map(c=>{const refs=occupationWagesForCareer(c.id);return <Link to={`/careers/${c.id}`} className="career-directory-card glass-panel" key={c.id}><div className="career-directory-icon">{c.icon}</div><div><h3>{c.name}</h3><p>{c.summary}</p></div><div className="tags">{c.skills.slice(0,4).map(x=><span key={x}>{x}</span>)}</div><div className="career-card-footer"><span>{c.roadmap.length} etapas no roadmap</span><strong>{refs.length?`${refs.length} referência(s) salarial(is)`:'salário específico ainda sem fonte cadastrada'}</strong></div></Link>})}</div></div>
}
