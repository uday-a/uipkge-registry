# Contributing to UIPKGE Registry

Welcome! We are excited that you want to contribute to UIPKGE.

UIPKGE is an open-source, dual-framework UI registry providing components and blocks for **Vue 3.5+ (Nuxt 4)** and **React 19+ (Next.js 16)**.

---

## ⚡ The Single-Framework Rule

> **You only need to know ONE framework to contribute.**
>
> You do **not** need to know React to contribute a Vue component.  
> You do **not** need to know Vue to contribute a React component.  
> You do **not** need to know Astro (our documentation engine is completely separated).

If you submit a PR for Vue, our maintainers and community will handle porting the component to React (and vice versa). Single-framework PRs are enthusiastically welcomed!

---

## 🚀 Getting Started

Ensure you have [Bun](https://bun.sh) (>= 1.4.0) installed.

```bash
git clone https://github.com/uday-a/uipkge-registry.git
cd uipkge-registry
bun install
```

---

## 🟢 Contributing in Vue

If you work with **Vue 3.5 / Nuxt 4**:

```bash
# 1. Enter the Vue package
cd packages/vue

# 2. Launch the isolated Vite dev playground
bun dev
```

This starts a lightweight Vite dev server on `http://localhost:5173` in < 300ms. It includes a searchable sidebar with live hot-reloading.

### Vue Component Structure

Components live under `packages/vue/components/<name>/`:

```text
packages/vue/components/button/
├── Button.vue              # Primary component SFC (using Reka UI primitives)
├── button.variants.ts      # CVA variants (if applicable)
├── index.ts                # Barrel export
└── button.registry.ts      # Registry sidecar manifest
```

### Adding a Demo

Add or update your demo in `packages/vue/demos/<name>.vue`:

```vue
<script setup lang="ts">
import { Button } from "@/components/ui/button";
</script>

<template>
  <Story title="Default" description="Standard button preview">
    <Button>Click me</Button>
  </Story>
</template>
```

The playground automatically discovers your demo file and makes it visible in the sidebar.

### Running Tests & Verification

```bash
bun test                    # Run vitest
bun run verify              # Verify registry sidecar manifests
```

---

## ⚛️ Contributing in React

If you work with **React 19 / Next.js 16**:

```bash
# 1. Enter the React package
cd packages/react

# 2. Launch the isolated Vite dev playground
bun dev
```

This starts a lightweight Vite dev server on `http://localhost:5174`.

### React Component Structure

Components live under `packages/react/components/<name>/`:

```text
packages/react/components/button/
├── Button.tsx              # Primary component TSX (using Radix UI primitives)
├── button.variants.ts      # CVA variants (if applicable)
├── index.ts                # Barrel export
└── button.registry.ts      # Registry sidecar manifest
```

### Adding a Demo

Add or update your demo in `packages/react/demos/<name>.tsx`:

```tsx
import Story from "../../playground/src/Story";
import { Button } from "@/components/ui/button";

export default function ButtonDemo() {
  return (
    <Story title="Default" description="Standard button preview">
      <Button>Click me</Button>
    </Story>
  );
}
```

### Running Tests & Verification

```bash
bun test                    # Run vitest
bun run verify              # Verify registry sidecar manifests
```

---

## 🎨 Design Tokens & Shared Styles

Design tokens (Tailwind CSS v4 OKLCH tokens) live in `packages/shared/styles/tailwind.css`. Both Vue and React consume the exact same token set.

- Use standard semantic tokens: `bg-card`, `bg-muted`, `border-border`, `text-foreground`, `text-muted-foreground`, `text-primary`.
- Avoid arbitrary sub-12px text sizes (`text-[10px]`); stick to `text-xs` (12px) and `text-sm` (14px).
- Respect accessibility and WCAG AA contrast standards.

---

## 📦 Pull Request Guidelines

1. Prefix your PR title with the framework, e.g.:
   - `feat(vue): add spotlight-card component`
   - `fix(react): resolve focus trap in dialog`
   - `style(shared): update warning token palette`
2. If your PR only implements one framework, add the label `needs-port` in the PR description so community members can pick up the companion port.
3. Keep PRs focused: one component or fix per pull request.

Thank you for helping build UIPKGE!
