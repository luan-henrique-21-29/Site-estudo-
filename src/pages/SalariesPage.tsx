import { useMemo, useState } from 'react'
import { ArrowUpDown, ExternalLink, RefreshCw, Search, WalletCards } from 'lucide-react'
import { Link } from 'react-router-dom'
import { countries } from '../data/countries'
import { wages, type WageSystem } from '../data/wages'
import { useFxRates } from '../hooks/useFxRates'
import { convertNativeToBRL, formatBRL, formatMoney, hourlyEquivalent, monthlyEquivalent } from '../lib/wageMath'

type Filter = 'all' | 'single' | 'variable'
type Sort = 'country' | 'monthly-brl' | 'hourly-brl'

const directSystems: WageSystem[] = ['national','federal','intersectoral']

function dateLabel(value?: string) {
  if (!value) return '—'
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value.split('-').reverse().join('/')
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'})
}

export function SalariesPage(){
  const [q,setQ]=useState('')
  const [filter,setFilter]=useState<Filter>('all')
  const [sort,setSort]=useState<Sort>('country')
  const fx=useFxRates()

  const rows=useMemo(()=>{
    const countryMap=new Map(countries.map(c=>[c.id,c]))
    const normalized=q.trim().toLowerCase()
    const list=wages.map(w=>({w,c:countryMap.get(w.countryId)})).filter(x=>x.c).filter(({w,c})=>{
      const matches=!normalized||`${c!.name} ${c!.currency} ${w.currency} ${w.headline}`.toLowerCase().includes(normalized)
      const kind=directSystems.includes(w.system)?'single':'variable'
      return matches&&(filter==='all'||filter===kind)
    })
    return list.sort((a,b)=>{
      if(sort==='country')return a.c!.name.localeCompare(b.c!.name,'pt-BR')
      const aValue=convertNativeToBRL(sort==='monthly-brl'?monthlyEquivalent(a.w):hourlyEquivalent(a.w),a.w.currency,fx.rates)??-1
      const bValue=convertNativeToBRL(sort==='monthly-brl'?monthlyEquivalent(b.w):hourlyEquivalent(b.w),b.w.currency,fx.rates)??-1
      return bValue-aValue
    })
  },[q,filter,sort,fx.rates])

  return <div className="page salaries-page">
    <section className="page-header glass-panel"><WalletCards className="mega-icon-svg"/><div><span className="eyebrow">Trabalho e mudança de país</span><h1>Salários mínimos pelo mundo</h1><p>Compare o piso por hora, equivalente mensal e conversão aproximada para reais. Cada linha mostra o tipo de regra e a fonte usada.</p></div></section>

    <section className="salary-explainer glass-panel"><strong>Como ler essa página</strong><p>“Salário mínimo” não significa salário médio. Alguns países não têm um piso nacional único e usam convenções coletivas, regiões ou tabelas por profissão. Nesses casos o site mostra isso claramente em vez de inventar um valor.</p></section>

    <section className="salary-toolbar glass-panel">
      <label className="inline-input"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar país ou moeda..."/></label>
      <div className="segmented salary-filter" role="group" aria-label="Filtrar sistema salarial"><button className={filter==='all'?'active':''} onClick={()=>setFilter('all')}>Todos</button><button className={filter==='single'?'active':''} onClick={()=>setFilter('single')}>Piso nacional/federal</button><button className={filter==='variable'?'active':''} onClick={()=>setFilter('variable')}>Regional/setorial</button></div>
      <label className="salary-sort"><ArrowUpDown size={16}/><select value={sort} onChange={e=>setSort(e.target.value as Sort)}><option value="country">Ordenar por país</option><option value="monthly-brl">Maior equivalente mensal em R$</option><option value="hourly-brl">Maior equivalente por hora em R$</option></select></label>
    </section>

    <div className="fx-status glass-panel"><div><strong>💱 Câmbio BRL</strong><span>{fx.loading?'Atualizando…':fx.error??`${fx.source??'cache'} • ${dateLabel(fx.updatedAt)}`}</span></div><button className="secondary-button compact-button" disabled={fx.loading} onClick={()=>void fx.refresh()}><RefreshCw size={15} className={fx.loading?'spin':''}/> Atualizar câmbio</button></div>

    <section className="salary-table-wrap glass-panel">
      <div className="salary-table" role="table" aria-label="Comparação de salários mínimos">
        <div className="salary-row salary-head" role="row"><span>País</span><span>Regra</span><span>Por hora</span><span>Por mês</span><span>Em reais</span><span>Fonte</span></div>
        {rows.map(({w,c})=>{
          const hourly=hourlyEquivalent(w); const monthly=monthlyEquivalent(w)
          const hBRL=convertNativeToBRL(hourly,w.currency,fx.rates); const mBRL=convertNativeToBRL(monthly,w.currency,fx.rates)
          return <article className="salary-row" role="row" key={w.countryId}>
            <div className="salary-country"><span className="salary-flag">{c!.flag}</span><div><Link to={`/countries/${c!.id}`}>{c!.name}</Link><small>{w.currency}</small></div></div>
            <div><strong className={`wage-system system-${w.system}`}>{w.system==='national'?'Nacional':w.system==='federal'?'Federal':w.system==='intersectoral'?'Intersetorial':w.system==='regional'?'Regional/variável':w.system==='sectoral'?'Setorial':'Sem universal'}</strong><small>{w.headline}</small></div>
            <div><strong>{formatMoney(hourly,w.currency,w.currency==='JPY'||w.currency==='KRW'||w.currency==='HUF'?0:2)}</strong><small>{hourly==null?'não aplicável':w.hourlyOfficial===true?'oficial':'estimado/referência'}</small></div>
            <div><strong>{formatMoney(monthly,w.currency,w.currency==='JPY'||w.currency==='KRW'||w.currency==='HUF'?0:2)}</strong><small>{monthly==null?'não há valor único':w.monthlyOfficial===true&&(w.paymentsPerYear??12)===12?'oficial':'equivalente comparável'}</small></div>
            <div><strong>{mBRL!=null?formatBRL(mBRL):'—'}</strong><small>{hBRL!=null?`${formatBRL(hBRL)}/h`:'conversão indisponível'}</small></div>
            <div className="salary-source"><a href={w.source.url} target="_blank" rel="noreferrer">Abrir fonte <ExternalLink size={13}/></a><small>Conferido {dateLabel(w.updatedAt)}</small></div>
          </article>
        })}
      </div>
      {rows.length===0&&<div className="empty">Nenhum país encontrado com esse filtro.</div>}
    </section>

    <section className="glass-panel salary-notes"><h2>⚠️ Antes de comparar países</h2><p>Os valores são brutos e impostos, descontos, custo de vida, jornada, férias e benefícios mudam muito entre países. Para Portugal, Espanha e Grécia, por exemplo, o site distribui os pagamentos extras ao longo de 12 meses apenas para criar uma comparação mensal mais justa. Para Japão, México, Costa Rica, Panamá e outros sistemas regionais/setoriais, leia a observação da fonte antes de usar o número.</p></section>
  </div>
}
