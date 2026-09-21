# UIPKGE Registry — AI Documentation & Agent Guide

> **For AI Assistants (Claude, Cursor, Copilot, ChatGPT, Gemini, Antigravity) & Human Contributors**  
> This directory provides authoritative specifications, design systems, architectural boundaries, component catalogs, and development workflows for the `uipkge-registry` codebase.

---

## Quick Navigation

| Document                                                         | Purpose                                                                                                             |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [**ARCHITECTURE.md**](./ARCHITECTURE.md)                         | Registry distribution philosophy (shadcn model), monorepo topology, dual-framework parity, and workspace boundaries |
| [**COMPONENT_STANDARDS.md**](./COMPONENT_STANDARDS.md)           | Component authoring guide, file layout, CVA variants, Vue 3.5 / React 19 rules, accessibility, and craft standards  |
| [**REGISTRY_SCHEMA.md**](./REGISTRY_SCHEMA.md)                   | `<name>.registry.ts` sidecar schema, manifest compilation, dependency graphs, and registry JSON generation          |
| [**PRIMITIVE_VS_BLOCK_RULES.md**](./PRIMITIVE_VS_BLOCK_RULES.md) | Critical architectural boundary between primitives (`registry:ui`) and composed blocks (`registry:block`)           |
| [**COMPONENTS_CATALOG.md**](./COMPONENTS_CATALOG.md)             | Full classified inventory of all 210 shipped items: UI primitives, charts, and bootstrap utilities                  |
| [**WORKFLOWS_AND_COMMANDS.md**](./WORKFLOWS_AND_COMMANDS.md)     | Development playgrounds, verification scripts, testing patterns, and upstream/downstream synchronization            |

---

## Core Tenets for AI Agents

1. **The Component is the Product**: UIPKGE does NOT publish npm packages. Consumers pull component source files directly into their projects via `npx shadcn-vue add <url>` or `npx shadcn add <url>`. Consumers own and edit their code.
2. **Dual-Framework Parity**:
   - **Vue 3.5** (Nuxt 4 target) using Reka UI headless primitives.
   - **React 19** (Next.js 16 target) using Radix UI headless primitives.
   - Design tokens and CVA variant strings are identical across frameworks via `packages/shared/`.
3. **Strict Boundaries**:
   - UI primitives (`registry:ui`) must NEVER take structured record arrays (`items`, `data`) and render baked layouts.
   - Blocks (`registry:block`) compose primitives top-to-bottom and spell out tiles, metrics, and actions inline.
4. **React Client Directives**:
   - Every interactive React component (`.tsx`) MUST declare `'use client'` at the top of the file before any imports.
5. **No Invented Versions**:
   - Vue: 3.5 · Nuxt: 4
   - React: 19 · Next.js: 16
   - Tailwind CSS: v4 with `@theme inline` OKLCH tokens
   - Bun: >= 1.4.0
