import type { Lesson } from '../types'
export type Topic=[string,string,string]
const slug=(v:string)=>v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')

const confusing:Record<string,[string,string,string]>={
'Actually':['Na verdade.','Não significa “atualmente”.','Actually, I agree. = Na verdade, eu concordo.'],
'Eventually':['Finalmente / depois de algum tempo.','Não significa “eventualmente”.','Eventually, I found a job. = Depois de um tempo, encontrei um emprego.'],
'Pretend':['Fingir.','Não significa “pretender”.','Don’t pretend. = Não finja.'],
'Realize':['Perceber / dar-se conta.','Não significa normalmente “realizar”.','I realized my mistake. = Percebi meu erro.'],
'Parents':['Pais.','Não significa “parentes”.','My parents live in Brazil. = Meus pais moram no Brasil.'],
'Library':['Biblioteca.','Não significa “livraria”.','I study at the library. = Estudo na biblioteca.'],
'College':['Faculdade / ensino superior.','Não significa simplesmente “colégio”.','She goes to college. = Ela faz faculdade.'],
'Fabric':['Tecido.','Não significa “fábrica”.','This fabric is soft. = Este tecido é macio.'],
'Sensible':['Sensato / prudente.','Não significa “sensível”.','That is sensible. = Isso é sensato.'],
'Notice':['Notar / perceber; também aviso.','O significado depende do contexto.','Did you notice? = Você percebeu?']
}

const comparisons:Record<string,[string,string]>={
'History × Story':['History = história real/passado; Story = história contada, relato ou conto.','I study history. / Tell me a story.'],
'House × Home':['House = construção física; Home = lar.','My house is small. / I want to go home.'],
'Job × Work':['Job = emprego específico; Work = trabalho geral ou verbo trabalhar.','I got a job. / I work from home.'],
'Fun × Funny':['Fun = divertido/diversão; Funny = engraçado.','The trip was fun. / That joke was funny.'],
'Speak × Talk':['Speak costuma focar idioma/fala; Talk foca conversa.','I speak English. / Can we talk?'],
'Say × Tell':['Say = dizer algo; Tell = dizer/contar algo a alguém.','She said hello. / Tell me the truth.'],
'Hear × Listen':['Hear = perceber som; Listen = escutar com atenção.','I hear music. / Listen to me.'],
'See × Look × Watch':['See = ver; Look = olhar; Watch = assistir/observar.','I see a car. / Look at this. / Watch the movie.'],
'Learn × Teach':['Learn = aprender; Teach = ensinar.','I learn English. / She teaches English.'],
'Remember × Remind':['Remember = lembrar; Remind = fazer lembrar.','I remember you. / Remind me tomorrow.']
}

export function makeLesson(course:Lesson['course'],[module,level,title]:Topic,index:number):Lesson{
 let content=[`${title} é um tema importante dentro de ${module.toLowerCase()}.`,`Entenda primeiro o conceito, depois ligue a uma situação real.`,`Faça uma anotação curta com suas próprias palavras.`]
 let examples=[`Crie um exemplo simples sobre “${title}”.`], warnings:string[]=[]
 let tip='Aprenda em partes pequenas e teste o que entendeu antes de avançar.'
 let quote='Entender primeiro torna o próximo passo mais fácil.'
 let drawing=course==='english'?'Dois balões de conversa.':course==='investments'?'Três moedas e uma seta.':'Notebook com </> na tela.'
 if(course==='english'){
   tip='Aprenda a frase inteira e tente usá-la em uma situação real.'; quote='Little by little, I’m getting better. — Pouco a pouco, estou melhorando.'
   const c=confusing[title]; const pair=comparisons[title]
   if(c){content=[`🔵 ${title}`,`⚫ Significado: ${c[0]}`,'🟣 Observe a palavra dentro de frases.'];warnings=[`🟠 Cuidado: ${c[1]}`];examples=[`🔴 ${c[2]}`];quote='Don’t translate everything literally. — Não traduza tudo literalmente.';drawing=`Escreva “${title}” e risque a tradução falsa.`}
   else if(pair){content=[`🔵 ${title}`,`⚫ ${pair[0]}`,'🟣 Escolha a palavra pela situação.'];examples=[`🔴 ${pair[1]}`];warnings=['🟠 Monte uma frase com cada palavra.']}
   else if(module==='Trabalho'){content=[`Use inglês simples e direto em situações de ${title.toLowerCase()}.`,'Frases curtas e educadas funcionam melhor do que tentar soar formal demais.','Pratique a resposta em voz alta.'];examples=['What do I need to do? — O que eu preciso fazer?','Could you explain that again? — Você poderia explicar isso novamente?'];warnings=['Não tenha medo de pedir repetição quando não entender.'];quote='I’m here to learn and improve. — Estou aqui para aprender e melhorar.'}
 } else if(course==='investments'){
   content=[`${title} deve ser entendido antes de comparar produtos financeiros.`,'Pergunte como funciona, quais são os riscos, a liquidez, o prazo e os custos.','Não escolha só pelo maior número de rentabilidade mostrado.'];examples=[`Compare duas situações envolvendo ${title} e identifique risco, prazo e liquidez.`];warnings=['Conteúdo educativo. Não constitui recomendação de investimento.'];tip='Antes de investir, entenda risco, liquidez, prazo e custos.';quote='Entender vem antes de investir.'
   if(title==='Inflação'){content=['Inflação é o aumento geral de preços ao longo do tempo.','Quando os preços sobem, o mesmo dinheiro compra menos.','O IPCA é o principal índice oficial de inflação ao consumidor no Brasil.'];examples=['Se algo custa R$ 100 e depois R$ 110, seu poder de compra caiu.'];drawing='Carrinho de mercado com uma seta para cima.'}
   if(title==='Juros compostos'){content=['Nos juros compostos, os rendimentos passam a render também.','Tempo e aportes frequentes aumentam o efeito da composição.','Compare taxas na mesma periodicidade.'];examples=['R$ 1.000 rendendo 1% ao mês cresce de forma composta.'];drawing='Moedas aumentando em três etapas.'}
 } else {warnings=['Não copie código sem entender cada parte.'];tip='Digite o exemplo, mude uma parte e observe o que acontece.';quote='Código bom nasce de entendimento, não de decorar.';examples=[`Faça um mini exercício usando ${title} e explique o resultado.`]}
 return {id:`${course}-${String(index+1).padStart(3,'0')}`,slug:slug(title),title,description:course==='english'?`Aula prática de inglês sobre ${title}.`:course==='investments'?`Explicação educativa sobre ${title}.`:`Aula de programação sobre ${title}, do conceito à prática.`,course,module,level,estimatedMinutes:index%3?10:15,content,examples,warnings,tip,quote,notebookDrawing:drawing,tags:[module.toLowerCase(),level.toLowerCase(),slug(title)]}
}
