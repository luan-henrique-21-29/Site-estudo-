import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Heart, NotebookPen, Save } from 'lucide-react'
import { lessons } from '../data/lessons'
import { NotebookLesson } from '../components/NotebookLesson'
import { useAppState } from '../hooks/useAppState'

export function LessonPage() {
  const { id } = useParams(); const nav=useNavigate();
  const lesson=lessons.find(x=>x.id===id)
  const { data, toggleFavorite, markCompleted, saveNote, addStudyMinutes }=useAppState()
  const [notebook,setNotebook]=useState(false)
  const [note,setNote]=useState(lesson?data.notes[lesson.id]||'':'')
  if(!lesson) return <div className="page"><h1>Aula não encontrada</h1></div>
  const favorite=data.favorites.includes(lesson.id); const done=!!data.completed[lesson.id]
  const same=lessons.filter(x=>x.course===lesson.course); const index=same.findIndex(x=>x.id===lesson.id); const next=same[index+1]
  if(notebook) return <div className="page"><button className="secondary-button" onClick={()=>setNotebook(false)}><ArrowLeft size={18}/> Voltar à aula</button><NotebookLesson lesson={lesson}/></div>
  return <div className="page lesson-page"><button className="back-link" onClick={()=>nav(-1)}><ArrowLeft size={18}/> voltar</button><section className="lesson-hero glass-panel"><div><span className="eyebrow">{lesson.module} • {lesson.level} • {lesson.estimatedMinutes} min</span><h1>{lesson.title}</h1><p>{lesson.description}</p></div><div className="lesson-actions"><button className="icon-button big" onClick={()=>toggleFavorite(lesson.id)} aria-label="Favoritar"><Heart fill={favorite?'currentColor':'none'}/></button><button className="secondary-button" onClick={()=>setNotebook(true)}><NotebookPen size={18}/> Modo caderno</button></div></section><section className="glass-panel content-panel"><h2>Entenda</h2>{lesson.content.map((x,i)=><p key={i}>{x}</p>)}{lesson.examples.length>0&&<><h3>Exemplos</h3>{lesson.examples.map((x,i)=><div className="example-box" key={i}>{x}</div>)}</>}{lesson.warnings.map((x,i)=><div key={i} className="warning-box">🟠 {x}</div>)}<div className="tip-box"><strong>💡 Dica bônus</strong><p>{lesson.tip}</p></div><div className="quote-box"><strong>🔴 Frase da página</strong><p>{lesson.quote}</p></div><div className="drawing-box"><strong>✏️ Desenho fácil</strong><p>{lesson.notebookDrawing}</p><svg viewBox="0 0 240 100" aria-label="Ilustração abstrata da aula"><path d="M18 72 Q55 18 95 65 T172 48 T224 72" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/><circle cx="52" cy="44" r="12"/><rect x="110" y="28" width="44" height="38" rx="8" fill="none" stroke="currentColor" strokeWidth="5"/></svg></div></section><section className="glass-panel notes-panel"><h2>📝 Minha anotação</h2><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Escreva algo que você quer lembrar..."/><button className="secondary-button" onClick={()=>saveNote(lesson.id,note)}><Save size={18}/> Salvar anotação</button></section><section className="lesson-footer glass-panel"><div>{done?<span className="success"><CheckCircle2/> Aula concluída</span>:<span>Quando terminar, marque como estudada.</span>}</div><div className="footer-actions"><button className="primary-button" onClick={()=>{markCompleted(lesson.id);addStudyMinutes(lesson.estimatedMinutes)}}>{done?'Concluir novamente':'Marcar como estudado'}</button>{next&&<button className="secondary-button" onClick={()=>nav(`/lesson/${next.id}`)}>Próxima: {next.title}</button>}</div></section></div>
}
