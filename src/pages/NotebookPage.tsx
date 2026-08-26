import { useEffect, useMemo, useRef, useState } from 'react'
import { Heart, ImagePlus, Link2, NotebookPen, Plus, Save, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { NotebookDocument } from '../types'
import { useAppState } from '../hooks/useAppState'

const categories:NotebookDocument['category'][]=['english','investments','programming','countries','free']
const categoryLabel:Record<NotebookDocument['category'],string>={english:'🇬🇧 Inglês',investments:'💰 Investimentos',programming:'💻 Programação',countries:'🌍 Países',free:'📝 Livre'}
const newDoc=():NotebookDocument=>({id:`notebook-${Date.now()}`,title:'Nova página',category:'free',content:'',tags:[],favorite:false,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),internalLinks:[]})

export function NotebookPage(){
  const {data,saveNotebook,deleteNotebook}=useAppState()
  const [category,setCategory]=useState<'all'|NotebookDocument['category']>('all')
  const [query,setQuery]=useState('')
  const [draft,setDraft]=useState<NotebookDocument>(()=>data.notebooks[0]??newDoc())
  const [isNew,setIsNew]=useState(data.notebooks.length===0)
  const editorRef=useRef<HTMLTextAreaElement>(null)
  const docs=useMemo(()=>data.notebooks.filter(d=>(category==='all'||d.category===category)&&`${d.title} ${d.content} ${d.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())),[data.notebooks,category,query])
  useEffect(()=>{if(!isNew){const fresh=data.notebooks.find(d=>d.id===draft.id);if(fresh)setDraft(fresh)}},[data.notebooks,draft.id,isNew])
  const select=(doc:NotebookDocument)=>{setDraft(doc);setIsNew(false)}
  const create=()=>{setDraft(newDoc());setIsNew(true)}
  const save=()=>{const next={...draft,title:draft.title.trim()||'Sem título',updatedAt:new Date().toISOString()};saveNotebook(next);setDraft(next);setIsNew(false)}
  const remove=()=>{if(isNew)return create();if(confirm('Excluir esta página do caderno?')){deleteNotebook(draft.id);const next=data.notebooks.find(x=>x.id!==draft.id);setDraft(next??newDoc());setIsNew(!next)}}
  const insertMarker=(color:'azul'|'roxo'|'laranja'|'vermelho'|'rosa')=>{const el=editorRef.current;if(!el)return;const start=el.selectionStart,end=el.selectionEnd,selected=draft.content.slice(start,end)||'texto';const next=`${draft.content.slice(0,start)}[${color}]${selected}[/${color}]${draft.content.slice(end)}`;setDraft(d=>({...d,content:next}));requestAnimationFrame(()=>el.focus())}
  return <div className="page digital-notebook-page">
    <section className="page-header glass-panel"><NotebookPen className="mega-icon-svg"/><div><span className="eyebrow">Caderno digital</span><h1>Meus cadernos</h1><p>Crie páginas livres por matéria, use tags, links internos, imagem por URL e marcações de cor.</p></div><button className="primary-button" onClick={create}><Plus size={18}/> Nova página</button></section>
    <section className="notebook-toolbar glass-panel"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar páginas..."/><div className="segmented">{(['all',...categories] as const).map(c=><button key={c} className={category===c?'active':''} onClick={()=>setCategory(c)}>{c==='all'?'Todos':categoryLabel[c]}</button>)}</div></section>
    <div className="digital-notebook-layout"><aside className="notebook-list glass-panel">{docs.length===0?<p className="muted">Nenhuma página nesse filtro.</p>:docs.map(doc=><button key={doc.id} className={draft.id===doc.id&&!isNew?'notebook-list-item active':'notebook-list-item'} onClick={()=>select(doc)}><span>{categoryLabel[doc.category]}</span><strong>{doc.title}</strong><small>{new Date(doc.updatedAt).toLocaleDateString('pt-BR')} {doc.favorite?'• ⭐':''}</small></button>)}</aside>
      <section className="notebook-editor glass-panel">
        <div className="notebook-editor-head"><div><span className="eyebrow">{isNew?'Nova página':'Editando'}</span><h2>{draft.title||'Sem título'}</h2></div><div className="button-row"><button className="icon-button" onClick={()=>setDraft(d=>({...d,favorite:!d.favorite}))} aria-label="Favoritar página"><Heart fill={draft.favorite?'currentColor':'none'}/></button><button className="secondary-button" onClick={remove}><Trash2 size={16}/> Excluir</button><button className="primary-button" onClick={save}><Save size={16}/> Salvar</button></div></div>
        <div className="notebook-form-grid"><label>Título<input value={draft.title} onChange={e=>setDraft(d=>({...d,title:e.target.value}))}/></label><label>Caderno<select value={draft.category} onChange={e=>setDraft(d=>({...d,category:e.target.value as NotebookDocument['category']}))}>{categories.map(c=><option key={c} value={c}>{categoryLabel[c]}</option>)}</select></label><label>Tags<input value={draft.tags.join(', ')} onChange={e=>setDraft(d=>({...d,tags:e.target.value.split(',').map(x=>x.trim()).filter(Boolean)}))} placeholder="revisar, importante"/></label><label><ImagePlus size={15}/> Imagem por URL<input value={draft.imageUrl??''} onChange={e=>setDraft(d=>({...d,imageUrl:e.target.value||undefined}))} placeholder="https://..."/></label></div>
        <div className="highlight-toolbar"><span>Marca-texto:</span>{(['azul','roxo','laranja','vermelho','rosa'] as const).map(c=><button key={c} className={`highlight-swatch ${c}`} onClick={()=>insertMarker(c)} aria-label={`Marcar seleção em ${c}`}>{c}</button>)}</div>
        <label>Conteúdo<textarea ref={editorRef} className="notebook-textarea" value={draft.content} onChange={e=>setDraft(d=>({...d,content:e.target.value}))} placeholder="Escreva títulos, listas, ideias, fórmulas, vocabulário..."/></label>
        <label><Link2 size={15}/> Links internos (um caminho por vírgula)<input value={draft.internalLinks.join(', ')} onChange={e=>setDraft(d=>({...d,internalLinks:e.target.value.split(',').map(x=>x.trim()).filter(Boolean)}))} placeholder="/lesson/..., /countries/irlanda"/></label>
        {(draft.imageUrl||draft.internalLinks.length>0)&&<div className="notebook-preview"><h3>Extras da página</h3>{draft.imageUrl&&<img src={draft.imageUrl} alt={`Imagem adicionada à página ${draft.title}`} loading="lazy"/>}<div className="chip-row">{draft.internalLinks.map(path=><Link className="chip" to={path} key={path}>{path}</Link>)}</div></div>}
        <small>As marcações `[azul]...[/azul]` etc. são salvas como texto portátil, então continuam legíveis até no backup JSON.</small>
      </section>
    </div>
  </div>
}
