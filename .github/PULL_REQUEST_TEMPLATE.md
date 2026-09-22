## Description

<!-- Provide a brief explanation of what this pull request changes or accomplishes. -->

---

## Type of Change

- [ ] 🚀 New component or block (`feat`)
- [ ] 🐛 Bug fix (`fix`)
- [ ] 💅 UI craft, styling, or token refinement (`style`)
- [ ] ⚡ Performance improvement (`perf`)
- [ ] 📝 Documentation update (`docs`)
- [ ] 🧪 Tests or verification (`test`)

---

## Framework Scope

- [ ] **Vue 3.5 / Nuxt 4** (`packages/vue/`)
- [ ] **React 19 / Next.js 16** (`packages/react/`)
- [ ] **Both frameworks** (includes `packages/shared/`)

> **Note on Single-Framework Contributions**:  
> If this PR implements only Vue or only React, that is 100% welcome! Maintainers and the community will handle porting the companion framework. Please add the label/tag `needs-port` in your description.

---

## Pre-flight Checklist

Please check all that apply:

- [ ] My code follows the repository's code style (run `bun run format`).
- [ ] TypeScript passes with zero diagnostics (run `bun run typecheck`).
- [ ] Manifest and registry specs pass (run `bun run verify`).
- [ ] Unit tests pass (run `bun run test`).
- [ ] If this PR adds a **Block** (`registry:block`), it only touches `packages/{vue,react}/blocks/` and demos, and does NOT modify existing primitives (run `bun run check:scope`).
- [ ] In React components, `'use client'` is declared at the top of interactive files.
- [ ] All interactive states, light/dark themes, and keyboard focus rings are verified.
