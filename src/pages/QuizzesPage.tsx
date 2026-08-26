import { useMemo, useState } from 'react'
import { CircleCheckBig, CircleX, ListChecks } from 'lucide-react'
import { Link } from 'react-router-dom'
import { exercises, quizzes } from '../data/activities'
import { useAppState } from '../hooks/useAppState'

const kindLabel={concept:'Conceito',example:'Exemplo',warning:'Atenção',tip:'Dica'} as const

export function QuizzesPage(){
  const {data,recordQuizAttempt}=useAppState()
  const [quizIndex,setQuizIndex]=useState(0); const [step,setStep]=useState(0); const [choice,setChoice]=useState<number|null>(null); const [score,setScore]=useState(0); const [wrongIds,setWrongIds]=useState<string[]>([]); const [finished,setFinished]=useState(false)
  const quiz=quizzes[quizIndex]
  const questions=useMemo(()=>quiz.exerciseIds.map(id=>exercises.find(x=>x.id===id)!).filter(Boolean),[quiz])
  const current=questions[step]
  const select=(i:number)=>{if(choice!==null)return;setChoice(i);if(i===current.correctIndex)setScore(v=>v+1);else setWrongIds(v=>[...v,current.id])}
  const next=()=>{if(step+1>=questions.length){setFinished(true);recordQuizAttempt({id:`attempt-${Date.now()}`,quizId:quiz.id,score,total:questions.length,wrongExerciseIds:wrongIds});return}setStep(v=>v+1);setChoice(null)}
  const reset=(newIndex=quizIndex)=>{setQuizIndex(newIndex);setStep(0);setChoice(null);setScore(0);setWrongIds([]);setFinished(false)}
  const history=data.quizAttempts.filter(a=>a.quizId===quiz.id).slice(-5).reverse()
  return <div className="page"><section className="page-header glass-panel"><ListChecks className="mega-icon-svg"/><div><span className="eyebrow">Prática com feedback</span><h1>Quizzes</h1><p>{quizzes.length} quizzes • {exercises.length} exercícios com conceito, exemplo, alerta e dica. Errou? O erro entra na fila de revisão.</p></div></section>
    <div className="quiz-picker glass-panel"><label>Escolha o quiz<select value={quizIndex} onChange={e=>reset(Number(e.target.value))}>{quizzes.map((q,i)=><option value={i} key={q.id}>{q.title}</option>)}</select></label>{history.length>0&&<div className="quiz-history"><span>Últimas tentativas:</span>{history.map(a=><b key={a.id}>{a.score}/{a.total}</b>)}</div>}</div>
    {!finished&&current&&<section className="quiz-card glass-panel"><div className="quiz-top"><span>{quiz.title} • {kindLabel[current.kind]}</span><strong>{step+1}/{questions.length}</strong></div><h2>{current.question}</h2><div className="quiz-options">{current.options.map((opt,i)=>{const answered=choice!==null;const correct=i===current.correctIndex;const selected=i===choice;return <button key={i} disabled={answered} className={answered?(correct?'correct':selected?'wrong':''):''} onClick={()=>select(i)}>{answered&&correct?<CircleCheckBig/>:answered&&selected?<CircleX/>:null}<span>{opt}</span></button>})}</div>{choice!==null&&<div className={`feedback ${choice===current.correctIndex?'ok':'bad'}`}><strong>{choice===current.correctIndex?'Acertou! ✅':'Quase. Olha a lógica:'}</strong><p>{current.explanation}</p>{choice!==current.correctIndex&&<Link to={`/lesson/${current.lessonId}`}>Rever a aula antes de avançar →</Link>}<button onClick={next}>{step+1===questions.length?'Ver resultado':'Próxima questão'}</button></div>}</section>}
    {finished&&<section className="empty glass-panel"><h2>Quiz concluído 🎉</h2><p>Você acertou <strong>{score} de {questions.length}</strong>.</p><p>{score===questions.length?'Mandou muito bem. Bora revisar outro?':score>=4?'Tá indo bem — seus erros já foram salvos na área Revisar.':'Vale voltar nas aulas e tentar de novo sem pressa. Os erros foram guardados para revisão.'}</p><div className="button-row"><button onClick={()=>reset()}>Refazer este quiz</button><Link className="secondary-button" to="/review">Revisar erros</Link></div></section>}
  </div>
}
