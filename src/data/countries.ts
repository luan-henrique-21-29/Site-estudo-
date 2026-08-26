import type { Country } from '../types'
import { rows as r1 } from './countryRows/part1'
import { rows as r2 } from './countryRows/part2'
import { rows as r3 } from './countryRows/part3'
import { rows as r4 } from './countryRows/part4'
const rows=[...r1,...r2,...r3,...r4]
const dynamicNote='Salários, custos, impostos e regras migratórias mudam. O site não inventa valores: dados dinâmicos devem exibir fonte e data quando forem adicionados.'
const source='Dados gerais estáveis: fontes oficiais nacionais e organismos internacionais. Dados dinâmicos: atualizar apenas com fonte verificável e data.'
export const countries:Country[]=rows.map(([id,name,flag,capital,currency,languages,region,climate,cities,pros,cons,bestFor,harderFor])=>({id,name,flag,capital,currency,languages,region,climate,cities,pros,cons,bestFor,harderFor,dynamicNote,sources:[source]}))
