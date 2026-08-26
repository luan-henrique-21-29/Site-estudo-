import { NotebookPen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { lessons } from '../data/lessons'
import { useAppState } from '../hooks/useAppState'

export function NotebookPage(){
 const {data}=useAppState(); const entries=Object.entries(data.notes).filter(([,v])=>v.trim())
 return <div className="page"><section className="page-header glass-panel"><NotebookPen className="mega-icon-svg"/><div><span className="eyebrow">Caderno digital</span><h1>Minhas anotações</h1><p>Notas salvas dentro das aulas aparecem aqui automaticamente.</p></div></section>{entries.length===0?<div className="empty glass-panel">Você ainda não fez anotações. Abra uma aula e escreva o que quer lembrar.</div>:<div className="notes-grid">{entries.map(([id,note])=>{const l=lessons.find(x=>x.id===id);return <article className="glass-panel note-card" key={id}><span className="pill">{l?.module||'Nota'}</span><h3>{l?.title||id}</h3><p>{note}</p>{l&&<Link className="text-link" to={`/lesson/${id}`}>Abrir aula →</Link>}</article>})}</div>}</div>
}
