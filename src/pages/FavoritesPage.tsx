import { Heart } from 'lucide-react'
import { lessons } from '../data/lessons'
import { countries } from '../data/countries'
import { LessonCard } from '../components/LessonCard'
import { useAppState } from '../hooks/useAppState'
import { Link } from 'react-router-dom'

export function FavoritesPage(){
 const {data}=useAppState(); const ls=lessons.filter(x=>data.favorites.includes(x.id)); const cs=countries.filter(x=>data.favorites.includes(`country:${x.id}`))
 return <div className="page"><section className="page-header glass-panel"><Heart className="mega-icon-svg"/><div><span className="eyebrow">Salvos</span><h1>Favoritos</h1><p>Tudo que você quer encontrar rápido.</p></div></section>{ls.length===0&&cs.length===0?<div className="empty glass-panel">Você ainda não salvou nada ⭐</div>:<><div className="lesson-grid">{ls.map(x=><LessonCard key={x.id} lesson={x}/>)}</div><div className="country-grid">{cs.map(x=><Link className="country-card glass-panel" key={x.id} to={`/countries/${x.id}`}><span>{x.flag}</span><h3>{x.name}</h3></Link>)}</div></>}</div>
}
