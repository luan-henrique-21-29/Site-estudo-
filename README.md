# Futuro Lab

Plataforma pessoal de estudos e planejamento de futuro com inglês, investimentos, programação, países, salários, carreiras e ferramentas práticas.

## Conteúdo inicial

- 80 aulas de inglês.
- 60 aulas de investimentos.
- 90 aulas de programação.
- 46 países com informações gerais, cidades, idiomas, prós e contras.
- Diretório com mais de 100 cidades gerado a partir dos países cadastrados.
- 20 carreiras com habilidades, roadmap, portfólio e referências salariais quando há fonte verificável.
- 200 flashcards.
- 120 exercícios.
- 20 quizzes.
- 10 ferramentas/simuladores.

## Funcionalidades

- Dashboard responsivo e animado.
- Onboarding local.
- Modo caderno com dica bônus, frase da página, exemplos e desenho simples.
- Busca global, inclusive por salários e profissões cadastradas.
- Favoritos e anotações.
- Revisão por dificuldade.
- Metas pessoais e planejamento para morar fora.
- Progresso com gráficos.
- Temas, cores, fontes, tamanhos, densidade, bordas e animações personalizáveis.
- Modo foco com Pomodoro e aula sugerida.
- Playground de HTML, CSS e JavaScript com preview em iframe isolado.
- Diretório pesquisável de cidades.
- Comparação de países com piso por hora, equivalente mensal e conversão aproximada para BRL.
- Backup/importação local.
- PWA e cache offline básico.
- Pipeline de testes, build e deploy com GitHub Actions.

## Salários mínimos e câmbio

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

Cada página de país também possui um **simulador de jornada** quando existe uma taxa horária comparável: o usuário escolhe as horas por semana e vê uma estimativa mensal na moeda local e, quando o câmbio está disponível, em reais.

## Salários por profissão

A área de carreiras possui uma camada separada de dados ocupacionais. Ela não confunde salário mínimo com salário de profissão.

Os primeiros conjuntos verificados incluem fontes públicas/estatísticas de:

- Canadá — Job Bank / Statistics Canada;
- Alemanha — Entgeltatlas da Bundesagentur für Arbeit;
- Austrália — Jobs and Skills Australia / ABS;
- Estados Unidos — Bureau of Labor Statistics (OEWS);
- Irlanda — Central Statistics Office, com aviso explícito quando o dado é de grupo ocupacional amplo.

Quando a fonte oferece faixa, o site mostra baixo/mediana/alto. Também calcula um equivalente mensal e uma conversão aproximada para reais. O período de referência e a fonte ficam visíveis para evitar tratar dado antigo como atual.

## Conversão para BRL

O câmbio é buscado no navegador e não fica congelado no código. O fluxo usa:

1. `open.er-api.com` com base BRL para cobertura ampla de moedas;
2. Frankfurter como fallback, uma API pública baseada em dados de bancos centrais.

As taxas ficam em cache por até seis horas no `localStorage`. Se nenhuma fonte estiver disponível para determinada moeda, a conversão aparece como indisponível em vez de usar cotação inventada.

As conversões são apenas aproximações cambiais. Salário mínimo não é salário médio da profissão, e valores brutos não representam salário líquido depois de impostos.

## Programação prática

O **Playground** possui editores separados de HTML, CSS e JavaScript, preview em iframe com `sandbox`, botão de execução, reset e salvamento local do rascunho. Ele foi criado para acompanhar a trilha de programação desde os fundamentos até projetos.

## Foco e estudo diário

A página **Estudar Hoje** sugere conteúdo não concluído por matéria e duração. O botão **Modo foco** abre uma interface sem sidebar/menu inferior e oferece ciclos 25/5, 50/10 e 15/3, com timer local e acesso direto à aula completa.

## Dados dinâmicos

Salários, custo de vida, câmbio, impostos e regras migratórias são tratados como dados sensíveis ao tempo. A aplicação diferencia informação estável de informação atualizável e mantém fonte/data quando um valor atual é mostrado. Quando não existe uma fonte suficientemente segura, a interface deve dizer que o dado não está disponível em vez de fabricar um valor.

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

Os testes validam os mínimos de conteúdo, integridade de quizzes, cobertura salarial dos países, fórmulas de equivalência/conversão e consistência dos registros de salários por profissão.

## Deploy

O workflow em `.github/workflows/deploy.yml` executa instalação, TypeScript/lint, testes e build. Em `main`, publica o conteúdo gerado no GitHub Pages quando o repositório está configurado para usar GitHub Actions como fonte do Pages.

## Estrutura

- `src/components` — componentes compartilhados.
- `src/pages` — telas da aplicação.
- `src/data` — aulas, atividades, países, carreiras e salários.
- `src/hooks` — estado local e dados dinâmicos como câmbio.
- `src/lib` — persistência, cálculos e utilidades.
- `REQUIREMENTS.md` — requisitos completos usados como base do projeto.
