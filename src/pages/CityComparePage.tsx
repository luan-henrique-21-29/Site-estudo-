import { useMemo, useState } from 'react'
import { Building2, GitCompareArrows } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { countries } from '../data/countries'
import { useAppState } from '../hooks/useAppState'

const slug=(value:string)=>value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
const cityRows=countries.flatMap(country=>country.cities.map(city=>({id:`${country.id}:${slug(city)}`,city,country})))
const labels=[['roomRent','Quarto'],['apartmentRent','Apartamento'],['food','Mercado/comida'],['transport','Transporte'],['utilities','Energia/água'],['internet','Internet'],['phone','Telefone'],['leisure','Lazer']] as const

export function CityComparePage(){
 const {data}=useAppState(); const [params]=useSearchParams(); const initial=params.get('first'); const [selected,setSelected]=useState<string[]>(()=>initial&&cityRows.some(x=>x.id===initial)?[initial]:[])
 const toggle=(id:string)=>setSelected(current=>current.includes(id)?current.filter(x=>x!==id):current.length<4?[...current,id]:current)
 const chosen=cityRows.filter(x=>selected.includes(x.id)); const profiles=useMemo(()=>chosen.map(row=>({row,profile:data.cityCosts[row.id]})),[chosen,data.cityCosts])
 const total=(id:string,room=false)=>{const p=data.cityCosts[id];if(!p)return null;return (room?p.roomRent:p.apartmentRent)+p.food+p.transport+p.utilities+p.internet+p.phone+p.leisure}
 return <div className="page"><section className="page-header glass-panel"><GitCompareArrows className="mega-icon-svg"/><div><span className="eyebrow">Comparador de cidades</span><h1>Compare o que você pesquisou.</h1><p>Escolha até quatro cidades. Valores só aparecem quando você salvou uma ficha de custo com fonte e data.</p></div></section><section className="glass-panel content-panel"><h2>Escolher cidades</h2><div className="city-compare-picker">{cityRows.map(item=><button key={item.id} className={selected.includes(item.id)?'chip selected':'chip'} onClick={()=>toggle(item.id)}><span>{item.country.flag}</span> {item.city}</button>)}</div><small>{selected.length}/4 selecionadas</small></section>
 {chosen.length>1&&<section className="glass-panel content-panel"><div className="comparison-table city-comparison"><div className="compare-row head"><span>Critério</span>{chosen.map(item=><strong key={item.id}>{item.country.flag} {item.city}</strong>)}</div>{labels.map(([key,label])=><div className="compare-row" key={key}><span>{label}</span>{profiles.map(({row,profile})=><span key={row.id}>{profile&&profile[key]>0?`${profile[key].toLocaleString('pt-BR')} ${row.country.currency}`:'—'}</span>)}</div>)}<div className="compare-row"><strong>Total com quarto</strong>{chosen.map(item=><strong key={item.id}>{total(item.id,true)?.toLocaleString('pt-BR')??'—'}</strong>)}</div><div className="compare-row"><strong>Total com apartamento</strong>{chosen.map(item=><strong key={item.id}>{total(item.id,false)?.toLocaleString('pt-BR')??'—'}</strong>)}</div><div className="compare-row"><span>Fonte / data</span>{profiles.map(({row,profile})=><small key={row.id}>{profile?`${profile.sourceName||'fonte não nomeada'} • ${profile.retrievedAt}`:'sem pesquisa salva'}</small>)}</div></div></section>}
 <section className="glass-panel content-panel"><h2><Building2 size={20}/> Falta dado em alguma cidade?</h2><p>Abra a ficha, registre aluguel, mercado, transporte e a fonte. Depois volte aqui. O comparador não preenche número inventado.</p><Link className="secondary-button" to="/cities">Abrir cidades</Link></section></div>
}
