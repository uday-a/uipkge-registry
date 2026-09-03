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

## 🧱 Contributing Blocks (`registry:block`)

Blocks compose existing UI primitives (`Card`, `Button`, `Badge`, `Input`, `Progress`, etc.) into higher-level domain patterns (e.g. dashboards, settings, metrics).

### Block Authoring Rules

1. **Pure Primitive Composition**:
   - Primitives abstract mechanics; blocks compose layout.
   - Blocks must read top-to-bottom at the call site. Spell out tile titles, metrics, badges, and action buttons inline.
   - **Never create hidden template wrappers** (e.g. no `StatCard` wrapper that takes an `items` array). Use raw `Card` composition.
2. **Proper Naming & Collision Prevention**:
   - Use descriptive, lower kebab-case names: `cloud-backup-schedule`, `api-keys`, `workspace-quota`.
   - Check existing directories under `packages/vue/blocks/` and `packages/react/blocks/` before naming a new block.
   - Do not reuse or duplicate existing primitive or block names.
3. **Accurate Manifests & Dependencies**:
   - Every UI primitive imported in the block (`@/components/ui/<primitive>`) **must** be listed in `registryDependencies` using `https://uipkge.dev/r/<primitive>.json`.
   - Third-party packages (e.g. `lucide-vue-next` or `lucide-react`) must be listed in `dependencies`.
4. **Testing Requirements**:
   - Every block must provide a unit test under `__tests__/<name>.spec.ts` (or `.spec.tsx`) ensuring it renders without crashing and validates key interactive elements.

---

## 🛡️ Contributor & Maintainer Precautions

### Pre-flight Checklist Before Submitting a PR
- [ ] `bun run check:scope`: Validates that block PRs do NOT touch existing primitives or shared tokens.
- [ ] `bun run typecheck`: TypeScript passes without diagnostics.
- [ ] `bun test`: All unit tests pass in both frameworks.
- [ ] `bun run verify`: Sidecar schemas conform to registry spec.
- [ ] `bun run build`: Registry build succeeds and JSON outputs are clean.
- [ ] **Strict Scope Isolation**: Block contributions must ONLY add files under `packages/{vue,react}/blocks/<name>/` and `packages/{vue,react}/demos/<name>.*`. Never modify existing primitives (`components/ui/*`) or shared styles (`packages/shared/*`).
- [ ] No arbitrary pixel values (`text-[10px]` or hardcoded `#hex` colors). Use semantic OKLCH tokens (`border-border`, `bg-card`, `text-foreground`).

### Maintainer Sync Procedure
When a community or registry PR is merged into `main` of `uipkge-registry`:
```bash
# 1. Inside the main uipkge-ui monorepo:
# Copy the new block source & sidecar from uipkge-registry:
cp -r ../uipkge-registry/packages/vue/blocks/<name> packages/registry-vue/blocks/
cp -r ../uipkge-registry/packages/react/blocks/<name> packages/registry-react/blocks/

# 2. Add companion preview demos in astro-site:
# apps/astro-site/src/demos/vue/<name>.vue
# apps/astro-site/src/demos/react/<name>.tsx

# 3. Build & verify monorepo:
bun run build:registry
bun run verify
```

---

## 📦 Pull Request Guidelines

1. Prefix your PR title with conventional commits, e.g.:
   - `feat(block): add cloud-backup-schedule block`
   - `feat(vue): add spotlight-card component`
   - `fix(react): resolve focus trap in dialog`
2. If your PR only implements one framework, add the note `needs-port` in the PR description so community members can pick up the companion port.
3. Keep PRs focused: one component, block, or fix per pull request.

Thank you for helping build UIPKGE!
