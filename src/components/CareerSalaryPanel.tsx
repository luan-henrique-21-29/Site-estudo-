import { ExternalLink, RefreshCw, WalletCards } from 'lucide-react'
import { countries } from '../data/countries'
import { occupationWagesForCareer } from '../data/occupationWages'
import { useFxRates } from '../hooks/useFxRates'
import { convertNativeToBRL, formatBRL, formatMoney } from '../lib/wageMath'
import { occupationHourly, occupationMonthly, occupationStatisticLabel } from '../lib/occupationWageMath'

const countryById = new Map(countries.map(country => [country.id, country]))

function formatDate(value:string){return /^\d{4}-\d{2}-\d{2}$/.test(value)?value.split('-').reverse().join('/'):value}

export function CareerSalaryPanel({careerId}:{careerId:string}){
  const rows=occupationWagesForCareer(careerId)
  const fx=useFxRates()
  if(rows.length===0)return <section className="career-salary-empty glass-panel"><WalletCards/><div><h3>Salários por profissão</h3><p>Ainda não há uma faixa oficial verificada cadastrada para esta carreira. Isso é melhor do que preencher a tela com um número inventado.</p></div></section>

  return <section className="career-salary-section">
    <div className="career-salary-title"><div><span className="eyebrow"><WalletCards size={16}/> Dados de remuneração</span><h2>Quanto essa carreira paga em alguns países?</h2><p>Dados de órgãos públicos ou estatísticos. Eles mostram referências brutas — não promessa de salário, salário líquido ou valor inicial.</p></div><button className="secondary-button compact-button" onClick={()=>void fx.refresh()} disabled={fx.loading}><RefreshCw size={15} className={fx.loading?'spin':''}/> {fx.loading?'Atualizando…':'Atualizar câmbio'}</button></div>
    <div className="career-salary-grid">{rows.map(item=>{
      const country=countryById.get(item.countryId)
      const hourly=occupationHourly(item)
      const monthly=occupationMonthly(item)
      const hourlyBRL=convertNativeToBRL(hourly,item.currency,fx.rates)
      const monthlyBRL=convertNativeToBRL(monthly,item.currency,fx.rates)
      const hasRange=item.hourlyLow!=null||item.hourlyHigh!=null||item.monthlyLow!=null||item.monthlyHigh!=null
      return <article className="career-salary-card glass-panel" key={item.id}>
        <div className="career-salary-country"><span>{country?.flag??'🌍'}</span><div><strong>{country?.name??item.countryId}</strong><small>{item.occupation}</small></div></div>
        <span className={`salary-specificity specificity-${item.specificity}`}>{item.specificity==='occupation'?'Profissão específica':item.specificity==='occupation-group'?'Grupo de profissões':'Grupo amplo'}</span>
        <div className="career-salary-values"><div><span>Por hora</span><strong>{formatMoney(hourly,item.currency)}</strong>{hourlyBRL!=null&&<small>≈ {formatBRL(hourlyBRL)}/h</small>}</div><div><span>Por mês</span><strong>{formatMoney(monthly,item.currency)}</strong>{monthlyBRL!=null&&<small>≈ {formatBRL(monthlyBRL)}/mês</small>}</div></div>
        {hasRange&&<div className="career-salary-range"><span>Faixa publicada</span>{item.hourlyLow!=null&&item.hourlyHigh!=null?<strong>{formatMoney(item.hourlyLow,item.currency)}/h → {formatMoney(item.hourlyHigh,item.currency)}/h</strong>:item.monthlyLow!=null&&item.monthlyHigh!=null?<strong>{formatMoney(item.monthlyLow,item.currency)} → {formatMoney(item.monthlyHigh,item.currency)}/mês</strong>:null}</div>}
        {item.annualMean!=null&&<p className="career-salary-extra"><strong>Média anual da fonte:</strong> {formatMoney(item.annualMean,item.currency,0)}</p>}
        <p className="career-salary-note">{item.note}</p>
        <div className="career-salary-meta"><span>{occupationStatisticLabel(item)} • {item.referencePeriod}</span><span>Conferido {formatDate(item.updatedAt)}</span></div>
        <a className="career-salary-source" href={item.source.url} target="_blank" rel="noreferrer">{item.source.label}<ExternalLink size={13}/></a>
      </article>
    })}</div>
    <small className="career-salary-disclaimer">Conversões em R$ usam câmbio aproximado carregado no navegador. Compare também impostos, custo de vida, experiência, cidade e requisitos profissionais.</small>
  </section>
}
