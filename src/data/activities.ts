import { lessons } from './lessons'
import type { CourseId } from '../types'

export interface Flashcard { id:string; course:CourseId; front:string; back:string; example:string }
export interface Exercise { id:string; course:CourseId; lessonId:string; question:string; options:string[]; correctIndex:number; explanation:string }
export interface Quiz { id:string; title:string; exerciseIds:string[] }

const rotate=<T,>(arr:T[],n:number)=>arr.slice(n).concat(arr.slice(0,n))

export const flashcards:Flashcard[]=Array.from({length:200},(_,i)=>{
 const l=lessons[i%lessons.length]
 return {id:`flash-${i+1}`,course:l.course,front:l.title,back:l.content[0]??l.description,example:l.examples[0]??l.tip}
})

export const exercises:Exercise[]=Array.from({length:120},(_,i)=>{
 const lesson=lessons[i%lessons.length]
 const same=lessons.filter(x=>x.course===lesson.course && x.id!==lesson.id)
 const decoys=rotate(same,i%Math.max(1,same.length)).slice(0,3).map(x=>x.content[0]??x.description)
 const correct=lesson.content[0]??lesson.description
 const raw=[correct,...decoys]
 const shift=i%4
 const options=rotate(raw,shift)
 const correctIndex=(4-shift)%4
 return {id:`exercise-${i+1}`,course:lesson.course,lessonId:lesson.id,question:`Qual explicação combina melhor com “${lesson.title}”?`,options,correctIndex,explanation:`A ideia principal desta aula é: ${correct}`}
})

export const quizzes:Quiz[]=Array.from({length:20},(_,i)=>({id:`quiz-${i+1}`,title:`Quiz ${i+1} — revisão mista`,exerciseIds:exercises.slice(i*6,i*6+6).map(x=>x.id)}))
