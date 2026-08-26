import { Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppState } from '../hooks/useAppState'

const typeLabel={lesson:'Aula',country:'País',city:'Cidade',career:'Carreira',tool:'Ferramenta',note:'Nota'} as const

export function HistoryPage(){
  const {data}=useAppState()
  return <div className="page"><section className="page-header glass-panel"><Clock3 className="mega-icon-svg"/><div><span className="eyebrow">Histórico</span><h1>Visto recentemente</h1><p>Volte rápido ao que você abriu nos últimos estudos.</p></div></section>{data.recent.length===0?<div className="empty glass-panel">Seu histórico ainda está vazio. Conforme você abre aulas, países, cidades e carreiras, eles aparecem aqui.</div>:<div className="history-list">{data.recent.map(item=><Link to={item.path} className="history-item glass-panel" key={`${item.type}:${item.id}:${item.viewedAt}`}><div><span className="pill">{typeLabel[item.type]}</span><strong>{item.title}</strong></div><time dateTime={item.viewedAt}>{new Date(item.viewedAt).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'})}</time></Link>)}</div>}</div>
}
