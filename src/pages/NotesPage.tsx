import { useMemo, useState } from 'react'
import { Heart, NotebookText, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { lessons } from '../data/lessons'
import { useAppState } from '../hooks/useAppState'

export function NotesPage(){
  const {data,saveNote,setNoteTags,toggleFavoriteNote}=useAppState()
  const [query,setQuery]=useState('')
  const [onlyFavorites,setOnlyFavorites]=useState(false)
  const notes=useMemo(()=>Object.entries(data.notes).filter(([,note])=>note.trim()).map(([id,note])=>({id,note,lesson:lessons.find(l=>l.id===id),tags:data.noteTags[id]??[]})).filter(item=>{
    const hay=`${item.note} ${item.lesson?.title??''} ${item.lesson?.module??''} ${item.tags.join(' ')}`.toLowerCase()
    return hay.includes(query.toLowerCase())&&(!onlyFavorites||data.favoriteNotes.includes(item.id))
  }),[data.notes,data.noteTags,data.favoriteNotes,query,onlyFavorites])
  return <div className="page notes-page">
    <section className="page-header glass-panel"><NotebookText className="mega-icon-svg"/><div><span className="eyebrow">Anotações</span><h1>Central de notas</h1><p>Pesquise, edite, marque tags e favorite o que merece voltar depois. Alterações são salvas automaticamente.</p></div></section>
    <section className="toolbar glass-panel notes-toolbar"><div className="inline-input"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar em notas e tags..."/></div><button className={onlyFavorites?'chip selected':'chip'} onClick={()=>setOnlyFavorites(v=>!v)}><Heart size={15}/> Só favoritas</button><span>{notes.length} nota(s)</span></section>
    {notes.length===0?<div className="empty glass-panel">Nenhuma nota combina com essa busca. As anotações feitas dentro das aulas aparecem aqui.</div>:<div className="notes-grid">{notes.map(item=><article className="glass-panel note-card note-editor-card" key={item.id}><div className="card-top"><span className="pill">{item.lesson?.module??'Nota'}</span><button className="icon-button" onClick={()=>toggleFavoriteNote(item.id)} aria-label="Favoritar nota"><Heart size={18} fill={data.favoriteNotes.includes(item.id)?'currentColor':'none'}/></button></div><h3>{item.lesson?.title??item.id}</h3><textarea value={item.note} onChange={e=>saveNote(item.id,e.target.value)} aria-label={`Editar nota ${item.lesson?.title??item.id}`}/><label>Tags<input value={item.tags.join(', ')} onChange={e=>setNoteTags(item.id,e.target.value.split(','))} placeholder="ex.: importante, revisar"/></label>{item.tags.length>0&&<div className="tags">{item.tags.map(tag=><span key={tag}>#{tag}</span>)}</div>}{item.lesson&&<Link className="text-link" to={`/lesson/${item.id}`}>Abrir aula →</Link>}</article>)}</div>}
  </div>
}
