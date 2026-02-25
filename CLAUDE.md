# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

namea.dev is an interactive progressive quiz app built with SvelteKit 5 (Svelte 5 runes) and deployed on Cloudflare Pages with a D1 analytics database. All quiz content (roles, questions, answers, branding, commentary) is defined in a single JSON config file, making the app reusable for any topic.

## Commands

- `bun run dev` — start dev server
- `bun run build` — production build
- `bun run check` — TypeScript + Svelte type checking
- `bun run test` — run Vitest
- `bun run test:watch` — watch mode
- `bun run build && npx wrangler pages deploy` — deploy to Cloudflare Pages

bun is the package manager. Wrangler requires npx (nvm is installed). No node/npm installed directly.

## Git Workflow

- Create a feature branch, commit in small logical steps, push, and open a PR
- User merges the PR — do not merge

## Architecture

**Quiz flow:** Landing (`/`) → Quiz (`/quiz`) → Results (`/results`)

**Configuration:**
- `src/lib/data/quiz-config.json` — Single source of truth for all quiz content: branding, roles, questions with answers, and commentary templates.
- `src/lib/data/config.ts` — Typed config loader. Exports `config: QuizConfig` and all related interfaces (`Question`, `Role`, `Branding`, `Commentary`, etc.).

**Key layers:**
- `src/lib/stores/quiz.ts` — Central quiz state store with methods (init, start, submitAnswer, advance, restart). Persists to localStorage.
- `src/lib/engine/matcher.ts` — Answer validation. Standard questions use fuzzy matching with accept lists. Questions with a `validator` field use named validators (e.g. `uuid`, `brainfuck`).
- `src/lib/engine/roles.ts` — Role progression system sourced from config. Real roles and absurd roles unlocked by answering harder questions correctly.
- `src/lib/data/questions.ts` — Re-exports questions from config with helper functions.
- `src/lib/utils/commentary.ts` — Generates result commentary using configurable template strings with variable interpolation ({actualRole}, {firstRole}, {correct}, {total}).
- `src/lib/utils/persistence.ts` — localStorage wrapper for quiz state.

**API routes:**
- `POST /api/analytics/submit` — records quiz completions to D1
- `GET /api/analytics/stats` — returns role distribution stats

**Deployment:** SvelteKit with `adapter-cloudflare`. Build output at `.svelte-kit/cloudflare`. D1 database binding defined in `wrangler.jsonc`. Schema in `schema.sql`.

## Conventions

- Svelte 5 runes (`$state`, `$derived`, `$props`) — not legacy reactive syntax
- Component-scoped CSS with CSS custom properties for theming
- Dark theme with green accent (#4ade80), JetBrains Mono font
- Tests live alongside source files (`*.test.ts`)
- D1 platform binding typed in `src/app.d.ts`
- UI branding strings come from `config.branding`, not hardcoded
