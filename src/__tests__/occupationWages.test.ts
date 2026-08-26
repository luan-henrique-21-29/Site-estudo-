import { describe, expect, it } from 'vitest'
import { careers } from '../data/careers'
import { countries } from '../data/countries'
import { occupationWages } from '../data/occupationWages'
import { occupationHourly, occupationMonthly, occupationStatisticLabel } from '../lib/occupationWageMath'

describe('salários por profissão', () => {
  it('referencia somente países existentes', () => {
    const ids = new Set(countries.map(x => x.id))
    expect(occupationWages.every(x => ids.has(x.countryId))).toBe(true)
  })

  it('referencia somente carreiras existentes', () => {
    const ids = new Set(careers.map(x => x.id))
    expect(occupationWages.every(x => x.careerIds.every(id => ids.has(id)))).toBe(true)
  })

  it('todo dado possui fonte HTTPS, período e observação', () => {
    expect(occupationWages.every(x => /^https:\/\//.test(x.source.url) && x.referencePeriod && x.updatedAt && x.note)).toBe(true)
  })

  it('converte salário canadense horário em equivalente mensal', () => {
    const row = occupationWages.find(x => x.id === 'ca-software-developer')!
    expect(occupationMonthly(row)).toBeCloseTo(48.08 * 40 * 52 / 12, 6)
  })

  it('converte mediana mensal alemã em equivalente horário', () => {
    const row = occupationWages.find(x => x.id === 'de-software-developer')!
    expect(occupationHourly(row)).toBeCloseTo(6301 * 12 / (40 * 52), 6)
  })

  it('não chama a média ampla da Irlanda de mediana ocupacional', () => {
    const row = occupationWages.find(x => x.id === 'ie-professionals-broad')!
    expect(occupationStatisticLabel(row)).toBe('média de grupo amplo')
    expect(row.weeklyMedian).toBeUndefined()
    expect(row.weeklyAverage).toBe(1668.71)
  })
})
