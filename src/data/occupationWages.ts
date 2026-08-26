export interface OccupationWage {
  id: string
  countryId: string
  careerIds: string[]
  occupation: string
  currency: string
  hourlyLow?: number
  hourlyMedian?: number
  hourlyHigh?: number
  weeklyMedian?: number
  weeklyAverage?: number
  monthlyLow?: number
  monthlyMedian?: number
  monthlyHigh?: number
  annualMean?: number
  hoursPerWeek?: number
  referencePeriod: string
  updatedAt: string
  specificity: 'occupation' | 'occupation-group' | 'broad-group'
  note: string
  source: { label: string; url: string }
}

export const occupationWages: OccupationWage[] = [
  {
    id:'ca-software-developer', countryId:'canada', careerIds:['front-end','back-end','full-stack','mobile','engenharia-de-software'], occupation:'Software developers and programmers', currency:'CAD',
    hourlyLow:30, hourlyMedian:48.08, hourlyHigh:76.92, hoursPerWeek:40, referencePeriod:'2023–2024', updatedAt:'2025-11-19', specificity:'occupation',
    note:'Faixa nacional do Job Bank. A página foi revisada em 2026; os salários publicados têm período de referência 2023–2024 e variam bastante por província e cidade.',
    source:{label:'Government of Canada — Job Bank, Software Developer wages',url:'https://www.jobbank.gc.ca/marketreport/wages-occupation/22548/ca'}
  },
  {
    id:'ca-software-engineer', countryId:'canada', careerIds:['engenharia-de-software','cloud','devops'], occupation:'Software engineers and designers', currency:'CAD',
    hourlyLow:35, hourlyMedian:56.49, hourlyHigh:91.35, hoursPerWeek:40, referencePeriod:'2023–2024', updatedAt:'2025-11-19', specificity:'occupation',
    note:'Faixa nacional do Job Bank para software engineers and designers. O valor real depende de província, experiência e função.',
    source:{label:'Government of Canada — Job Bank, Computer Software Engineer wages',url:'https://www.jobbank.gc.ca/marketreport/wages-occupation/5485/ca'}
  },
  {
    id:'ca-electrician', countryId:'canada', careerIds:['eletricista'], occupation:'Electricians (except industrial and power system)', currency:'CAD',
    hourlyLow:20, hourlyMedian:35, hourlyHigh:48, hoursPerWeek:40, referencePeriod:'2023–2024', updatedAt:'2025-11-19', specificity:'occupation',
    note:'Faixa nacional. Requisitos, certificações e salários variam por província e especialidade.',
    source:{label:'Government of Canada — Job Bank, Electrician wages',url:'https://www.jobbank.gc.ca/marketreport/wages-occupation/20684/ca'}
  },
  {
    id:'de-software-developer', countryId:'alemanha', careerIds:['front-end','back-end','full-stack','engenharia-de-software','ia-machine-learning'], occupation:'Softwareentwickler/in — nível especialista/expert', currency:'EUR',
    monthlyLow:5034, monthlyMedian:6301, monthlyHigh:7723, hoursPerWeek:40, referencePeriod:'Entgeltatlas 2025', updatedAt:'2026-08-26', specificity:'occupation-group',
    note:'Mediana de remuneração bruta mensal de empregados em tempo integral na Alemanha. O Entgeltatlas também permite comparar estados e cidades.',
    source:{label:'Bundesagentur für Arbeit — Entgeltatlas, Softwareentwickler/in',url:'https://web.arbeitsagentur.de/entgeltatlas/beruf/15260'}
  },
  {
    id:'de-frontend-backend-specialist', countryId:'alemanha', careerIds:['front-end','back-end','mobile','full-stack'], occupation:'Software development — atividades especializadas (inclui Frontend/Backend/Mobile)', currency:'EUR',
    monthlyLow:5243, monthlyMedian:6729, monthlyHigh:7953, hoursPerWeek:40, referencePeriod:'Entgeltatlas 2025', updatedAt:'2026-08-26', specificity:'occupation-group',
    note:'Grupo ocupacional do Entgeltatlas que inclui Frontend-Entwickler/in, Backend-Entwickler/in e Mobile Developer. Não representa salário inicial.',
    source:{label:'Bundesagentur für Arbeit — Entgeltatlas, software development specialists',url:'https://web.arbeitsagentur.de/entgeltatlas/beruf/27544'}
  },
  {
    id:'de-civil-engineer', countryId:'alemanha', careerIds:['engenharia-civil'], occupation:'Ingenieur/in - Bau', currency:'EUR',
    monthlyLow:4932, monthlyMedian:6038, monthlyHigh:7324, hoursPerWeek:40, referencePeriod:'Entgeltatlas 2025', updatedAt:'2026-08-26', specificity:'occupation-group',
    note:'Mediana bruta mensal em tempo integral; inclui grupo de planejamento e supervisão de construção de alta complexidade.',
    source:{label:'Bundesagentur für Arbeit — Entgeltatlas, Ingenieur/in - Bau',url:'https://web.arbeitsagentur.de/entgeltatlas/beruf/58576'}
  },
  {
    id:'au-software-programmers', countryId:'australia', careerIds:['front-end','back-end','full-stack','mobile','engenharia-de-software'], occupation:'Software and Applications Programmers', currency:'AUD',
    hourlyMedian:67, weeklyMedian:2537, hoursPerWeek:41, referencePeriod:'ABS Survey of Employee Earnings and Hours, May 2025', updatedAt:'2026-08-26', specificity:'occupation-group',
    note:'Medianas para empregados adultos, não gerenciais e em tempo integral. A própria fonte diz que os números são guia e não uma taxa salarial obrigatória.',
    source:{label:'Jobs and Skills Australia — Software and Applications Programmers',url:'https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/2613-software-and-applications-programmers'}
  },
  {
    id:'au-ict-analysts', countryId:'australia', careerIds:['data-analyst','product-management','engenharia-de-software'], occupation:'ICT Business and Systems Analysts', currency:'AUD',
    hourlyMedian:72, weeklyMedian:2697, hoursPerWeek:41, referencePeriod:'ABS Survey of Employee Earnings and Hours, May 2025', updatedAt:'2026-08-26', specificity:'occupation-group',
    note:'Medianas de trabalhadores em tempo integral. A classificação é mais ampla que um cargo individual.',
    source:{label:'Jobs and Skills Australia — ICT Business and Systems Analysts',url:'https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations-anzsco/2611-ict-business-and-systems-analysts'}
  },
  {
    id:'au-civil-engineers', countryId:'australia', careerIds:['engenharia-civil'], occupation:'Civil Engineering Professionals', currency:'AUD',
    hourlyMedian:59, weeklyMedian:2217, hoursPerWeek:44, referencePeriod:'ABS Survey of Employee Earnings and Hours, May 2025', updatedAt:'2026-08-26', specificity:'occupation-group',
    note:'Medianas de profissionais em tempo integral. Inclui engenheiros civis, geotécnicos, estruturais e de transportes.',
    source:{label:'Jobs and Skills Australia — Civil Engineering Professionals',url:'https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations-anzsco/2332-civil-engineering-professionals'}
  },
  {
    id:'us-software-developers', countryId:'estados-unidos', careerIds:['front-end','back-end','full-stack','engenharia-de-software'], occupation:'Software Developers', currency:'USD',
    hourlyMedian:65.38, annualMean:148100, hoursPerWeek:40, referencePeriod:'May 2025 OEWS', updatedAt:'2026-05-15', specificity:'occupation',
    note:'A tabela nacional do BLS informa mediana horária e média anual. Não é salário de entrada; estados e cidades variam bastante.',
    source:{label:'U.S. Bureau of Labor Statistics — OEWS May 2025, Table 1',url:'https://www.bls.gov/news.release/ocwage.t01.htm'}
  },
  {
    id:'us-data-scientists', countryId:'estados-unidos', careerIds:['data-scientist','ia-machine-learning'], occupation:'Data Scientists', currency:'USD',
    hourlyMedian:57.80, annualMean:126800, hoursPerWeek:40, referencePeriod:'May 2025 OEWS', updatedAt:'2026-05-15', specificity:'occupation',
    note:'Mediana horária nacional e média anual publicadas no OEWS. Experiência, indústria e região alteram muito o valor.',
    source:{label:'U.S. Bureau of Labor Statistics — OEWS May 2025, Table 1',url:'https://www.bls.gov/news.release/ocwage.t01.htm'}
  },
  {
    id:'us-civil-engineers', countryId:'estados-unidos', careerIds:['engenharia-civil'], occupation:'Civil Engineers', currency:'USD',
    hourlyMedian:48.48, annualMean:108670, hoursPerWeek:40, referencePeriod:'May 2025 OEWS', updatedAt:'2026-05-15', specificity:'occupation',
    note:'Mediana horária nacional e média anual do OEWS; não representa uma oferta específica nem salário líquido.',
    source:{label:'U.S. Bureau of Labor Statistics — OEWS May 2025, Table 1',url:'https://www.bls.gov/news.release/ocwage.t01.htm'}
  },
  {
    id:'us-electricians', countryId:'estados-unidos', careerIds:['eletricista'], occupation:'Electricians', currency:'USD',
    hourlyMedian:30.38, annualMean:71490, hoursPerWeek:40, referencePeriod:'May 2025 OEWS', updatedAt:'2026-05-15', specificity:'occupation',
    note:'Mediana horária nacional e média anual. Licenciamento, sindicato, estado e especialidade podem mudar bastante a remuneração.',
    source:{label:'U.S. Bureau of Labor Statistics — OEWS May 2025, Table 1',url:'https://www.bls.gov/news.release/ocwage.t01.htm'}
  },
  {
    id:'ie-professionals-broad', countryId:'irlanda', careerIds:['front-end','back-end','full-stack','engenharia-de-software','data-analyst','data-scientist','engenharia-civil'], occupation:'Managers, professionals and associated professionals — grupo amplo', currency:'EUR',
    weeklyAverage:1668.71, hoursPerWeek:39, referencePeriod:'Q1 2026 (final)', updatedAt:'2026-08-25', specificity:'broad-group',
    note:'A CSO publica aqui média semanal de um grupo ocupacional amplo, não salário específico de programador ou engenheiro. O site identifica isso para não apresentar o valor como se fosse de uma profissão exata.',
    source:{label:'Central Statistics Office Ireland — Earnings and Labour Costs Q1/Q2 2026, Table A1',url:'https://www.cso.ie/en/releasesandpublications/ep/p-elcq/earningsandlabourcostsq12026finalq22026preliminaryestimates/'}
  }
]

export const occupationWagesForCareer = (careerId: string) => occupationWages.filter(item => item.careerIds.includes(careerId))
