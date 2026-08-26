import { lessons } from './lessons'
import type { CourseId } from '../types'

export interface Flashcard { id:string; course:CourseId; lessonId:string; front:string; back:string; example:string; level:string }
export type ExerciseKind='concept'|'example'|'warning'|'tip'
export interface Exercise { id:string; course:CourseId; lessonId:string; kind:ExerciseKind; question:string; options:string[]; correctIndex:number; explanation:string }
export interface Quiz { id:string; title:string; exerciseIds:string[] }

const rotate=<T,>(arr:T[],n:number)=>arr.slice(n).concat(arr.slice(0,n))

export const flashcards:Flashcard[]=Array.from({length:200},(_,i)=>{
 const l=lessons[i%lessons.length]
 return {id:`flash-${i+1}`,course:l.course,lessonId:l.id,front:l.title,back:l.content[0]??l.description,example:l.examples[0]??l.tip,level:l.level}
})

export const exercises:Exercise[]=Array.from({length:120},(_,i)=>{
 const lesson=lessons[i%lessons.length]
 const same=lessons.filter(x=>x.course===lesson.course && x.id!==lesson.id)
 const kind=(['concept','example','warning','tip'] as ExerciseKind[])[i%4]
 const selectValue=(l:typeof lesson)=>kind==='example'?(l.examples[0]??l.content[0]??l.description):kind==='warning'?(l.warnings[0]??l.tip):kind==='tip'?l.tip:(l.content[0]??l.description)
 const correct=selectValue(lesson)
 const decoys=rotate(same,i%Math.max(1,same.length)).slice(0,3).map(selectValue)
 const raw=[correct,...decoys]
 const shift=i%4
 const options=rotate(raw,shift)
 const correctIndex=(4-shift)%4
 const prompt=kind==='example'?`Qual exemplo pertence melhor à aula “${lesson.title}”?`:kind==='warning'?`Qual atenção/erro comum combina com “${lesson.title}”?`:kind==='tip'?`Qual dica ajuda a lembrar “${lesson.title}”?`:`Qual explicação combina melhor com “${lesson.title}”?`
 return {id:`exercise-${i+1}`,course:lesson.course,lessonId:lesson.id,kind,question:prompt,options,correctIndex,explanation:`Resposta ligada à aula: ${correct}`}
})

export const quizzes:Quiz[]=Array.from({length:20},(_,i)=>({id:`quiz-${i+1}`,title:`Quiz ${i+1} — revisão mista`,exerciseIds:exercises.slice(i*6,i*6+6).map(x=>x.id)}))
