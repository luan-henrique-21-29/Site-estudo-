import { useMemo, useState } from 'react'
import { Brain, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { flashcards } from '../data/activities'

export function FlashcardsPage(){
 const [course,setCourse]=useState<'all'|'english'|'investments'|'programming'>('all')
 const filtered=useMemo(()=>course==='all'?flashcards:flashcards.filter(x=>x.course===course),[course])
 const [index,setIndex]=useState(0); const [flipped,setFlipped]=useState(false); const [difficulty,setDifficulty]=useState<Record<string,string>>({})
 const card=filtered[index%Math.max(1,filtered.length)]
 const move=(delta:number)=>{setIndex(v=>Math.max(0,(v+delta+filtered.length)%filtered.length));setFlipped(false)}
 return <div className="page"><section className="page-header glass-panel"><Brain className="mega-icon-svg"/><div><span className="eyebrow">Revisão rápida</span><h1>Flashcards</h1><p>{flashcards.length} cards para revisar conceitos sem transformar estudo em parede de texto.</p></div></section>
 <div className="segmented" role="group" aria-label="Filtrar flashcards">{([['all','Todos'],['english','Inglês'],['investments','Investimentos'],['programming','Programação']] as const).map(([id,label])=><button key={id} className={course===id?'active':''} onClick={()=>{setCourse(id);setIndex(0);setFlipped(false)}}>{label}</button>)}</div>
 {card&&<section className="flash-study"><button className={`flash-card glass-panel ${flipped?'flipped':''}`} onClick={()=>setFlipped(v=>!v)} aria-label="Virar flashcard"><span className="eyebrow">{flipped?'Resposta':'Pergunta'} • {index+1}/{filtered.length}</span><h2>{flipped?card.back:card.front}</h2>{flipped&&<p>{card.example}</p>}<small><RotateCcw size={15}/> Toque para virar</small></button>
 <div className="flash-controls"><button onClick={()=>move(-1)}><ChevronLeft/>Anterior</button><div className="difficulty-buttons"><button onClick={()=>setDifficulty(v=>({...v,[card.id]:'hard'}))}>😕 Difícil</button><button onClick={()=>setDifficulty(v=>({...v,[card.id]:'normal'}))}>🙂 Normal</button><button onClick={()=>setDifficulty(v=>({...v,[card.id]:'easy'}))}>😎 Fácil</button></div><button onClick={()=>move(1)}>Próximo<ChevronRight/></button></div>{difficulty[card.id]&&<p className="muted centered">Marcado como: {difficulty[card.id]==='hard'?'difícil':difficulty[card.id]==='easy'?'fácil':'normal'}.</p>}</section>}
 </div>
}
