import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LessonCard } from '../components/LessonCard'
import { lessons } from '../data/lessons'
import { countries } from '../data/countries'
import { careers } from '../data/careers'
import { flashcards } from '../data/activities'
import { useAppState } from '../hooks/useAppState'

export function FavoritesPage(){
  const {data}=useAppState()
  const favoriteLessons=lessons.filter(x=>data.favorites.includes(x.id))
  const favoriteCountries=countries.filter(x=>data.favorites.includes(`country:${x.id}`))
  const favoriteCareers=careers.filter(x=>data.favorites.includes(`career:${x.id}`))
  const favoriteFlashcards=flashcards.filter(x=>data.favorites.includes(`flashcard:${x.id}`))
  const favoriteNotes=Object.entries(data.notes).filter(([id,note])=>note.trim()&&data.favoriteNotes.includes(id))
  const favoriteNotebooks=data.notebooks.filter(x=>x.favorite)
  const toolIds=data.favorites.filter(x=>x.startsWith('tool:'))
  const total=favoriteLessons.length+favoriteCountries.length+favoriteCareers.length+favoriteFlashcards.length+favoriteNotes.length+favoriteNotebooks.length+toolIds.length
  return <div className="page favorites-page"><section className="page-header glass-panel"><Heart className="mega-icon-svg"/><div><span className="eyebrow">Salvos</span><h1>Favoritos</h1><p>Aulas, países, carreiras, flashcards, notas, cadernos e ferramentas em um só lugar.</p></div></section>{total===0?<div className="empty glass-panel">Você ainda não salvou nada ⭐</div>:<>
    {favoriteLessons.length>0&&<section><h2>Aulas</h2><div className="lesson-grid">{favoriteLessons.map(x=><LessonCard key={x.id} lesson={x}/>)}</div></section>}
    {favoriteCountries.length>0&&<section><h2>Países</h2><div className="country-grid">{favoriteCountries.map(x=><Link className="country-card glass-panel" key={x.id} to={`/countries/${x.id}`}><span className="flag">{x.flag}</span><h3>{x.name}</h3><p>{x.capital} • {x.currency}</p></Link>)}</div></section>}
    {favoriteCareers.length>0&&<section><h2>Carreiras</h2><div className="favorite-simple-grid">{favoriteCareers.map(c=><Link className="glass-panel favorite-simple-card" to={`/careers/${c.id}`} key={c.id}><span>{c.icon}</span><div><strong>{c.name}</strong><small>{c.summary}</small></div></Link>)}</div></section>}
    {favoriteFlashcards.length>0&&<section><div className="section-heading"><h2>Flashcards</h2><Link className="text-link" to="/flashcards">Estudar favoritos →</Link></div><div className="favorite-simple-grid">{favoriteFlashcards.map(c=><article className="glass-panel favorite-simple-card" key={c.id}><span>🃏</span><div><strong>{c.front}</strong><small>{c.back}</small></div></article>)}</div></section>}
    {favoriteNotes.length>0&&<section><div className="section-heading"><h2>Notas favoritas</h2><Link className="text-link" to="/notes">Abrir central →</Link></div><div className="notes-grid">{favoriteNotes.map(([id,note])=>{const lesson=lessons.find(l=>l.id===id);return <article className="glass-panel note-card" key={id}><strong>{lesson?.title??id}</strong><p>{note}</p>{lesson&&<Link to={`/lesson/${id}`}>Abrir aula →</Link>}</article>})}</div></section>}
    {favoriteNotebooks.length>0&&<section><div className="section-heading"><h2>Páginas do caderno</h2><Link className="text-link" to="/notebook">Abrir caderno →</Link></div><div className="favorite-simple-grid">{favoriteNotebooks.map(doc=><article className="glass-panel favorite-simple-card" key={doc.id}><span>📓</span><div><strong>{doc.title}</strong><small>{doc.tags.join(' • ')||'Sem tags'}</small></div></article>)}</div></section>}
    {toolIds.length>0&&<section><h2>Ferramentas</h2><div className="favorite-simple-grid">{toolIds.map(id=><Link className="glass-panel favorite-simple-card" key={id} to={`/tools#${id.replace('tool:','')}`}><span>🛠️</span><div><strong>{id.replace('tool:','').replaceAll('-',' ')}</strong><small>Abrir ferramenta</small></div></Link>)}</div></section>}
  </>}</div>
}
