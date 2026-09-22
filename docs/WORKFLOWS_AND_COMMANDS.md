# Workflows, CLI & Testing Guide

## 1. Developer Commands Cheat Sheet

All commands run with [Bun](https://bun.sh) (`bun >= 1.4.0`):

```bash
# Install dependencies
bun install

# Start local isolated playgrounds
bun run dev:vue        # Vue 3.5 workbench on http://localhost:5173
bun run dev:react      # React 19 workbench on http://localhost:5174

# Build registries (compiles manifests into public/r/{vue,react}/*.json)
bun run build:registry # Builds both Vue and React registries
bun run build:vue      # Builds Vue registry only
bun run build:react    # Builds React registry only

# Validation & Spec Checks
bun run verify         # Runs verify:vue and verify:react
bun run verify:vue     # Checks Vue manifests against registry spec
bun run verify:react   # Checks React manifests and validates 'use client'
bun run typecheck      # Runs vue-tsc and tsc (0 errors expected)
bun run check:scope    # Validates that block PRs do not mutate primitives

# Unit Tests (Vitest)
bun run test           # Runs all Vue & React test suites
bun run test:vue       # Runs Vue Vitest suites
bun run test:react     # Runs React Vitest suites

# Code Formatting
bun run format         # Formats files via Prettier (semi: false, singleQuote: true)
```

---

## 2. Consumer Installation Examples

When a consumer uses UIPKGE in their project:

### Vue 3 / Nuxt 4 Projects

```bash
# Initialize tokens & utils
npx shadcn-vue@latest add https://uipkge.dev/r/vue/init.json -y

# Add a component
npx shadcn-vue@latest add https://uipkge.dev/r/vue/button.json -y
npx shadcn-vue@latest add https://uipkge.dev/r/vue/data-table.json -y
npx shadcn-vue@latest add https://uipkge.dev/r/vue/line-chart.json -y
```

### React 19 / Next.js 16 Projects

```bash
# Initialize tokens & utils
npx shadcn@latest add https://uipkge.dev/r/react/init.json

# Add a component
npx shadcn@latest add https://uipkge.dev/r/react/button.json
npx shadcn@latest add https://uipkge.dev/r/react/data-table.json
npx shadcn@latest add https://uipkge.dev/r/react/line-chart.json
```

---

## 3. Writing Unit Tests

Components ship with companion Vitest tests under `__tests__/<name>.spec.ts` (or `.spec.tsx`).

### Vue Test Example (using `@vue/test-utils`)

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Button } from '../Button.vue'

describe('Button', () => {
  it('renders correctly with slot content', () => {
    const wrapper = mount(Button, {
      slots: { default: 'Click me' },
    })
    expect(wrapper.text()).toContain('Click me')
    expect(wrapper.attributes('data-slot')).toBe('button')
  })
})
```

### React Test Example (using `@testing-library/react`)

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('renders correctly with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeDefined()
    expect(screen.getByRole('button').getAttribute('data-slot')).toBe('button')
  })
})
```

---

## 4. Upstream & Downstream Ingest Pipeline

Maintainer-only. `uipkge-ui` is a private repository, so contributors cannot run these commands. Open a pull request here and a maintainer ingests it.

- **Syncing Upstream (ingesting community PRs from `uipkge-registry` into `uipkge-ui`)**:
  In `uipkge-ui`:
  ```bash
  bun run sync:upstream
  ```
- **Exporting Downstream (pushing canonical primitives from `uipkge-ui` into `uipkge-registry`)**:
  In `uipkge-ui`:
  ```bash
  bun run export:registry
  ```
  The export aborts if this repository has changes under exported paths that `uipkge-ui` lacks (baseline: `.uipkge-sync.json`). Ingest them with `bun run sync:upstream` first, or pass `--force` to discard them.
