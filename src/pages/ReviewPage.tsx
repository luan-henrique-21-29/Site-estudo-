import { BrainCircuit, CircleAlert, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { lessons } from '../data/lessons'
import { exercises, flashcards } from '../data/activities'
import { useAppState } from '../hooks/useAppState'
import type { Difficulty } from '../types'

export function ReviewPage(){
  const {data,reviewLesson}=useAppState(); const now=Date.now()
  const due=lessons.filter(l=>{const c=data.completed[l.id];if(!c)return false;if(c.nextReviewAt)return new Date(c.nextReviewAt).getTime()<=now;const days=(now-new Date(c.completedAt).getTime())/86400000;const interval=c.difficulty==='hard'?1:c.difficulty==='easy'?7:3;return days>=interval}).slice(0,40)
  const dueFlashcards=flashcards.filter(card=>{const r=data.flashcardReviews[card.id];return r&&new Date(r.nextReviewAt).getTime()<=now}).slice(0,30)
  const wrongIds=[...new Set(data.quizAttempts.slice(-20).flatMap(a=>a.wrongExerciseIds))]
  const wrongExercises=wrongIds.map(id=>exercises.find(e=>e.id===id)).filter((x):x is NonNullable<typeof x>=>Boolean(x)).slice(0,20)
  const mark=(id:string,difficulty:Difficulty)=>reviewLesson(id,difficulty)
  return <div className="page review-page"><section className="page-header glass-panel"><BrainCircuit className="mega-icon-svg"/><div><span className="eyebrow">Revisão espaçada</span><h1>Revisar</h1><p>O ciclo cresce por etapas de 1, 3, 7, 14, 30 e 60 dias. Marcar como difícil aproxima a próxima volta; fácil dá mais espaço.</p></div></section>
    <div className="stats-grid"><article className="stat-card glass-panel"><strong>{due.length}</strong><span>aulas vencidas</span></article><article className="stat-card glass-panel"><strong>{dueFlashcards.length}</strong><span>flashcards vencidos</span></article><article className="stat-card glass-panel"><strong>{wrongExercises.length}</strong><span>erros recentes</span></article></div>
    <section className="glass-panel content-panel"><div className="section-heading"><div><span className="eyebrow"><Layers3 size={15}/> Aulas</span><h2>Conteúdos para rever</h2></div></div>{due.length===0?<p className="muted">Nenhuma aula vencida agora. Quando chegar a data, ela reaparece aqui.</p>:<div className="review-lesson-list">{due.map(lesson=>{const state=data.completed[lesson.id];return <article key={lesson.id} className="review-row"><div><Link to={`/lesson/${lesson.id}`}><strong>{lesson.title}</strong></Link><small>{lesson.module} • etapa {(state.reviewStage??0)+1} • próxima revisão vencida {state.nextReviewAt?new Date(state.nextReviewAt).toLocaleDateString('pt-BR'):'agora'}</small></div><div className="difficulty-buttons"><button onClick={()=>mark(lesson.id,'hard')}>😕 Difícil</button><button onClick={()=>mark(lesson.id,'normal')}>🙂 Normal</button><button onClick={()=>mark(lesson.id,'easy')}>😎 Fácil</button></div></article>})}</div>}</section>
    <div className="split-grid"><section className="glass-panel content-panel"><h2>🧠 Flashcards vencidos</h2>{dueFlashcards.length===0?<p className="muted">Nenhum flashcard precisa voltar agora.</p>:<><p>{dueFlashcards.length} card(s) estão prontos para outra tentativa.</p><div className="tags">{dueFlashcards.slice(0,8).map(c=><span key={c.id}>{c.front}</span>)}</div><Link className="primary-button" to="/flashcards">Revisar flashcards</Link></>}</section><section className="glass-panel content-panel"><h2><CircleAlert/> Erros de quizzes</h2>{wrongExercises.length===0?<p className="muted">Quando você errar uma questão, ela aparece aqui para revisão — sem drama, erro é dado de estudo.</p>:<div className="review-errors">{wrongExercises.slice(0,6).map(e=><article key={e.id}><strong>{e.question}</strong><small>{e.explanation}</small><Link to={`/lesson/${e.lessonId}`}>Rever aula →</Link></article>)}</div>}</section></div>
  </div>
}
