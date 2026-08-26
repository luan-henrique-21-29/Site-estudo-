import type { OccupationWage } from '../data/occupationWages'

const WEEKS_PER_YEAR = 52
const MONTHS_PER_YEAR = 12

export function occupationHourly(item: OccupationWage): number | undefined {
  if (item.hourlyMedian != null) return item.hourlyMedian
  if (item.weeklyMedian != null && item.hoursPerWeek) return item.weeklyMedian / item.hoursPerWeek
  if (item.weeklyAverage != null && item.hoursPerWeek) return item.weeklyAverage / item.hoursPerWeek
  if (item.monthlyMedian != null && item.hoursPerWeek) return item.monthlyMedian * MONTHS_PER_YEAR / (item.hoursPerWeek * WEEKS_PER_YEAR)
  return undefined
}

export function occupationMonthly(item: OccupationWage): number | undefined {
  if (item.monthlyMedian != null) return item.monthlyMedian
  if (item.weeklyMedian != null) return item.weeklyMedian * WEEKS_PER_YEAR / MONTHS_PER_YEAR
  if (item.weeklyAverage != null) return item.weeklyAverage * WEEKS_PER_YEAR / MONTHS_PER_YEAR
  if (item.hourlyMedian != null && item.hoursPerWeek) return item.hourlyMedian * item.hoursPerWeek * WEEKS_PER_YEAR / MONTHS_PER_YEAR
  if (item.annualMean != null) return item.annualMean / MONTHS_PER_YEAR
  return undefined
}

export function occupationStatisticLabel(item: OccupationWage) {
  if (item.weeklyAverage != null && item.hourlyMedian == null && item.monthlyMedian == null) return 'média de grupo amplo'
  return 'mediana/referência ocupacional'
}
