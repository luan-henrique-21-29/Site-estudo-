import type { Lesson } from '../types'

export function NotebookLesson({ lesson }: { lesson: Lesson }) {
  return <article className="notebook-sheet">
    <header><span>📓 Modo caderno</span><strong>{new Date().toLocaleDateString('pt-BR')}</strong></header>
    <h2>{lesson.title}</h2>
    {lesson.content.map((x,i)=><p key={i} className="notebook-line">{x}</p>)}
    {lesson.examples.length>0 && <section><h4>🔴 Exemplos</h4>{lesson.examples.map((x,i)=><p key={i}>{x}</p>)}</section>}
    {lesson.warnings.length>0 && <section className="note-warning"><h4>🟠 Atenção</h4>{lesson.warnings.map((x,i)=><p key={i}>{x}</p>)}</section>}
    <section className="note-tip"><h4>💡 Dica bônus</h4><p>{lesson.tip}</p></section>
    <section className="note-quote"><h4>🔴 Frase da página</h4><p>{lesson.quote}</p></section>
    <section><h4>✏️ Desenho fácil</h4><p>{lesson.notebookDrawing}</p></section>
  </article>
}
