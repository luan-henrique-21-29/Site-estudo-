import { useMemo, useState } from 'react'
import { Building2, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { countries } from '../data/countries'

const cities = countries.flatMap(country => country.cities.map(name => ({name,country})))
const regions = [...new Set(countries.map(c=>c.region))].sort((a,b)=>a.localeCompare(b,'pt-BR'))

export function CitiesPage(){
 const [q,setQ]=useState(''); const [region,setRegion]=useState('all')
 const rows=useMemo(()=>{const query=q.trim().toLowerCase();return cities.filter(({name,country})=>(region==='all'||country.region===region)&&(!query||`${name} ${country.name} ${country.region} ${country.languages.join(' ')}`.toLowerCase().includes(query)))},[q,region])
 return <div className="page"><section className="page-header glass-panel"><Building2 className="mega-icon-svg"/><div><span className="eyebrow">Países e cidades</span><h1>Explorar cidades</h1><p>{cities.length} cidades iniciais organizadas pelos países da plataforma. Use esta área para montar sua lista de pesquisa antes de comparar custo, salário e imigração.</p></div></section><section className="toolbar glass-panel"><div className="inline-input"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar cidade, país ou idioma..."/></div><select value={region} onChange={e=>setRegion(e.target.value)}><option value="all">Todas as regiões</option>{regions.map(x=><option key={x} value={x}>{x}</option>)}</select><span>{rows.length} resultados</span></section><div className="city-grid">{rows.map(({name,country})=><Link className="city-card glass-panel" key={`${country.id}-${name}`} to={`/countries/${country.id}`}><span className="city-flag">{country.flag}</span><div><strong>{name}</strong><p>{country.name}</p><small>{country.region} • {country.currency}</small></div><span className="text-link">Ver país →</span></Link>)}</div><section className="glass-panel content-panel"><h2>Como usar esta lista</h2><p>Escolha algumas cidades e depois compare salário, idioma, clima, regras de estudo/trabalho e custo de vida. Valores de aluguel e despesas mudam rápido; quando esses dados forem adicionados, deverão sempre mostrar fonte e data.</p></section></div>
}
