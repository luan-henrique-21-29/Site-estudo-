import { ExternalLink, RefreshCw, WalletCards } from 'lucide-react'
import { wageByCountry } from '../data/wages'
import { useFxRates } from '../hooks/useFxRates'
import { convertNativeToBRL, formatBRL, formatMoney, hourlyEquivalent, isDerivedHourly, isDerivedMonthly, monthlyEquivalent } from '../lib/wageMath'

function dateLabel(value?: string) {
  if (!value) return undefined
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value.split('-').reverse().join('/')
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString('pt-BR', { dateStyle:'short', timeStyle:'short' })
}

const systemLabel = {
  national: 'Piso nacional',
  federal: 'Piso federal',
  intersectoral: 'Referência intersetorial',
  regional: 'Piso regional/variável',
  sectoral: 'Pisos por setor',
  none: 'Sem piso universal'
} as const

export function WagePanel({ countryId }: { countryId: string }) {
  const wage = wageByCountry[countryId]
  const fx = useFxRates()
  if (!wage) return null

  const hourly = hourlyEquivalent(wage)
  const monthly = monthlyEquivalent(wage)
  const hourlyBRL = convertNativeToBRL(hourly, wage.currency, fx.rates)
  const monthlyBRL = convertNativeToBRL(monthly, wage.currency, fx.rates)
  const hasComparableNumbers = hourly != null || monthly != null

  return <section className="glass-panel wage-panel">
    <div className="section-heading wage-heading">
      <div><span className="eyebrow"><WalletCards size={16}/> Salário mínimo / piso de referência</span><h2>{wage.headline}</h2></div>
      <span className="pill">{systemLabel[wage.system]}</span>
    </div>

    {hasComparableNumbers ? <>
      <div className="wage-metrics">
        <article className="wage-metric"><span>Por hora</span><strong>{formatMoney(hourly, wage.currency, wage.currency==='JPY'||wage.currency==='KRW'||wage.currency==='HUF'?0:2)}</strong><small>{isDerivedHourly(wage) ? 'estimativa para comparação' : 'taxa informada pela fonte'}</small>{hourlyBRL!=null&&<b>≈ {formatBRL(hourlyBRL)}</b>}</article>
        <article className="wage-metric"><span>Por mês</span><strong>{formatMoney(monthly, wage.currency, wage.currency==='JPY'||wage.currency==='KRW'||wage.currency==='HUF'?0:2)}</strong><small>{isDerivedMonthly(wage) ? 'equivalente mensal estimado' : 'valor mensal informado pela fonte'}</small>{monthlyBRL!=null&&<b>≈ {formatBRL(monthlyBRL)}</b>}</article>
      </div>
      {(wage.paymentsPerYear??12)!==12&&wage.monthly!=null&&<p className="wage-callout">📅 O piso oficial é {formatMoney(wage.monthly,wage.currency)} por pagamento, com <strong>{wage.paymentsPerYear} pagamentos por ano</strong>. Para comparar com outros países, o valor mensal acima distribui o total anual por 12 meses.</p>}
      {wage.standardHoursPerWeek&&<p className="muted">Conversões estimadas usam {wage.standardHoursPerWeek.toLocaleString('pt-BR')} h/semana quando a fonte não fornece diretamente hora ou mês.</p>}
    </> : <div className="wage-no-number"><strong>Não existe um único número nacional correto para mostrar.</strong><p>{wage.note}</p></div>}

    <div className="wage-context"><p><strong>Escopo:</strong> {wage.scope}</p><p><strong>Importante:</strong> {wage.note}</p>{wage.effectiveFrom&&<p><strong>Vigente desde:</strong> {dateLabel(wage.effectiveFrom)}</p>}</div>

    <div className="wage-footer">
      <a href={wage.source.url} target="_blank" rel="noreferrer">Fonte do salário: {wage.source.label}<ExternalLink size={14}/></a>
      <span>Salário conferido em {dateLabel(wage.updatedAt)}</span>
    </div>

    {wage.currency!=='BRL'&&<div className="fx-strip">
      <div><strong>💱 Conversão para reais</strong><span>{fx.loading?'Atualizando câmbio…':fx.error??`Câmbio: ${fx.source??'cache local'} • ${dateLabel(fx.updatedAt)??'data não informada'}`}</span></div>
      <button className="secondary-button compact-button" onClick={()=>void fx.refresh()} disabled={fx.loading}><RefreshCw size={15} className={fx.loading?'spin':''}/> Atualizar</button>
    </div>}
    <small className="wage-disclaimer">Valores em reais são conversões cambiais aproximadas e mudam com o câmbio. Salário mínimo não é salário médio de uma profissão e os valores são brutos antes de impostos, salvo indicação da fonte.</small>
  </section>
}
