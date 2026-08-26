import { useMemo, useState } from 'react'
import { CircleCheckBig, CircleX, ListChecks } from 'lucide-react'
import { exercises, quizzes } from '../data/activities'

export function QuizzesPage(){
 const [quizIndex,setQuizIndex]=useState(0); const [step,setStep]=useState(0); const [choice,setChoice]=useState<number|null>(null); const [score,setScore]=useState(0); const [finished,setFinished]=useState(false)
 const quiz=quizzes[quizIndex]
 const questions=useMemo(()=>quiz.exerciseIds.map(id=>exercises.find(x=>x.id===id)!).filter(Boolean),[quiz])
 const current=questions[step]
 const select=(i:number)=>{if(choice!==null)return;setChoice(i);if(i===current.correctIndex)setScore(v=>v+1)}
 const next=()=>{if(step+1>=questions.length){setFinished(true);return}setStep(v=>v+1);setChoice(null)}
 const reset=(newIndex=quizIndex)=>{setQuizIndex(newIndex);setStep(0);setChoice(null);setScore(0);setFinished(false)}
 return <div className="page"><section className="page-header glass-panel"><ListChecks className="mega-icon-svg"/><div><span className="eyebrow">Prática com feedback</span><h1>Quizzes</h1><p>{quizzes.length} quizzes • {exercises.length} exercícios. Errou? A explicação aparece na hora.</p></div></section>
 <div className="quiz-picker glass-panel"><label>Escolha o quiz<select value={quizIndex} onChange={e=>reset(Number(e.target.value))}>{quizzes.map((q,i)=><option value={i} key={q.id}>{q.title}</option>)}</select></label></div>
 {!finished&&current&&<section className="quiz-card glass-panel"><div className="quiz-top"><span>{quiz.title}</span><strong>{step+1}/{questions.length}</strong></div><h2>{current.question}</h2><div className="quiz-options">{current.options.map((opt,i)=>{const answered=choice!==null;const correct=i===current.correctIndex;const selected=i===choice;return <button key={i} disabled={answered} className={answered?(correct?'correct':selected?'wrong':''):''} onClick={()=>select(i)}>{answered&&correct?<CircleCheckBig/>:answered&&selected?<CircleX/>:null}<span>{opt}</span></button>})}</div>{choice!==null&&<div className={`feedback ${choice===current.correctIndex?'ok':'bad'}`}><strong>{choice===current.correctIndex?'Acertou! ✅':'Quase. Olha a lógica:'}</strong><p>{current.explanation}</p><button onClick={next}>{step+1===questions.length?'Ver resultado':'Próxima questão'}</button></div>}</section>}
 {finished&&<section className="empty glass-panel"><h2>Quiz concluído 🎉</h2><p>Você acertou <strong>{score} de {questions.length}</strong>.</p><p>{score===questions.length?'Mandou muito bem. Bora revisar outro?':score>=4?'Tá indo bem — revisar os erros vai fixar.':'Vale voltar nas aulas e tentar de novo sem pressa.'}</p><button onClick={()=>reset()}>Refazer este quiz</button></section>}
 </div>
}
