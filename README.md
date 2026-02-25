# namea.dev

An interactive progressive quiz app built with SvelteKit 5 and deployed on Cloudflare Pages.

The default configuration is a "Name a..." CS knowledge quiz — pick your role, answer increasingly obscure questions, and find out your real engineering title. All quiz content (roles, questions, answers, commentary) lives in a single JSON config file, so the app can be repurposed for any topic.

## Getting started

```sh
bun install
bun run dev
```

## Customizing the quiz

All quiz content is defined in [`src/lib/data/quiz-config.json`](src/lib/data/quiz-config.json). Edit this file to create a completely different quiz.

The config has five sections:

### `branding`

Controls the site title, meta description, and the prompt prefix displayed in the quiz header.

```json
{
  "title": "namea.dev",
  "titleAccent": "namea",
  "titleSuffix": ".dev",
  "description": "Name a... quiz for software developers",
  "promptPrefix": "Name a"
}
```

### `roles`

The progression of roles a player can achieve. Non-absurd roles appear in the role picker on the landing page via `actualRoles`. Absurd roles are unlocked by answering questions beyond the normal set.

```json
{ "id": "student", "label": "Student" }
{ "id": "cto", "label": "CTO", "absurd": true }
```

### `actualRoles`

An array of role labels shown in the landing page dropdown. These should match the `label` of non-absurd roles.

### `questions`

Each question is tied to a `roleId` and has a prompt, accepted answers, and an optional docs URL.

```json
{
  "roleId": "student",
  "prompt": "Name a programming language.",
  "answers": [
    { "canonical": "JavaScript", "accept": ["javascript", "js"] },
    { "canonical": "Python", "accept": ["python", "py"] }
  ],
  "docsUrl": "https://en.wikipedia.org/wiki/List_of_programming_languages"
}
```

For questions that need custom validation instead of an accept list, use the `validator` and `exampleAnswer` fields:

```json
{
  "roleId": "linus",
  "prompt": "Name a valid UUID.",
  "answers": [],
  "validator": "uuid",
  "exampleAnswer": "550e8400-e29b-41d4-a716-446655440000"
}
```

Built-in validators: `uuid`, `brainfuck`.

### `commentary`

Template strings for the results page commentary. Available variables: `{actualRole}`, `{firstRole}`, `{correct}`, `{total}`.

```json
{
  "perfect": "Perfect score. You are either a genius or suspiciously good at Googling.",
  "zero": "Zero correct. ...",
  "noRole": "You failed the very first question. Even the {firstRole} role rejected you.",
  "underAchievedFar": "You claim to be a {actualRole} but proved otherwise. Does your manager know?",
  "fallback": "{correct} out of {total}. The universe has noted your performance."
}
```

## Commands

| Command | Description |
|---|---|
| `bun run dev` | Start dev server |
| `bun run build` | Production build |
| `bun run check` | TypeScript + Svelte type checking |
| `bun run test` | Run Vitest |
| `bun run test:watch` | Watch mode |

## Architecture

**Quiz flow:** Landing (`/`) → Quiz (`/quiz`) → Results (`/results`)

**Key modules:**

| Module | Purpose |
|---|---|
| `src/lib/data/quiz-config.json` | All quiz content — roles, questions, answers, branding, commentary |
| `src/lib/data/config.ts` | Typed config loader and interfaces |
| `src/lib/stores/quiz.ts` | Central quiz state store (init, start, submitAnswer, advance, restart) |
| `src/lib/engine/matcher.ts` | Answer validation — accept-list matching + named validators |
| `src/lib/engine/roles.ts` | Role definitions sourced from config |
| `src/lib/utils/commentary.ts` | Result commentary with template interpolation |
| `src/lib/utils/persistence.ts` | localStorage wrapper for quiz state |

**Tech stack:** SvelteKit 5 (Svelte 5 runes), Cloudflare Pages, D1 analytics database, Vitest.

## Deployment

The app uses `@sveltejs/adapter-cloudflare`. D1 database binding is defined in `wrangler.jsonc`, schema in `schema.sql`.

```sh
bun run build && npx wrangler pages deploy
```

## License

[MIT](LICENSE)
