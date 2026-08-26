import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Play, RotateCcw } from 'lucide-react'
import { lessons } from '../data/lessons'
import { useAppState } from '../hooks/useAppState'

const presets=[{label:'25 / 5',focus:25,rest:5},{label:'50 / 10',focus:50,rest:10},{label:'15 / 3',focus:15,rest:3}]

function clock(seconds:number){const m=Math.floor(seconds/60).toString().padStart(2,'0');const s=(seconds%60).toString().padStart(2,'0');return `${m}:${s}`}

export function FocusPage(){
 const {data}=useAppState(); const [params]=useSearchParams(); const requested=params.get('lesson')
 const pool=useMemo(()=>lessons.filter(x=>!data.completed[x.id]),[data.completed])
 const lesson=lessons.find(x=>x.id===requested)??pool[0]??lessons[0]
 const [focusMinutes,setFocusMinutes]=useState(25); const [restMinutes,setRestMinutes]=useState(5); const [mode,setMode]=useState<'focus'|'rest'>('focus'); const [seconds,setSeconds]=useState(25*60); const [running,setRunning]=useState(false)
 const setPreset=(focus:number,rest:number)=>{setFocusMinutes(focus);setRestMinutes(rest);setMode('focus');setSeconds(focus*60);setRunning(false)}
 const reset=()=>{setRunning(false);setMode('focus');setSeconds(focusMinutes*60)}

 useEffect(()=>{document.body.dataset.focusMode='true';return()=>{delete document.body.dataset.focusMode}},[])
 useEffect(()=>{if(!running)return;const id=window.setInterval(()=>setSeconds(value=>{if(value>1)return value-1;setRunning(false);const next=mode==='focus'?'rest':'focus';setMode(next);return (next==='focus'?focusMinutes:restMinutes)*60}),1000);return()=>window.clearInterval(id)},[running,mode,focusMinutes,restMinutes])
 useEffect(()=>{document.title=`${clock(seconds)} • ${mode==='focus'?'Foco':'Pausa'} • Futuro Lab`;return()=>{document.title='Futuro Lab'}},[seconds,mode])

 return <div className="page focus-page"><div className="focus-top"><Link to="/today" className="back-link">← Sair do foco</Link><span className="eyebrow">🎯 Modo foco</span></div>
 <section className={`focus-timer glass-panel mode-${mode}`}><span>{mode==='focus'?'Hora de estudar':'Pausa curta'}</span><strong>{clock(seconds)}</strong><div className="focus-controls"><button className="primary-button" onClick={()=>setRunning(v=>!v)}><Play size={17}/>{running?'Pausar':'Iniciar'}</button><button className="secondary-button" onClick={reset}><RotateCcw size={17}/> Resetar</button></div><div className="chip-row">{presets.map(p=><button key={p.label} className={focusMinutes===p.focus&&restMinutes===p.rest?'chip selected':'chip'} onClick={()=>setPreset(p.focus,p.rest)}>{p.label}</button>)}</div><small>Formato: minutos de foco / minutos de pausa. O timer só roda enquanto esta página estiver aberta.</small></section>
 <section className="focus-lesson glass-panel"><span className="eyebrow">Conteúdo escolhido</span><h1>{lesson.title}</h1><p>{lesson.description}</p><div className="focus-content">{lesson.content.slice(0,5).map((text,i)=><p key={`${text}-${i}`}><strong>{i+1}.</strong> {text}</p>)}</div>{lesson.examples[0]&&<div className="example-box"><strong>Exemplo</strong><p>{lesson.examples[0]}</p></div>}<div className="tip-box"><strong>💡 Dica bônus</strong><p>{lesson.tip}</p></div><div className="quote-box"><strong>🔴 Frase da página</strong><p>{lesson.quote}</p></div><Link className="secondary-button" to={`/lesson/${lesson.id}`}>Abrir aula completa</Link></section>
 </div>
}
