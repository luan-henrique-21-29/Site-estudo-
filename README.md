# Futuro Lab

Plataforma pessoal de estudos e planejamento de futuro com inglês, investimentos, programação, países, salários, carreiras e ferramentas práticas.

## Conteúdo inicial

- 80 aulas de inglês.
- 60 aulas de investimentos.
- 90 aulas de programação.
- 46 países com informações gerais, cidades, idiomas, prós e contras.
- 20 carreiras com habilidades, roadmap e projetos de portfólio.
- 200 flashcards.
- 120 exercícios.
- 20 quizzes.
- 10 ferramentas/simuladores.

## Funcionalidades

- Dashboard responsivo e animado.
- Onboarding local.
- Modo caderno com dica bônus, frase da página, exemplos e desenho simples.
- Busca global.
- Favoritos e anotações.
- Revisão por dificuldade.
- Metas pessoais e planejamento para morar fora.
- Progresso com gráficos.
- Temas, cores, fontes, tamanhos, densidade, bordas e animações personalizáveis.
- Backup/importação local.
- PWA e cache offline básico.
- Pipeline de testes, build e deploy com GitHub Actions.

## Salários e câmbio

A área **Salários** possui um registro para cada país da plataforma. Quando existe um salário mínimo nacional/federal comparável, o site mostra:

- valor oficial ou de referência;
- equivalente por hora;
- equivalente mensal;
- equivalente aproximado em reais;
- jornada usada quando a conversão precisa ser estimada;
- data de vigência/checagem;
- escopo da regra;
- link da fonte.

Países sem salário mínimo nacional único não recebem um número inventado. A interface explica quando o sistema é regional, setorial, baseado em acordos coletivos ou simplesmente não possui piso universal.

### Conversão para BRL

O câmbio é buscado no navegador e não fica congelado no código. O fluxo usa:

1. `open.er-api.com` com base BRL para cobertura ampla de moedas;
2. Frankfurter como fallback, uma API pública que agrega dados de bancos centrais.

As taxas são armazenadas por até seis horas no `localStorage`. Se nenhuma fonte estiver disponível para determinada moeda, a conversão aparece como indisponível em vez de usar uma cotação inventada.

As conversões são apenas aproximações cambiais. Salário mínimo não é salário médio da profissão, e valores brutos não representam salário líquido depois de impostos.

## Dados dinâmicos

Salários, custo de vida, câmbio, impostos e regras migratórias são tratados como dados sensíveis ao tempo. A aplicação diferencia informação estável de informação atualizável e mantém fonte/data quando um valor atual é mostrado.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Qualidade

```bash
npm test
npm run lint
npm run build
```

Os testes validam os mínimos de conteúdo, integridade de quizzes, cobertura salarial dos países e fórmulas de equivalência/conversão.

## Deploy

O workflow em `.github/workflows/deploy.yml` executa instalação, TypeScript/lint, testes e build. Em `main`, publica o conteúdo gerado no GitHub Pages quando o repositório está configurado para usar GitHub Actions como fonte do Pages.

## Estrutura

- `src/components` — componentes compartilhados.
- `src/pages` — telas da aplicação.
- `src/data` — aulas, atividades, países, carreiras e salários.
- `src/hooks` — estado local e dados dinâmicos como câmbio.
- `src/lib` — persistência, cálculos e utilidades.
- `REQUIREMENTS.md` — requisitos completos usados como base do projeto.
