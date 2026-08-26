import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Pause, Play, RotateCcw, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { lessons } from '../data/lessons'
import { useAppState } from '../hooks/useAppState'

const presets=[{label:'25 / 5',focus:25,rest:5},{label:'50 / 10',focus:50,rest:10},{label:'15 / 3',focus:15,rest:3}]
function clock(seconds:number){const m=Math.floor(seconds/60).toString().padStart(2,'0');const s=(seconds%60).toString().padStart(2,'0');return `${m}:${s}`}

export function FocusPage(){
  const {data,addStudyMinutes,updateSettings}=useAppState(); const [params]=useSearchParams(); const requested=params.get('lesson'); const requestedMinutes=Number(params.get('minutes'))
  const pool=useMemo(()=>lessons.filter(x=>!data.completed[x.id]),[data.completed]); const lesson=lessons.find(x=>x.id===requested)??pool[0]??lessons[0]
  const initialFocus=Number.isFinite(requestedMinutes)&&requestedMinutes>0?Math.min(180,requestedMinutes):25
  const [focusMinutes,setFocusMinutes]=useState(initialFocus); const [restMinutes,setRestMinutes]=useState(5); const [customFocus,setCustomFocus]=useState(initialFocus); const [customRest,setCustomRest]=useState(5); const [mode,setMode]=useState<'focus'|'rest'>('focus'); const [seconds,setSeconds]=useState(initialFocus*60); const [running,setRunning]=useState(false); const [cycles,setCycles]=useState(0)
  const setPreset=(focus:number,rest:number)=>{setFocusMinutes(focus);setRestMinutes(rest);setCustomFocus(focus);setCustomRest(rest);setMode('focus');setSeconds(focus*60);setRunning(false)}
  const applyCustom=()=>setPreset(Math.max(1,Math.min(180,customFocus)),Math.max(1,Math.min(60,customRest)))
  const reset=()=>{setRunning(false);setMode('focus');setSeconds(focusMinutes*60)}
  const beep=()=>{if(!data.settings.sounds||!('AudioContext' in window))return;const ctx=new AudioContext();const osc=ctx.createOscillator();const gain=ctx.createGain();osc.frequency.value=mode==='focus'?720:520;gain.gain.setValueAtTime(.04,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.28);osc.connect(gain).connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.3)}
  const switchMode=()=>{const next=mode==='focus'?'rest':'focus';if(mode==='focus'){addStudyMinutes(focusMinutes,lesson.course,lesson.id);setCycles(v=>v+1)};beep();setMode(next);setSeconds((next==='focus'?focusMinutes:restMinutes)*60);setRunning(false)}

  useEffect(()=>{document.body.dataset.focusMode='true';return()=>{delete document.body.dataset.focusMode}},[])
  useEffect(()=>{if(!running)return;const id=window.setInterval(()=>setSeconds(value=>{if(value>1)return value-1;window.clearInterval(id);setTimeout(switchMode,0);return 0}),1000);return()=>window.clearInterval(id)},[running,mode,focusMinutes,restMinutes,data.settings.sounds,lesson.id])
  useEffect(()=>{document.title=`${clock(seconds)} • ${mode==='focus'?'Foco':'Pausa'} • Futuro Lab`;return()=>{document.title='Futuro Lab'}},[seconds,mode])
  const phaseTotal=(mode==='focus'?focusMinutes:restMinutes)*60; const elapsed=Math.max(0,phaseTotal-seconds); const progress=phaseTotal?Math.min(100,elapsed/phaseTotal*100):0

  return <div className="page focus-page"><div className="focus-top"><Link to="/today" className="back-link">← Sair do foco</Link><span className="eyebrow">🎯 Modo foco • {cycles} ciclo(s)</span></div>
    <section className={`focus-timer glass-panel mode-${mode}`}><span>{mode==='focus'?'Hora de estudar':'Pausa curta'}</span><strong>{clock(seconds)}</strong><div className="focus-progress"><span style={{width:`${progress}%`}}/></div><div className="focus-controls"><button className="primary-button" onClick={()=>setRunning(v=>!v)}>{running?<Pause size={17}/>:<Play size={17}/>} {running?'Pausar':'Iniciar'}</button><button className="secondary-button" onClick={reset}><RotateCcw size={17}/> Resetar</button><button className="secondary-button" onClick={switchMode}><SkipForward size={17}/> Próxima fase</button><button className="icon-button" onClick={()=>updateSettings({sounds:!data.settings.sounds})} aria-label={data.settings.sounds?'Desligar sons':'Ligar sons'}>{data.settings.sounds?<Volume2/>:<VolumeX/>}</button></div><div className="chip-row">{presets.map(p=><button key={p.label} className={focusMinutes===p.focus&&restMinutes===p.rest?'chip selected':'chip'} onClick={()=>setPreset(p.focus,p.rest)}>{p.label}</button>)}</div><div className="custom-pomodoro"><label>Foco<input type="number" min="1" max="180" value={customFocus} onChange={e=>setCustomFocus(Number(e.target.value))}/></label><label>Pausa<input type="number" min="1" max="60" value={customRest} onChange={e=>setCustomRest(Number(e.target.value))}/></label><button className="secondary-button" onClick={applyCustom}>Aplicar personalizado</button></div><small>Ao terminar uma fase de foco, os minutos entram nas estatísticas. O timer roda somente enquanto esta página estiver aberta.</small></section>
    <section className="focus-lesson glass-panel"><span className="eyebrow">Conteúdo escolhido • {lesson.estimatedMinutes} min estimados</span><h1>{lesson.title}</h1><p>{lesson.description}</p><div className="focus-content">{lesson.content.slice(0,5).map((text,i)=><p key={`${text}-${i}`}><strong>{i+1}.</strong> {text}</p>)}</div>{lesson.examples[0]&&<div className="example-box"><strong>Exemplo</strong><p>{lesson.examples[0]}</p></div>}<div className="tip-box"><strong>💡 Dica bônus</strong><p>{lesson.tip}</p></div><div className="quote-box"><strong>🔴 Frase da página</strong><p>{lesson.quote}</p></div><div className="button-row"><Link className="secondary-button" to={`/lesson/${lesson.id}`}>Abrir aula completa</Link>{pool.find(x=>x.id!==lesson.id)&&<Link className="text-link" to={`/focus?lesson=${pool.find(x=>x.id!==lesson.id)!.id}&minutes=${focusMinutes}`}>Próximo conteúdo →</Link>}</div></section>
  </div>
}
