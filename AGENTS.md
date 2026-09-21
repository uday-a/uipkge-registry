# AGENTS.md — Agent Guidelines for UIPKGE Registry

Read this file and [`docs/README.md`](./docs/README.md) when assisting with or modifying code in this repository.

---

## 🎯 Purpose & Scope

UIPKGE is an open-source dual-framework UI component registry where **the components are the product**, not an npm package. Consumers run `npx shadcn-vue add <url>` or `npx shadcn add <url>` to copy source code directly into their project.

- **This repository (`uipkge-registry`)**: Houses the 210 core primitives, charts, tokens, bootstrap items, and isolated Vite playgrounds.
- **Detailed Documentation**: Full specifications live under [`docs/`](./docs/).

---

## 📌 Tech Stack & Versions

Do not invent versions. Pin these authoritative strings:

- **Vue**: `3.5` + **Nuxt**: `4` (using `reka-ui`)
- **React**: `19` + **Next.js**: `16` (using Radix UI)
- **Tailwind CSS**: `v4` with OKLCH design tokens
- **Bun**: `>= 1.4.0`

---

## ⚡ Core Rules for AI Assistants

1. **Dual-Framework Parity**: Every component, chart, or utility exists in both Vue (`packages/vue/`) and React (`packages/react/`). Design tokens and CVA variants are identical via `packages/shared/`.
2. **React `'use client'` Directive**: Every interactive React component file (`.tsx`) must begin with `'use client'`.
3. **Primitive vs Block Boundary**:
   - Primitives (`registry:ui`) NEVER take structured record arrays (`items`, `data`) to render layouts.
   - Blocks (`registry:block`) compose primitives top-to-bottom and spell out titles, metrics, and badges inline.
4. **Base Component Immunity**: Never modify existing base primitives (`components/ui/*`) or shared tokens (`packages/shared/*`) while creating or modifying blocks. Block contributions are strictly isolated to `packages/{vue,react}/blocks/<name>/`.
5. **Token Discipline & No Micro-Text**: All components and blocks must strictly use semantic OKLCH design tokens (`border-border`, `bg-card`, `text-foreground`). Never use arbitrary palette colors (`bg-blue-500`) or sub-12px micro-text (`text-[10px]`).
6. **Manifest Accuracy**: Every item must maintain an accurate `<name>.registry.ts` declaring all dependencies and target paths.
7. **Formatting**:
   - Single quotes (`'`).
   - No semicolons (`semi: false`).
   - 2-space indentation.
   - 120 line print width.

---

## 🛠️ Verification Commands

Always run these before declaring code changes complete:

```bash
bun run build:registry   # Rebuild JSON manifests
bun run verify           # Verify schema & 'use client' directives
bun run typecheck        # Zero TypeScript diagnostics
bun run test             # Run Vitest test suites
bun run format           # Format with Prettier
```

---

## 📖 Deep Dives

- [Architecture & Monorepo Topology](./docs/ARCHITECTURE.md)
- [Component Authoring & Craft Standards](./docs/COMPONENT_STANDARDS.md)
- [Registry Manifest Specification](./docs/REGISTRY_SCHEMA.md)
- [Primitive vs Block Boundary Rules](./docs/PRIMITIVE_VS_BLOCK_RULES.md)
- [Complete 210 Component Catalog](./docs/COMPONENTS_CATALOG.md)
- [Workflows & CLI Reference](./docs/WORKFLOWS_AND_COMMANDS.md)
