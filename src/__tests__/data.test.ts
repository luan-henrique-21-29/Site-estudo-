import { describe, expect, it } from 'vitest'
import { lessons } from '../data/lessons'
import { countries } from '../data/countries'
import { careers } from '../data/careers'

describe('conteúdo inicial', () => {
  it('tem pelo menos 80 aulas de inglês', () => expect(lessons.filter(x=>x.course==='english').length).toBeGreaterThanOrEqual(80))
  it('tem pelo menos 60 aulas de investimentos', () => expect(lessons.filter(x=>x.course==='investments').length).toBeGreaterThanOrEqual(60))
  it('tem pelo menos 90 aulas de programação', () => expect(lessons.filter(x=>x.course==='programming').length).toBeGreaterThanOrEqual(90))
  it('tem pelo menos 45 países', () => expect(countries.length).toBeGreaterThanOrEqual(45))
  it('tem pelo menos 20 carreiras', () => expect(careers.length).toBeGreaterThanOrEqual(20))
  it('não usa verde nas cores estruturais dos conteúdos', () => expect(JSON.stringify(lessons).toLowerCase()).not.toContain('#00ff00'))
  it('cada aula tem dica e frase', () => expect(lessons.every(x=>x.tip&&x.quote)).toBe(true))
  it('cada país deixa claro o status de dados dinâmicos', () => expect(countries.every(x=>x.dynamicNote)).toBe(true))
})
