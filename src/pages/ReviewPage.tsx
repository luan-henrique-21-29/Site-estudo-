import { BrainCircuit } from 'lucide-react'
import { lessons } from '../data/lessons'
import { LessonCard } from '../components/LessonCard'
import { useAppState } from '../hooks/useAppState'

export function ReviewPage(){
 const {data}=useAppState(); const now=Date.now(); const due=lessons.filter(l=>{const c=data.completed[l.id]; if(!c)return false; const days=(now-new Date(c.completedAt).getTime())/86400000; const interval=c.difficulty==='hard'?1:c.difficulty==='easy'?7:3; return days>=interval}).slice(0,30)
 return <div className="page"><section className="page-header glass-panel"><BrainCircuit className="mega-icon-svg"/><div><span className="eyebrow">Revisão espaçada</span><h1>Revisar</h1><p>Aulas voltam conforme a dificuldade marcada. Difícil: 1 dia, normal: 3 dias, fácil: 7 dias na primeira revisão.</p></div></section>{due.length?<div className="lesson-grid">{due.map(x=><LessonCard key={x.id} lesson={x}/>)}</div>:<div className="empty glass-panel">Nenhuma revisão vencida agora. Boa 😎</div>}</div>
}
