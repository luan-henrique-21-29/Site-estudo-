import { useMemo, useState } from 'react'
import { Building2, Search } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { countries } from '../data/countries'
import { useAppState } from '../hooks/useAppState'

const cities=countries.flatMap(country=>country.cities.map(name=>({name,country})))
const regions=[...new Set(countries.map(c=>c.region))].sort((a,b)=>a.localeCompare(b,'pt-BR'))
const slug=(value:string)=>value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')

export function CitiesPage(){
  const {data}=useAppState(); const [params]=useSearchParams(); const initialCountry=params.get('country'); const initialCity=params.get('city'); const [q,setQ]=useState(initialCity??''); const [region,setRegion]=useState('all')
  const rows=useMemo(()=>{const query=q.trim().toLowerCase();return cities.filter(({name,country})=>(!initialCountry||country.id===initialCountry)&&(region==='all'||country.region===region)&&(!query||`${name} ${country.name} ${country.region} ${country.languages.join(' ')}`.toLowerCase().includes(query)))},[q,region,initialCountry])
  return <div className="page"><section className="page-header glass-panel"><Building2 className="mega-icon-svg"/><div><span className="eyebrow">Países e cidades</span><h1>Explorar cidades</h1><p>{cities.length} cidades iniciais. Cada cidade tem uma ficha própria para custo, fonte, data, salário-base e checklist de pesquisa.</p></div></section><section className="toolbar glass-panel"><div className="inline-input"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar cidade, país ou idioma..."/></div><select value={region} onChange={e=>setRegion(e.target.value)}><option value="all">Todas as regiões</option>{regions.map(x=><option key={x} value={x}>{x}</option>)}</select><span>{rows.length} resultados</span></section><div className="city-grid">{rows.map(({name,country})=>{const id=`${country.id}:${slug(name)}`;const researched=data.researchedCities.includes(id);return <Link className="city-card glass-panel" key={id} to={`/cities/${country.id}/${slug(name)}`}><span className="city-flag">{country.flag}</span><div><strong>{name}</strong><p>{country.name}</p><small>{country.region} • {country.currency} {researched?'• ✓ pesquisada':''}</small></div><span className="text-link">Abrir ficha →</span></Link>})}</div><section className="glass-panel content-panel"><h2>Como comparar cidades direito</h2><p>Não copie um “custo médio” sem contexto. Abra as cidades, registre aluguel, mercado, transporte e contas com a fonte e a data da sua pesquisa. Depois compare com o salário do país e, quando houver, com a referência da sua profissão.</p></section></div>
}
