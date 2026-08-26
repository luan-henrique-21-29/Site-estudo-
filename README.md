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

- Dashboard simplificado, responsivo e animado.
- Botão **Continuar de onde parei**.
- Conta opcional com e-mail/senha ou link mágico.
- Sincronização de progresso entre dispositivos quando o Supabase está configurado.
- Salvamento local imediato mesmo sem login ou internet.
- Onboarding completo e editável depois.
- Modo caderno com dica bônus, frase da página, exemplos e desenho simples.
- Busca global, inclusive por salários e profissões cadastradas.
- Favoritos, anotações, marca-texto, cadernos e histórico.
- Revisão espaçada em 1, 3, 7, 14, 30 e 60 dias.
- Metas pessoais e planejamento para morar fora.
- Progresso com gráficos, XP, sequência, calendário e estatísticas.
- Temas, cores, fontes, tamanhos, densidade, bordas e animações personalizáveis.
- Modo foco com Pomodoro e aula sugerida.
- Playground de HTML, CSS e JavaScript com preview em iframe isolado.
- Diretório pesquisável de cidades e comparador de países.
- Backup/importação local.
- PWA e cache offline básico.
- Pipeline de testes, build e deploy com GitHub Actions.

## Login e sincronização entre dispositivos

O site continua funcionando sem conta. Nesse modo, os dados ficam somente no navegador atual.

Quando a sincronização em nuvem é habilitada, a mesma conta pode ser usada no celular, computador ou outro dispositivo. O JSON de progresso inclui aulas concluídas, anotações, preferências visuais, flashcards, quizzes, metas, cadernos, histórico e a última página acessada.

A implementação usa **Supabase Auth + PostgreSQL com Row Level Security**. Nenhuma chave `service_role` deve ser colocada no frontend.

### 1. Criar o projeto no Supabase

Crie um projeto em Supabase e copie em `Project Settings → API`:

- Project URL
- public anon/publishable key

### 2. Criar a tabela segura

Abra o SQL Editor do Supabase e execute:

```text
supabase/schema.sql
```

O arquivo cria `study_profiles`, ativa RLS e permite que cada usuário leia e altere somente a própria linha.

### 3. Configurar desenvolvimento local

Copie `.env.example` para `.env.local` e preencha:

```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA
```

### 4. Configurar GitHub Pages

No repositório, adicione em `Settings → Secrets and variables → Actions → Repository secrets`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

O workflow de deploy injeta essas variáveis no build. Sem elas, o site continua em modo local e a página **Conta** explica que a nuvem não está ativa.

### Como a sincronização funciona

1. Qualquer mudança é salva primeiro no `localStorage`.
2. Se o usuário estiver conectado, a alteração recebe `updatedAt` e é enviada para a nuvem após um pequeno debounce.
3. Ao entrar em outro dispositivo, o site compara a cópia local e a remota e usa a mais recente.
4. Ao voltar para a aba, reconectar a internet ou focar a janela, a sincronização é conferida de novo.
5. `lastVisitedPath` e `lastLessonId` permitem retomar de onde o usuário parou.

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

Cada página de país também possui um **simulador de jornada** quando existe uma taxa horária comparável.

## Salários por profissão

A área de carreiras possui uma camada separada de dados ocupacionais. Ela não confunde salário mínimo com salário de profissão.

Os primeiros conjuntos verificados incluem fontes públicas/estatísticas de Canadá, Alemanha, Austrália, Estados Unidos e Irlanda. Quando a fonte oferece faixa, o site mostra baixo/mediana/alto, equivalente mensal, conversão aproximada para reais, período de referência e fonte.

## Conversão para BRL

O câmbio é buscado no navegador e não fica congelado no código. As taxas ficam em cache por até seis horas. Se nenhuma fonte estiver disponível para determinada moeda, a conversão aparece como indisponível em vez de usar cotação inventada.

## Programação prática

O **Playground** possui editores separados de HTML, CSS e JavaScript, preview em iframe com `sandbox`, botão de execução, reset e salvamento local do rascunho.

## Foco e estudo diário

A página **Estudar Hoje** combina conteúdo novo, revisão vencida e flashcards conforme o tempo escolhido. O **Modo foco** oferece ciclos 25/5, 50/10 e duração personalizada.

## Dados dinâmicos

Salários, custo de vida, câmbio, impostos e regras migratórias são tratados como dados sensíveis ao tempo. Quando não existe uma fonte suficientemente segura, a interface deve informar que o dado ainda não está disponível.

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

## Deploy

O workflow em `.github/workflows/deploy.yml` executa instalação, TypeScript/lint, testes e build. Em `main`, publica o conteúdo gerado no GitHub Pages.

A fonte do GitHub Pages precisa estar configurada como **GitHub Actions** em `Settings → Pages → Build and deployment → Source`.

## Estrutura

- `src/components` — componentes compartilhados.
- `src/pages` — telas da aplicação.
- `src/data` — aulas, atividades, países, carreiras e salários.
- `src/hooks` — estado, autenticação e dados dinâmicos.
- `src/services` — sincronização em nuvem.
- `src/lib` — persistência, Supabase, cálculos e utilidades.
- `supabase/schema.sql` — banco e políticas RLS para conta/sincronização.
- `.env.example` — variáveis necessárias para ativar a nuvem.
- `REQUIREMENTS.md` — requisitos completos usados como base do projeto.
