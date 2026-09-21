# Architecture & Repository Topology

## 1. The Registry Distribution Model

In UIPKGE, components are **unbundled source code**, not packaged npm dependencies:

- **Zero Semver Lock-in**: Installing a component copies the source code (`.vue` or `.tsx`, `.variants.ts`, etc.) directly into the user's project (`components/ui/...`).
- **User Ownership**: Consumers are encouraged to modify the installed source code to fit their domain needs.
- **Transitive CLI Resolution**: When a user installs a component or block, the shadcn CLI queries the JSON manifest from `https://uipkge.dev/r/{framework}/{name}.json`, downloading dependencies transitively.

```text
Registry JSON (HTTP)  ──>  CLI (shadcn-vue / shadcn)  ──>  Copied into User Workspace
```

---

## 2. Monorepo Structure

```text
uipkge-registry/
├── packages/
│   ├── vue/                      # Vue 3.5 registry workspace
│   │   ├── components/           # UI primitives & charts (134 items)
│   │   ├── bootstrap/            # init, tailwind, utils, hooks (8 items)
│   │   ├── blocks/               # Community reference blocks
│   │   ├── demos/                # Story demos for Vue playground
│   │   ├── playground/           # Local Vite preview workbench (localhost:5173)
│   │   ├── scripts/              # build.ts, verify.ts, etc.
│   │   └── public/r/vue/*.json   # Built registry artifacts
│   ├── react/                    # React 19 registry workspace
│   │   ├── components/           # UI primitives & charts (134 items)
│   │   ├── bootstrap/            # init, tailwind, utils, hooks (8 items)
│   │   ├── blocks/               # Community reference blocks
│   │   ├── demos/                # Story demos for React playground
│   │   ├── playground/           # Local Vite preview workbench (localhost:5174)
│   │   ├── scripts/              # build.ts, verify.ts, check-use-client.ts
│   │   └── public/r/react/*.json # Built registry artifacts
│   └── shared/                   # Cross-framework single source of truth
│       ├── styles/               # Canonical tailwind.css and color-themes.css
│       └── variants/             # CVA variant class string definitions
├── scripts/
│   └── check-pr-scope.ts         # Boundary guard protecting primitives from block PRs
├── docs/                      # AI assistant & contributor documentation
├── CONTRIBUTING.md               # Contribution guidelines
└── package.json                  # Workspace root
```

---

## 3. Relationship to `uipkge-ui`

The UIPKGE ecosystem consists of two repositories with specific roles:

1. **`uipkge-ui` (Platform & Docs Monorepo)**:
   - Contains `apps/astro-site`, the full Astro SSG documentation site deployed to `https://uipkge.dev`.
   - Contains 467 domain vertical blocks and 503 demos used for reference vertical applications (HRMS, HMS, Logistics).
2. **`uipkge-registry` (This Repository - Open-Source Component Registry)**:
   - Contains the 210 core UI primitives, charts, tokens, and bootstrap utilities.
   - Houses the public community contribution surface.
   - Contains isolated Vite dev playgrounds (`dev:vue`, `dev:react`) so contributors can build without running a heavy docs site.

### Upstream & Downstream Flow

```text
[Community PRs] ──> uipkge-registry (main)
                           │
             bun run sync:upstream (in uipkge-ui)
                           │
                           ▼
                      uipkge-ui  ──>  bun run deploy  ──>  uipkge.dev
                           ▲
             bun run export:registry (in uipkge-ui)
                           │
                      uipkge-ui (core component updates)
```

---

## 4. Tech Stack & Version Pinning

Always use these exact pinned versions in documentation, code, and comments:

- **Vue**: `3.5`
- **Nuxt**: `4`
- **React**: `19`
- **Next.js**: `16`
- **Tailwind CSS**: `v4` with `@theme inline` and OKLCH color spaces
- **Bun**: `>= 1.4.0`
- **Headless Foundations**:
  - Vue: `reka-ui`
  - React: Radix UI primitives (`@radix-ui/react-*`)
- **Variant Engine**: `class-variance-authority` (CVA) + `clsx` + `tailwind-merge` via `cn()`
- **Charts Engine**: Apache ECharts 6 (`echarts`, `vue-echarts`)
