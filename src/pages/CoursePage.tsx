import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { lessons, courseMeta } from '../data/lessons'
import type { CourseId } from '../types'
import { LessonCard } from '../components/LessonCard'

export function CoursePage() {
  const { course } = useParams()
  const courseId = (course || 'english') as CourseId
  const meta = courseMeta[courseId]
  const [query,setQuery]=useState('')
  const [module,setModule]=useState('Todos')
  const courseLessons=lessons.filter(x=>x.course===courseId)
  const modules=['Todos',...Array.from(new Set(courseLessons.map(x=>x.module)))]
  const filtered=useMemo(()=>courseLessons.filter(x=>(module==='Todos'||x.module===module)&&(`${x.title} ${x.description}`.toLowerCase().includes(query.toLowerCase()))),[courseLessons,module,query])
  if (!meta) return <div className="page"><h1>Curso não encontrado</h1></div>
  return <div className="page"><section className="page-header glass-panel"><span className="mega-icon">{meta.icon}</span><div><span className="eyebrow">Trilha completa</span><h1>{meta.title}</h1><p>{meta.description}</p><strong>{courseLessons.length} aulas disponíveis</strong></div></section><div className="toolbar glass-panel"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar nesta trilha..."/><select value={module} onChange={e=>setModule(e.target.value)}>{modules.map(m=><option key={m}>{m}</option>)}</select></div><div className="lesson-grid">{filtered.map(x=><LessonCard lesson={x} key={x.id}/>)}</div></div>
}
