import { ExternalLink, WalletCards } from 'lucide-react'
import { Link } from 'react-router-dom'
import { careers } from '../data/careers'
import { occupationWages } from '../data/occupationWages'
import { useFxRates } from '../hooks/useFxRates'
import { occupationHourly, occupationMonthly } from '../lib/occupationWageMath'
import { convertNativeToBRL, formatBRL, formatMoney } from '../lib/wageMath'

const careerById = new Map(careers.map(c => [c.id,c]))

export function CountryOccupationSalaries({countryId}:{countryId:string}){
  const rows=occupationWages.filter(item=>item.countryId===countryId)
  const fx=useFxRates()
  if(rows.length===0)return <section className="glass-panel country-occupation-empty"><WalletCards/><div><span className="eyebrow">Salários por profissão</span><h2>Dados profissionais ainda não cadastrados</h2><p>O piso salarial do país continua disponível acima. Para profissões específicas, a plataforma só mostra números quando existe uma fonte verificável e um período de referência claro.</p></div></section>

  return <section className="glass-panel country-occupation-section"><div className="section-heading"><div><span className="eyebrow"><WalletCards size={16}/> Mercado de trabalho</span><h2>Referências salariais por profissão</h2></div><span className="pill">{rows.length} {rows.length===1?'referência':'referências'}</span></div><p className="muted">Esses valores são separados do salário mínimo. São dados brutos de fontes públicas/estatísticas e podem representar profissão específica, grupo ocupacional ou grupo amplo.</p><div className="country-occupation-grid">{rows.map(item=>{const hourly=occupationHourly(item);const monthly=occupationMonthly(item);const hBrl=convertNativeToBRL(hourly,item.currency,fx.rates);const mBrl=convertNativeToBRL(monthly,item.currency,fx.rates);const career=careerById.get(item.careerIds[0]);return <article className="country-occupation-card" key={item.id}><div><strong>{career?.icon??'💼'} {item.occupation}</strong><small>{item.specificity==='occupation'?'profissão específica':item.specificity==='occupation-group'?'grupo de profissões':'grupo amplo'} • {item.referencePeriod}</small></div><div className="country-occupation-values"><span><b>{formatMoney(hourly,item.currency)}</b>/h{hBrl!=null&&<small>≈ {formatBRL(hBrl)}/h</small>}</span><span><b>{formatMoney(monthly,item.currency)}</b>/mês{mBrl!=null&&<small>≈ {formatBRL(mBrl)}/mês</small>}</span></div><p>{item.note}</p><div className="country-occupation-actions">{career&&<Link to={`/careers?id=${career.id}`}>Ver carreira →</Link>}<a href={item.source.url} target="_blank" rel="noreferrer">Fonte <ExternalLink size={13}/></a></div></article>})}</div><small className="wage-disclaimer">Conversão em reais é aproximada. Valores não representam salário líquido e podem variar por cidade, experiência, empresa, setor e jornada.</small></section>
}
