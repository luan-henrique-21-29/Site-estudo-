# Futuro Lab

Plataforma pessoal de estudos, planejamento de futuro, inglês, investimentos, países, programação e carreiras.

## O que já existe nesta versão

- Dashboard responsivo e animado.
- Onboarding local.
- 80 aulas de inglês.
- 60 aulas de investimentos.
- 90 aulas de programação.
- 46 países com informações gerais estáveis, prós, contras e cidades para pesquisar.
- 20 carreiras com habilidades, roadmap e projetos de portfólio.
- Modo caderno com dica bônus, frase da página e desenho simples.
- Busca global.
- Favoritos.
- Anotações.
- Revisão por dificuldade.
- Metas pessoais.
- Progresso com gráfico.
- Oito ferramentas/simuladores financeiros e educacionais.
- Temas, cores, fontes, tamanhos, densidade, bordas e animações personalizáveis.
- Backup/importação local.
- PWA e cache offline básico.
- Pipeline de teste, build e deploy com GitHub Actions.

## Dados dinâmicos

Salários, custo de vida, câmbio, impostos e regras migratórias não são inventados. O site não inventa dados dinâmicos. Nesta versão, quando um dado atual ainda não foi carregado de uma fonte verificável, a interface informa isso claramente.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Testes

```bash
npm test
npm run lint
npm run build
```

## Deploy

O workflow em `.github/workflows/deploy.yml` está preparado para GitHub Pages. O repositório precisa estar configurado para usar GitHub Actions como fonte do Pages.

## Estrutura

- `src/components` — componentes compartilhados.
- `src/pages` — telas.
- `src/data` — aulas, países e carreiras.
- `src/hooks` — estado local.
- `src/lib` — persistência e utilidades.
- `REQUIREMENTS.md` — prompt/requisitos completos usados como base.
