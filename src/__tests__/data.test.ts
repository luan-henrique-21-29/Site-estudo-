import { describe, expect, it } from 'vitest'
import { lessons } from '../data/lessons'
import { countries } from '../data/countries'
import { careers } from '../data/careers'
import { exercises, flashcards, quizzes } from '../data/activities'

describe('conteúdo inicial', () => {
  it('tem pelo menos 80 aulas de inglês', () => expect(lessons.filter(x=>x.course==='english').length).toBeGreaterThanOrEqual(80))
  it('tem pelo menos 60 aulas de investimentos', () => expect(lessons.filter(x=>x.course==='investments').length).toBeGreaterThanOrEqual(60))
  it('tem pelo menos 90 aulas de programação', () => expect(lessons.filter(x=>x.course==='programming').length).toBeGreaterThanOrEqual(90))
  it('tem pelo menos 45 países', () => expect(countries.length).toBeGreaterThanOrEqual(45))
  it('tem pelo menos 20 carreiras', () => expect(careers.length).toBeGreaterThanOrEqual(20))
  it('tem pelo menos 120 exercícios', () => expect(exercises.length).toBeGreaterThanOrEqual(120))
  it('tem pelo menos 200 flashcards', () => expect(flashcards.length).toBeGreaterThanOrEqual(200))
  it('tem pelo menos 20 quizzes', () => expect(quizzes.length).toBeGreaterThanOrEqual(20))
  it('não usa verde nas cores estruturais dos conteúdos', () => expect(JSON.stringify(lessons).toLowerCase()).not.toContain('#00ff00'))
  it('cada aula tem dica e frase', () => expect(lessons.every(x=>x.tip&&x.quote)).toBe(true))
  it('cada país deixa claro o status de dados dinâmicos', () => expect(countries.every(x=>x.dynamicNote)).toBe(true))
  it('cada quiz possui seis exercícios existentes', () => expect(quizzes.every(q=>q.exerciseIds.length===6&&q.exerciseIds.every(id=>exercises.some(e=>e.id===id)))).toBe(true))
})
