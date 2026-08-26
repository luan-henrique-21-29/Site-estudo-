import { Clock3, Heart, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Lesson } from '../types'
import { useAppState } from '../hooks/useAppState'

export function LessonCard({ lesson }: { lesson: Lesson }) {
  const { data, toggleFavorite } = useAppState()
  const favorite = data.favorites.includes(lesson.id)
  const complete = !!data.completed[lesson.id]
  return <article className="lesson-card glass-panel">
    <div className="card-top"><span className="pill">{lesson.module}</span><button className="icon-button" aria-label="Favoritar" onClick={()=>toggleFavorite(lesson.id)}><Heart size={18} fill={favorite?'currentColor':'none'}/></button></div>
    <Link to={`/lesson/${lesson.id}`} className="lesson-link"><h3>{lesson.title}</h3><p>{lesson.description}</p></Link>
    <div className="meta-row"><span><Clock3 size={15}/>{lesson.estimatedMinutes} min</span><span>{lesson.level}</span>{complete&&<span className="success"><CheckCircle2 size={15}/> estudado</span>}</div>
  </article>
}
