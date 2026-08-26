import { ExternalLink, MapPinned } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { countries } from '../data/countries'
import { countryCurrent } from '../data/countryCurrent'
import { countryGuides } from '../data/countryGuides'

export function CountryGuidePage(){
  const {id}=useParams(); const guide=id?countryGuides[id]:undefined; const country=countries.find(c=>c.id===id); const current=id?countryCurrent[id]:undefined
  if(!guide||!country)return <div className="page"><div className="empty glass-panel"><h1>Guia especial ainda não disponível</h1><p>Os guias aprofundados começam por Irlanda e Canadá.</p><Link to="/countries">Voltar aos países</Link></div></div>
  return <div className="page country-guide-page"><nav className="breadcrumbs"><Link to="/countries">Países</Link><span>›</span><Link to={`/countries/${country.id}`}>{country.name}</Link><span>›</span><span>Guia completo</span></nav><section className="page-header glass-panel"><div className="mega-icon">{country.flag}</div><div><span className="eyebrow"><MapPinned size={15}/> Guia aprofundado</span><h1>{guide.title}</h1><p>{guide.subtitle}</p></div></section>
    {current&&<section className="glass-panel verified-data"><div className="section-heading"><div><span className="eyebrow">Dados verificados</span><h2>Resumo atual</h2></div><span className="pill">Atualizado {current.updatedAt.split('-').reverse().join('/')}</span></div>{current.minimumWage&&<div className="example-box"><strong>Salário mínimo/piso informado na fonte</strong><p>{current.minimumWage.value}</p><small>{current.minimumWage.note}</small></div>}<div className="split-grid"><div><h3>Estudo e trabalho</h3>{current.studyWork?.map(item=><p key={item}>• {item}</p>)}</div><div><h3>Imigração e permissões</h3>{current.immigrationHighlights?.map(item=><p key={item}>• {item}</p>)}</div></div></section>}
    <section className="guide-sections">{guide.sections.map(section=><article className="glass-panel content-panel" key={section.title}><h2>{section.title}</h2>{section.items.map(item=><p key={item}>• {item}</p>)}</article>)}</section>
    <div className="split-grid"><section className="glass-panel content-panel"><h2>📄 Checklist de documentos</h2>{guide.documents.map(item=><label className="check-item" key={item}><input type="checkbox"/> {item}</label>)}</section><section className="glass-panel content-panel"><h2>🏙️ Cidades para comparar</h2><div className="chip-row">{guide.cities.map(city=><span className="chip static" key={city}>{city}</span>)}</div><Link className="secondary-button" to="/cities">Abrir comparador de cidades</Link></section></div>
    <section className="glass-panel content-panel"><h2>🧭 Linha do tempo de pesquisa</h2><ol className="roadmap">{guide.timeline.map((item,index)=><li key={item}><span>{index+1}</span>{item}</li>)}</ol></section>
    {current&&<section className="glass-panel content-panel"><h2>Fontes oficiais atuais</h2><div className="source-list">{current.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}<ExternalLink size={14}/></a>)}</div><div className="warning-box">🟠 Regras migratórias podem mudar. Confirme novamente nessas fontes antes de pagar curso, passagem, visto ou tomar decisão importante.</div></section>}
  </div>
}
