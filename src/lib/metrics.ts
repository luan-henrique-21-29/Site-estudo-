import { lessons } from '../data/lessons'
import type { AppData, CourseId } from '../types'

const DAY = 86_400_000
const dayKey = (value:string|Date) => new Date(value).toISOString().slice(0,10)

export function studyMetrics(data:AppData){
  const now=new Date(); const today=dayKey(now)
  const weekStart=new Date(now);weekStart.setDate(now.getDate()-6);weekStart.setHours(0,0,0,0)
  const monthStart=new Date(now.getFullYear(),now.getMonth(),1)
  const sessions=data.studySessions ?? []
  const todayMinutes=sessions.filter(s=>dayKey(s.startedAt)===today).reduce((a,s)=>a+s.minutes,0)
  const weeklyMinutes=sessions.filter(s=>new Date(s.startedAt)>=weekStart).reduce((a,s)=>a+s.minutes,0)
  const monthlyMinutes=sessions.filter(s=>new Date(s.startedAt)>=monthStart).reduce((a,s)=>a+s.minutes,0)
  const studyDays=new Set<string>(sessions.map(s=>dayKey(s.startedAt)))
  Object.values(data.completed).forEach(c=>studyDays.add(dayKey(c.completedAt)))
  const sorted=[...studyDays].sort().reverse()
  let streak=0
  let cursor=new Date(); cursor.setHours(0,0,0,0)
  if(!studyDays.has(dayKey(cursor))){cursor=new Date(cursor.getTime()-DAY)}
  while(studyDays.has(dayKey(cursor))){streak++;cursor=new Date(cursor.getTime()-DAY)}
  const quizQuestions=data.quizAttempts.reduce((a,x)=>a+x.total,0)
  const quizCorrect=data.quizAttempts.reduce((a,x)=>a+x.score,0)
  const flashReviews=Object.values(data.flashcardReviews).reduce((a,x)=>a+x.repetitions,0)
  const completedCount=Object.keys(data.completed).length
  const completedGoals=data.goals.filter(g=>g.target>0&&g.current>=g.target).length
  const xp=completedCount*20+quizCorrect*5+flashReviews*2+data.researchedCountries.length*5+completedGoals*50
  const level=Math.max(1,Math.floor(Math.sqrt(xp/120))+1)
  const nextLevelXp=Math.pow(level,2)*120
  const courseMinutes=(course:CourseId)=>sessions.filter(s=>s.course===course).reduce((a,s)=>a+s.minutes,0)
  return {todayMinutes,weeklyMinutes,monthlyMinutes,studyDays:[...studyDays],streak,quizQuestions,quizCorrect,flashReviews,completedCount,completedGoals,xp,level,nextLevelXp,courseMinutes,sortedDays:sorted}
}

export interface Achievement {id:string;icon:string;title:string;description:string;unlocked:boolean}
export function achievements(data:AppData):Achievement[]{
  const m=studyMetrics(data)
  const completedProgramming=lessons.filter(l=>l.course==='programming'&&data.completed[l.id])
  const projectDone=completedProgramming.some(l=>/projeto|project/i.test(`${l.title} ${l.module}`))
  return [
    {id:'first-lesson',icon:'🏆',title:'Primeira aula',description:'Concluir a primeira aula.',unlocked:m.completedCount>=1},
    {id:'week-streak',icon:'🔥',title:'7 dias',description:'Manter uma sequência de 7 dias.',unlocked:m.streak>=7},
    {id:'flash-100',icon:'🇬🇧',title:'100 revisões',description:'Revisar 100 flashcards ao longo do tempo.',unlocked:m.flashReviews>=100},
    {id:'exercise-50',icon:'🧠',title:'50 exercícios',description:'Responder pelo menos 50 questões de quizzes.',unlocked:m.quizQuestions>=50},
    {id:'first-project',icon:'💻',title:'Primeiro projeto',description:'Concluir uma aula de projeto de programação.',unlocked:projectDone},
    {id:'goal-complete',icon:'🎯',title:'Meta concluída',description:'Completar uma meta pessoal.',unlocked:m.completedGoals>=1},
    {id:'countries-10',icon:'🌍',title:'Explorador',description:'Pesquisar 10 países.',unlocked:data.researchedCountries.length>=10},
    {id:'lessons-100',icon:'📚',title:'100 aulas',description:'Concluir 100 aulas.',unlocked:m.completedCount>=100}
  ]
}

export function dailyMinutes(data:AppData,days=28){
  const result:{date:string;minutes:number}[]=[]
  const now=new Date();now.setHours(0,0,0,0)
  for(let i=days-1;i>=0;i--){const d=new Date(now.getTime()-i*DAY);const key=dayKey(d);const minutes=data.studySessions.filter(s=>dayKey(s.startedAt)===key).reduce((a,s)=>a+s.minutes,0);result.push({date:key.slice(5),minutes})}
  return result
}
