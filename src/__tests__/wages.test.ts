import { describe, expect, it } from 'vitest'
import { countries } from '../data/countries'
import { wageByCountry, wages } from '../data/wages'
import { annualEquivalent, convertNativeToBRL, hourlyEquivalent, monthlyEquivalent } from '../lib/wageMath'

describe('salários e conversões', () => {
  it('possui registro salarial para todos os países', () => {
    expect(wages.length).toBe(countries.length)
    expect(countries.every(country => wageByCountry[country.id])).toBe(true)
  })

  it('não possui IDs de salário sem país correspondente', () => {
    const ids = new Set(countries.map(c => c.id))
    expect(wages.every(wage => ids.has(wage.countryId))).toBe(true)
  })

  it('todo registro informa fonte, data, escopo e observação', () => {
    expect(wages.every(w => w.updatedAt && w.scope && w.note && w.source.label && /^https:\/\//.test(w.source.url))).toBe(true)
  })

  it('anualiza corretamente países com 14 pagamentos', () => {
    const portugal = wageByCountry.portugal
    expect(monthlyEquivalent(portugal)).toBeCloseTo(920 * 14 / 12, 6)
    expect(annualEquivalent(portugal)).toBeCloseTo(920 * 14, 6)
  })

  it('calcula equivalente mensal a partir do salário por hora', () => {
    const canada = wageByCountry.canada
    expect(monthlyEquivalent(canada)).toBeCloseTo(18.15 * 40 * 52 / 12, 6)
  })

  it('calcula equivalente por hora a partir de salário mensal', () => {
    const poland = wageByCountry.polonia
    expect(hourlyEquivalent(poland)).toBeCloseTo((4806 * 12) / (40 * 52), 6)
  })

  it('mantém vazio quando não existe piso único conversível', () => {
    expect(monthlyEquivalent(wageByCountry.italia)).toBeUndefined()
    expect(hourlyEquivalent(wageByCountry.singapura)).toBeUndefined()
  })

  it('converte moeda estrangeira para BRL usando taxa foreign-per-BRL', () => {
    expect(convertNativeToBRL(100, 'USD', { BRL:1, USD:0.2 })).toBe(500)
  })

  it('não inventa conversão quando a taxa não está disponível', () => {
    expect(convertNativeToBRL(100, 'AED', { BRL:1 })).toBeUndefined()
  })

  it('preserva BRL sem depender de API cambial', () => {
    expect(convertNativeToBRL(1621, 'BRL', {})).toBe(1621)
  })
})
