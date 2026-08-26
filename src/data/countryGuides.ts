export interface CountryGuideSection { title:string; items:string[] }
export interface CountryGuide { countryId:string; title:string; subtitle:string; cities:string[]; sections:CountryGuideSection[]; documents:string[]; timeline:string[] }

export const countryGuides:Record<string,CountryGuide>={
  irlanda:{
    countryId:'irlanda',title:'Irlanda — guia de estudo, trabalho e residência',subtitle:'Uma trilha de pesquisa para entender inglês, faculdade, trabalho, permissões e possíveis caminhos de longo prazo sem transformar regra migratória em promessa.',cities:['Dublin','Cork','Galway','Limerick','Waterford'],
    sections:[
      {title:'🎓 Inglês e estudo',items:['Curso de inglês e ensino superior são rotas diferentes e podem gerar permissões diferentes.','Antes de pagar curso, confira se a instituição e o programa atendem aos requisitos oficiais da permissão pretendida.','Stamp 2 possui regras próprias sobre trabalho e não deve ser confundido com uma permissão de trabalho comum.']},
      {title:'💼 Trabalho',items:['Durante uma permissão estudantil elegível, a quantidade de horas permitidas depende da regra vigente e do período letivo/férias.','Para carreira de longo prazo, pesquise ocupações elegíveis e requisitos atuais de Employment Permits.','Critical Skills e General Employment Permit possuem critérios, listas, remuneração e requisitos diferentes.']},
      {title:'🛂 Permissões',items:['Stamp 2 é associado a determinados estudos elegíveis.','Stamp 1 normalmente está ligado a autorização para trabalhar ou operar atividade conforme a permissão aplicável.','Stamp 1G pode ser relevante para determinados graduados elegíveis após ensino superior irlandês.','Naturalização depende de residência reckonable e outros requisitos; nem todo tempo de estudante conta da mesma forma.']},
      {title:'🏠 Vida prática',items:['Compare Dublin com Cork, Galway, Limerick e Waterford em aluguel, transporte e vagas.','Faça orçamento com caução, primeiras semanas, alimentação, transporte e reserva de emergência.','Nunca escolha cidade apenas pelo salário bruto: aluguel e disponibilidade de moradia mudam muito a conta.']}
    ],
    documents:['Passaporte válido','Carta/aceite da instituição quando aplicável','Comprovantes financeiros exigidos pela rota','Seguro quando exigido','Comprovantes acadêmicos e traduções quando necessárias','Documentos para registro da permissão','Currículo em inglês para busca de trabalho'],
    timeline:['Definir objetivo e orçamento','Melhorar inglês','Escolher cidade e curso elegível','Confirmar regra oficial da permissão','Organizar documentos e reserva','Viajar e registrar permissão quando aplicável','Estudar e trabalhar dentro das condições','Pesquisar carreira e Employment Permit','Construir residência elegível de longo prazo','Verificar requisitos atuais para eventual naturalização']
  },
  canada:{
    countryId:'canada',title:'Canadá — guia de estudo, trabalho e imigração',subtitle:'O Canadá muda regras com frequência e possui forte diferença entre províncias. Use este guia como mapa de pesquisa, sempre confirmando no IRCC e nas fontes provinciais.',cities:['Toronto','Vancouver','Calgary','Montreal','Ottawa','Edmonton'],
    sections:[
      {title:'🎓 Estudo',items:['Study permit, instituição elegível e tipo de programa importam para as permissões durante e depois do curso.','Programa apenas de ESL/FSL não deve ser tratado como se tivesse automaticamente as mesmas condições de trabalho de outros programas elegíveis.','Antes de escolher faculdade, verifique DLI, duração, regras vigentes e possíveis efeitos sobre trabalho pós-estudo.']},
      {title:'💼 Trabalho',items:['Estudantes elegíveis podem ter direito a trabalho off-campus dentro do limite vigente durante aulas.','Intervalos acadêmicos programados podem ter regra diferente de carga horária.','Salário mínimo e mercado mudam por província; compare a cidade e a profissão, não apenas o país.']},
      {title:'🛂 Imigração',items:['Rotas federais e provinciais não são uma coisa só.','PGWP, Express Entry e programas provinciais possuem requisitos próprios e mudam ao longo do tempo.','Nunca trate curso como garantia automática de residência permanente.']},
      {title:'🏠 Vida prática',items:['Toronto e Vancouver costumam exigir atenção especial ao orçamento de moradia.','Calgary, Edmonton, Ottawa e outras cidades podem apresentar relações diferentes entre salário, aluguel e mercado de trabalho.','No Quebec, francês pode ser muito importante no cotidiano, estudo, trabalho e em determinadas rotas migratórias.']}
    ],
    documents:['Passaporte válido','Carta de aceitação quando aplicável','Comprovantes financeiros conforme regra vigente','Documentos acadêmicos','Biometria/exames quando exigidos','Seguro de saúde conforme situação/província','Currículo adaptado ao mercado local'],
    timeline:['Escolher província e cidade','Definir estudo/carreira','Confirmar instituição e programa','Checar study permit e condições atuais','Planejar custo de vida e reserva','Organizar documentos','Viajar e iniciar estudo','Trabalhar somente se elegível e dentro das condições','Reavaliar PGWP/emprego/rota provincial ou federal','Confirmar regras de residência permanente vigentes']
  }
}
