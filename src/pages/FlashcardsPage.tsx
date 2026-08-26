import { useMemo, useState } from 'react'
import { Brain, RotateCcw, ChevronLeft, ChevronRight, Heart, Volume2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { flashcards } from '../data/activities'
import { useAppState } from '../hooks/useAppState'
import type { Difficulty } from '../types'

export function FlashcardsPage(){
  const {data,reviewFlashcard,toggleFavorite}=useAppState()
  const [course,setCourse]=useState<'all'|'english'|'investments'|'programming'>('all')
  const [mode,setMode]=useState<'all'|'due'|'favorites'>('all')
  const filtered=useMemo(()=>flashcards.filter(card=>{
    if(course!=='all'&&card.course!==course)return false
    if(mode==='favorites'&&!data.favorites.includes(`flashcard:${card.id}`))return false
    if(mode==='due'){const r=data.flashcardReviews[card.id];if(!r||new Date(r.nextReviewAt).getTime()>Date.now())return false}
    return true
  }),[course,mode,data.favorites,data.flashcardReviews])
  const [index,setIndex]=useState(0); const [flipped,setFlipped]=useState(false)
  const card=filtered[index%Math.max(1,filtered.length)]
  const move=(delta:number)=>{setIndex(v=>filtered.length?((v+delta+filtered.length)%filtered.length):0);setFlipped(false)}
  const rate=(difficulty:Difficulty)=>{if(!card)return;reviewFlashcard(card.id,difficulty);setTimeout(()=>move(1),180)}
  const speak=()=>{if(!card||card.course!=='english'||!('speechSynthesis' in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(card.front);u.lang='en-US';u.rate=.86;window.speechSynthesis.speak(u)}
  const review=card?data.flashcardReviews[card.id]:undefined
  return <div className="page"><section className="page-header glass-panel"><Brain className="mega-icon-svg"/><div><span className="eyebrow">Revisão rápida</span><h1>Flashcards</h1><p>{flashcards.length} cards com exemplo, nível, favorito, áudio em inglês e repetição espaçada.</p></div></section>
    <div className="flash-filter-row"><div className="segmented" role="group" aria-label="Filtrar matéria">{([['all','Todos'],['english','Inglês'],['investments','Investimentos'],['programming','Programação']] as const).map(([id,label])=><button key={id} className={course===id?'active':''} onClick={()=>{setCourse(id);setIndex(0);setFlipped(false)}}>{label}</button>)}</div><div className="segmented" role="group" aria-label="Filtrar revisão">{([['all','Todos'],['due','Para revisar'],['favorites','Favoritos']] as const).map(([id,label])=><button key={id} className={mode===id?'active':''} onClick={()=>{setMode(id);setIndex(0);setFlipped(false)}}>{label}</button>)}</div></div>
    {!card?<div className="empty glass-panel">Nenhum card nesse filtro agora. Se escolheu “Para revisar”, isso significa que você está em dia. 😎</div>:<section className="flash-study"><div className="flash-card-shell"><button className={`flash-card glass-panel ${flipped?'flipped':''}`} onClick={()=>setFlipped(v=>!v)} aria-label="Virar flashcard"><span className="eyebrow">{flipped?'Resposta':'Pergunta'} • {index+1}/{filtered.length} • {card.level}</span><h2>{flipped?card.back:card.front}</h2>{flipped&&<><p>{card.example}</p><Link className="text-link" to={`/lesson/${card.lessonId}`} onClick={e=>e.stopPropagation()}>Abrir aula relacionada →</Link></>}<small><RotateCcw size={15}/> Toque para virar</small></button><div className="flash-card-actions"><button className="icon-button" onClick={()=>toggleFavorite(`flashcard:${card.id}`)} aria-label="Favoritar flashcard"><Heart fill={data.favorites.includes(`flashcard:${card.id}`)?'currentColor':'none'}/></button>{card.course==='english'&&<button className="icon-button" onClick={speak} aria-label="Ouvir palavra ou frase"><Volume2/></button>}</div></div>
      <div className="flash-controls"><button onClick={()=>move(-1)}><ChevronLeft/>Anterior</button><div className="difficulty-buttons"><button onClick={()=>rate('hard')}>😕 Difícil</button><button onClick={()=>rate('normal')}>🙂 Normal</button><button onClick={()=>rate('easy')}>😎 Fácil</button></div><button onClick={()=>move(1)}>Próximo<ChevronRight/></button></div>{review&&<p className="muted centered">Última marcação: {review.difficulty==='hard'?'difícil':review.difficulty==='easy'?'fácil':'normal'} • revisão {review.repetitions} • volta em {new Date(review.nextReviewAt).toLocaleDateString('pt-BR')}.</p>}</section>}
  </div>
}
