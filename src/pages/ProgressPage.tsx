import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { lessons } from '../data/lessons'
import { useAppState } from '../hooks/useAppState'

export function ProgressPage(){
 const {data}=useAppState(); const chart=['english','investments','programming'].map(course=>{const all=lessons.filter(l=>l.course===course); const done=all.filter(l=>data.completed[l.id]).length; return {name:course==='english'?'Inglês':course==='investments'?'Investimentos':'Programação',concluídas:done,total:all.length}}); const total=Object.keys(data.completed).length
 return <div className="page"><section className="page-header glass-panel"><div className="mega-icon">📊</div><div><span className="eyebrow">Seu ritmo</span><h1>Meu progresso</h1><p>Sem culpa e sem corrida. A ideia é enxergar evolução.</p></div></section><div className="stats-grid"><div className="stat-card glass-panel"><strong>{total}</strong><span>aulas concluídas</span></div><div className="stat-card glass-panel"><strong>{data.studyMinutes}</strong><span>min estudados</span></div><div className="stat-card glass-panel"><strong>{data.favorites.length}</strong><span>favoritos</span></div></div><section className="glass-panel chart-panel"><h2>Aulas concluídas por trilha</h2><ResponsiveContainer width="100%" height={300}><BarChart data={chart}><CartesianGrid strokeDasharray="3 3" opacity={0.15}/><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="concluídas" fill="var(--primary)" radius={[8,8,0,0]}/></BarChart></ResponsiveContainer></section></div>
}
