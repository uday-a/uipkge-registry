# Registry Sidecar Manifest Schema

Every registry item (component, chart, block, utility) ships with a sidecar `<name>.registry.ts` file in its directory.

---

## 1. Example Manifest

```ts
import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'button',
  type: 'registry:ui',
  description:
    'Interactive button control supporting primary, destructive, outline, secondary, ghost, and link variants with standard size tiers.',
  categories: ['control'],
  framework: 'vue', // or 'react'
  files: [
    { path: 'Button.vue', target: 'components/ui/button/Button.vue' },
    { path: 'button.variants.ts', target: 'components/ui/button/button.variants.ts' },
    { path: 'index.ts', target: 'components/ui/button/index.ts' },
  ],
  dependencies: ['class-variance-authority', 'reka-ui'],
  registryDependencies: [],
})
```

---

## 2. Field Specifications

| Field                  | Type               | Description                                                                                                                                 |
| ---------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                 | `string`           | Unique kebab-case name of the item (e.g. `button`, `data-table`, `line-chart`).                                                             |
| `type`                 | `RegistryType`     | `registry:ui` (primitive), `registry:block` (composed section), `registry:lib`, `registry:style`, or `registry:hook`.                       |
| `description`          | `string`           | Clear 1–2 sentence explanation of the component's capability and purpose.                                                                   |
| `categories`           | `string[]`         | Array of functional categories: `['control']`, `['data-display']`, `['chart']`, `['navigation']`, `['overlay']`, `['form']`.                |
| `framework`            | `'vue' \| 'react'` | Framework tag for this manifest.                                                                                                            |
| `files`                | `RegistryFile[]`   | Array of source files mapping `{ path: string, target: string }`. `target` is where the shadcn CLI copies the file in the consumer project. |
| `dependencies`         | `string[]`         | External npm packages the consumer must install (e.g. `reka-ui`, `echarts`, `lucide-vue-next`).                                             |
| `registryDependencies` | `string[]`         | UIPKGE items this component imports, declared as flat full URLs: `https://uipkge.dev/r/<name>.json`.                                        |

---

## 3. Build & Compilation Pipeline

When `bun run build:registry` runs:

1. `scripts/build.ts` scans all `*.registry.ts` files across `components/`, `bootstrap/`, and `blocks/`.
2. Resolves and validates all relative paths in `files`.
3. Injects the framework segment into `registryDependencies`, transforming:
   `https://uipkge.dev/r/button.json` ──> `https://uipkge.dev/r/vue/button.json` (or `/react/`)
4. Emits individual JSON manifests into:
   - Vue: `public/r/vue/<name>.json`
   - React: `public/r/react/<name>.json`
5. Emits registry index catalogs:
   - `packages/{vue,react}/registry.json`
   - `public/r/{vue,react}/registry.json`

---

## 4. Verification Check (`bun run verify`)

The verifier (`scripts/verify.ts`) checks:

1. Every manifest item has valid `name`, `type`, and `files`.
2. Every file path declared in `files` actually exists on disk.
3. Every target path adheres to conventions (`components/ui/...` or `lib/...`).
4. In React packages, `scripts/check-use-client.ts` verifies that every interactive client component file has `'use client'` at the top.
