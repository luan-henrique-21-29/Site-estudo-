export interface VerifiedCountryData {
  updatedAt: string
  minimumWage?: { value:string; note:string }
  studyWork?: string[]
  immigrationHighlights?: string[]
  sources: { label:string; url:string }[]
}

export const countryCurrent:Record<string,VerifiedCountryData>={
  irlanda:{
    updatedAt:'2026-08-26',
    minimumWage:{value:'€14,15 por hora (20+)',note:'Desde 1º de janeiro de 2026. Há taxas menores por idade para menores de 20 anos.'},
    studyWork:[
      'Stamp 2: até 20 horas por semana durante o período letivo e 40 horas por semana nos períodos de férias definidos pelas regras.',
      'Estudantes de inglês podem registrar no máximo três cursos elegíveis de 25 semanas; a permanência total nessa rota de inglês é limitada a cerca de dois anos.',
      'Stamp 2 não é contado como residência reckonable para naturalização.'
    ],
    immigrationHighlights:[
      'Critical Skills Employment Permit: determinadas ocupações estratégicas têm limiar geral de remuneração anual de €40.904; recém-formados elegíveis podem ter limiar de €36.848.',
      'Outras ocupações podem se qualificar para Critical Skills com remuneração anual acima de €68.911, respeitando as listas e demais critérios.',
      'General Employment Permit: limiar geral de remuneração anual de €36.605, com exceções e regras específicas por categoria.'
    ],
    sources:[
      {label:'Workplace Relations Commission — National Minimum Wage',url:'https://www.workplacerelations.ie/en/what_you_should_know/hours-and-wages/national%20minimum%20wage/national_minimum_wage.html'},
      {label:'Immigration Service Delivery — Immigration permission/stamps',url:'https://www.irishimmigration.ie/registering-your-immigration-permission/information-on-registering/immigration-permission-stamps/'},
      {label:'DETE — Critical Skills Employment Permit',url:'https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/critical-skills-employment-permit/'},
      {label:'DETE — General Employment Permit',url:'https://www.enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/general-employment-permit/'}
    ]
  },
  canada:{
    updatedAt:'2026-08-26',
    minimumWage:{value:'C$ 18,15 por hora — federal',note:'Desde 1º de abril de 2026 para setores federais. Se a taxa provincial/territorial aplicável for maior, prevalece a maior.'},
    studyWork:[
      'Estudantes internacionais elegíveis podem trabalhar fora do campus até 24 horas por semana durante períodos letivos.',
      'Durante intervalos acadêmicos programados, estudantes elegíveis podem trabalhar horas ilimitadas, respeitando as regras do programa e da permissão.',
      'Quem está apenas em programa de inglês ou francês como segunda língua (ESL/FSL) não se qualifica para trabalho off-campus por essa regra.'
    ],
    immigrationHighlights:[
      'A autorização para trabalhar durante os estudos depende das condições do study permit e da matrícula em instituição/programa elegível.',
      'Regras de estudo, PGWP e imigração mudam com frequência; conferir o IRCC antes de decidir curso ou instituição.'
    ],
    sources:[
      {label:'Government of Canada — Federal minimum wage',url:'https://www.canada.ca/en/services/jobs/workplace/federal-labour-standards/pay-deductions.html'},
      {label:'IRCC — Work off campus as an international student',url:'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/work-off-campus.html'},
      {label:'IRCC — Work as an international student or recent graduate',url:'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work.html'}
    ]
  }
}
