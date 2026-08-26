import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, Heart, NotebookPen, Save, Volume2 } from 'lucide-react'
import { lessons } from '../data/lessons'
import { NotebookLesson } from '../components/NotebookLesson'
import { useAppState } from '../hooks/useAppState'
import type { Difficulty, Highlight } from '../types'

const courseLabel={english:'Inglês',investments:'Investimentos',programming:'Programação'} as const
const colors:Highlight['color'][]=['blue','purple','orange','red','pink']

export function LessonPage() {
  const { id } = useParams(); const nav=useNavigate(); const lesson=lessons.find(x=>x.id===id)
  const {data,toggleFavorite,markCompleted,saveNote,setNoteTags,addStudyMinutes,recordRecent,addHighlight,removeHighlight}=useAppState()
  const [notebook,setNotebook]=useState(false); const [note,setNote]=useState(''); const [difficulty,setDifficulty]=useState<Difficulty>('normal'); const [completion,setCompletion]=useState(false)

  useEffect(()=>{if(!lesson)return;setNote(data.notes[lesson.id]||'');recordRecent({id:lesson.id,type:'lesson',title:lesson.title,path:`/lesson/${lesson.id}`})},[lesson?.id])
  useEffect(()=>{if(!lesson)return;const timer=window.setTimeout(()=>saveNote(lesson.id,note),450);return()=>window.clearTimeout(timer)},[note,lesson?.id])
  if(!lesson) return <div className="page"><h1>Aula não encontrada</h1><Link to="/">Voltar ao início</Link></div>

  const favorite=data.favorites.includes(lesson.id); const done=!!data.completed[lesson.id]; const completionState=data.completed[lesson.id]
  const same=lessons.filter(x=>x.course===lesson.course); const index=same.findIndex(x=>x.id===lesson.id); const previous=same[index-1]; const next=same[index+1]
  const highlights=data.highlights.filter(h=>h.lessonId===lesson.id)
  const speak=()=>{if(!('speechSynthesis' in window))return;window.speechSynthesis.cancel();const englishText=[lesson.title,...lesson.examples].map(x=>x.split('—')[0].split('=')[0].trim()).join('. ');const u=new SpeechSynthesisUtterance(englishText);u.lang='en-US';u.rate=.86;window.speechSynthesis.speak(u)}
  const playSuccess=()=>{if(!data.settings.sounds||!('AudioContext' in window))return;const ctx=new AudioContext();const osc=ctx.createOscillator();const gain=ctx.createGain();osc.frequency.value=660;gain.gain.setValueAtTime(.04,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.18);osc.connect(gain).connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.2)}
  const finish=()=>{markCompleted(lesson.id,difficulty);addStudyMinutes(lesson.estimatedMinutes,lesson.course,lesson.id);setCompletion(true);playSuccess();window.setTimeout(()=>setCompletion(false),3200)}
  const captureHighlight=(color:Highlight['color'])=>{const text=window.getSelection()?.toString().trim();if(!text)return;addHighlight({id:`highlight-${Date.now()}`,lessonId:lesson.id,text,color,createdAt:new Date().toISOString()});window.getSelection()?.removeAllRanges()}
  if(notebook) return <div className="page"><button className="secondary-button" onClick={()=>setNotebook(false)}><ArrowLeft size={18}/> Voltar à aula</button><NotebookLesson lesson={lesson}/></div>

  return <div className="page lesson-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/">Início</Link><span>›</span><Link to={`/course/${lesson.course}`}>{courseLabel[lesson.course]}</Link><span>›</span><span>{lesson.title}</span></nav>
    <section className="lesson-hero glass-panel"><div><span className="eyebrow">{lesson.module} • {lesson.level} • {lesson.estimatedMinutes} min</span><h1>{lesson.title}</h1><p>{lesson.description}</p></div><div className="lesson-actions"><button className="icon-button big" onClick={()=>toggleFavorite(lesson.id)} aria-label="Favoritar"><Heart fill={favorite?'currentColor':'none'}/></button>{lesson.course==='english'&&<button className="secondary-button" onClick={speak}><Volume2 size={18}/> Ouvir inglês</button>}<button className="secondary-button" onClick={()=>setNotebook(true)}><NotebookPen size={18}/> Modo caderno</button></div></section>

    <section className="glass-panel content-panel lesson-readable"><div className="section-heading"><h2>Entenda</h2><div className="highlight-toolbar compact"><span>Selecione um trecho e marque:</span>{colors.map(color=><button key={color} className={`highlight-swatch ${color}`} onClick={()=>captureHighlight(color)} aria-label={`Destacar seleção em ${color}`}>{color}</button>)}</div></div>{lesson.content.map((x,i)=><p key={i}>{x}</p>)}{lesson.examples.length>0&&<><h3>Exemplos</h3>{lesson.examples.map((x,i)=><div className="example-box" key={i}>{x}</div>)}</>}{lesson.warnings.map((x,i)=><div key={i} className="warning-box">🟠 {x}</div>)}<div className="tip-box"><strong>💡 Dica bônus</strong><p>{lesson.tip}</p></div><div className="quote-box"><strong>🔴 Frase da página</strong><p>{lesson.quote}</p></div><div className="drawing-box"><strong>✏️ Desenho fácil</strong><p>{lesson.notebookDrawing}</p><svg viewBox="0 0 240 100" aria-label="Ilustração simples da aula"><path d="M18 72 Q55 18 95 65 T172 48 T224 72" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/><circle cx="52" cy="44" r="12"/><rect x="110" y="28" width="44" height="38" rx="8" fill="none" stroke="currentColor" strokeWidth="5"/></svg></div>{lesson.sources&&lesson.sources.length>0&&<div className="source-list"><h3>Fontes</h3>{lesson.sources.map(source=><a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label}</a>)}</div>}</section>

    {highlights.length>0&&<section className="glass-panel content-panel"><h2>🖍️ Trechos destacados</h2><div className="saved-highlights">{highlights.map(h=><button key={h.id} className={`saved-highlight mark-${h.color}`} title="Toque para remover" onClick={()=>removeHighlight(h.id)}>{h.text}</button>)}</div><small>Toque em um destaque para removê-lo.</small></section>}

    <section className="glass-panel notes-panel"><div className="section-heading"><div><span className="eyebrow">Autosave</span><h2>📝 Minha anotação</h2></div><span className="pill"><Save size={14}/> salva automaticamente</span></div><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Escreva algo que você quer lembrar..."/><label>Tags da nota<input value={(data.noteTags[lesson.id]??[]).join(', ')} onChange={e=>setNoteTags(lesson.id,e.target.value.split(','))} placeholder="ex.: revisar, prova, importante"/></label></section>

    <section className="lesson-footer glass-panel"><div>{done?<><span className="success"><CheckCircle2/> Aula concluída</span>{completionState?.nextReviewAt&&<small>Próxima revisão: {new Date(completionState.nextReviewAt).toLocaleDateString('pt-BR')}</small>}</>:<span>Como foi essa aula? Isso define quando ela volta na revisão.</span>}</div><div className="footer-actions"><div className="difficulty-buttons"><button className={difficulty==='hard'?'selected':''} onClick={()=>setDifficulty('hard')}>😕 Difícil</button><button className={difficulty==='normal'?'selected':''} onClick={()=>setDifficulty('normal')}>🙂 Normal</button><button className={difficulty==='easy'?'selected':''} onClick={()=>setDifficulty('easy')}>😎 Fácil</button></div><button className="primary-button" onClick={finish}>{done?'Registrar nova sessão':'Marcar como estudado'}</button></div></section>
    <nav className="lesson-pagination glass-panel">{previous?<button onClick={()=>nav(`/lesson/${previous.id}`)}><ArrowLeft/> <span><small>Anterior</small>{previous.title}</span></button>:<span/>}{next?<button onClick={()=>nav(`/lesson/${next.id}`)}><span><small>Próxima</small>{next.title}</span><ArrowRight/></button>:<Link className="primary-button" to={`/course/${lesson.course}`}>Trilha concluída</Link>}</nav>
    {completion&&<div className="completion-toast" role="status" aria-live="polite"><CheckCircle2/><div><strong>Aula concluída! +20 XP</strong><span>{next?'Próxima aula pronta quando você quiser.':'Você chegou ao fim desta trilha.'}</span></div></div>}
  </div>
}
