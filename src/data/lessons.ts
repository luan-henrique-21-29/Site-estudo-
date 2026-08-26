import type { Lesson } from '../types'
import { englishTopics as englishRaw } from './lessonTopics/english'
import { investmentTopics as investmentRaw } from './lessonTopics/investment'
import { programmingTopics as programmingRaw } from './lessonTopics/programming'
import { makeLesson, type Topic } from './lessonFactory'
const topics=(text:string):Topic[]=>text.trim().split('\n').map(row=>row.split('|') as Topic)
const english=topics(englishRaw), investments=topics(investmentRaw), programming=topics(programmingRaw)
export const lessons:Lesson[]=[...english.map((x,i)=>makeLesson('english',x,i)),...investments.map((x,i)=>makeLesson('investments',x,i)),...programming.map((x,i)=>makeLesson('programming',x,i))]
export const courseMeta={
 english:{title:'Inglês',icon:'🇬🇧',description:'Inglês útil para o dia a dia, trabalho e vida no exterior.'},
 investments:{title:'Investimentos',icon:'💰',description:'Educação financeira do zero, com foco em entendimento e segurança.'},
 programming:{title:'Programação',icon:'💻',description:'Da lógica aos projetos, com prática desde a base.'}
} as const
