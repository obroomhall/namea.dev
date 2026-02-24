# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

namea.dev is an interactive "Name a..." quiz that progressively tests CS knowledge, built with SvelteKit 5 (Svelte 5 runes) and deployed on Cloudflare Pages with a D1 analytics database.

## Commands

- `bun run dev` — start dev server
- `bun run build` — production build
- `bun run check` — TypeScript + Svelte type checking
- `bun run test` — run Vitest
- `bun run test:watch` — watch mode
- `bun run build && npx wrangler pages deploy` — deploy to Cloudflare Pages

bun is the package manager. Wrangler requires npx (nvm is installed).

## Architecture

**Quiz flow:** Landing (`/`) → Quiz (`/quiz`) → Results (`/results`)

**Key layers:**
- `src/lib/stores/quiz.ts` — Central quiz state store with methods (init, start, submitAnswer, advance, restart). Persists to localStorage.
- `src/lib/engine/matcher.ts` — Answer validation. Standard questions use fuzzy matching with accept lists. Special cases: UUID format validation and Brainfuck syntax validation.
- `src/lib/engine/roles.ts` — Role progression system. Real roles (Student→Principal) and absurd roles (Mass, CPU, /dev/null) unlocked by answering harder questions correctly.
- `src/lib/data/questions.ts` — 13 progressive questions, each tied to a role_id.
- `src/lib/utils/commentary.ts` — Generates result commentary based on actual vs. achieved role.
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
