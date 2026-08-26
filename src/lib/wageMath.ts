import type { WageRecord } from '../data/wages'

const WEEKS_PER_YEAR = 52
const MONTHS_PER_YEAR = 12

export function monthlyEquivalent(wage: WageRecord): number | undefined {
  if (wage.monthly != null) {
    return wage.monthly * ((wage.paymentsPerYear ?? 12) / MONTHS_PER_YEAR)
  }
  if (wage.weekly != null) return wage.weekly * WEEKS_PER_YEAR / MONTHS_PER_YEAR
  if (wage.hourly != null && wage.standardHoursPerWeek != null) {
    return wage.hourly * wage.standardHoursPerWeek * WEEKS_PER_YEAR / MONTHS_PER_YEAR
  }
  if (wage.daily != null) return wage.daily * 5 * WEEKS_PER_YEAR / MONTHS_PER_YEAR
  return undefined
}

export function hourlyEquivalent(wage: WageRecord): number | undefined {
  if (wage.hourly != null) return wage.hourly
  const monthly = monthlyEquivalent(wage)
  if (monthly == null || wage.standardHoursPerWeek == null || wage.standardHoursPerWeek <= 0) return undefined
  return monthly / (wage.standardHoursPerWeek * WEEKS_PER_YEAR / MONTHS_PER_YEAR)
}

export function annualEquivalent(wage: WageRecord): number | undefined {
  const monthly = monthlyEquivalent(wage)
  return monthly == null ? undefined : monthly * MONTHS_PER_YEAR
}

export function convertNativeToBRL(amount: number | undefined, currency: string, rates: Record<string, number>): number | undefined {
  if (amount == null) return undefined
  if (currency === 'BRL') return amount
  const foreignPerReal = rates[currency]
  if (!foreignPerReal || foreignPerReal <= 0) return undefined
  return amount / foreignPerReal
}

export function formatMoney(amount: number | undefined, currency: string, maximumFractionDigits = 2): string {
  if (amount == null || !Number.isFinite(amount)) return '—'
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency,
      maximumFractionDigits
    }).format(amount)
  } catch {
    return `${amount.toLocaleString('pt-BR', { maximumFractionDigits })} ${currency}`
  }
}

export function formatBRL(amount: number | undefined): string {
  return formatMoney(amount, 'BRL', 2)
}

export function isDerivedHourly(wage: WageRecord) {
  return wage.hourly != null ? wage.hourlyOfficial === false : hourlyEquivalent(wage) != null
}

export function isDerivedMonthly(wage: WageRecord) {
  if (monthlyEquivalent(wage) == null) return false
  if (wage.monthly != null && (wage.paymentsPerYear ?? 12) === 12) return wage.monthlyOfficial === false
  return true
}
