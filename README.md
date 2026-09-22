# UIPKGE Registry

> Open-source dual-framework component registry for **Vue 3.5** (Nuxt 4) and **React 19** (Next.js 16).

In UIPKGE, the **components are the product**, not an npm package. Source code is copied directly into your project via the CLI. You own the code, edit it freely, and have zero semver lock-in.

- 🌐 **Documentation & Live Previews**: [uipkge.dev](https://uipkge.dev)
- 🚀 **Boilerplates & Templates**: [Official Starters & Templates](#-official-boilerplates--production-templates)
- 🤝 **Contributing**: See [CONTRIBUTING.md](./CONTRIBUTING.md) (Single-framework contributions are welcomed!)
- 📚 **Documentation**: See [docs/](./docs/) and [AGENTS.md](./AGENTS.md)

---

## How This Repository Fits Together

- Primitives, charts, design tokens and bootstrap utilities are **developed in the maintainers' upstream monorepo** (the one that also builds [uipkge.dev](https://uipkge.dev)) and exported here. `.uipkge-sync.json` records the upstream commit last exported; the pipeline writes it, nobody edits it.
- This repository is the **public distribution surface and the place to contribute**:
  - **Blocks** are built here, under `packages/{vue,react}/blocks/<name>/`.
  - **Primitive fixes** are welcome as dedicated PRs. Merged fixes are ported upstream by the maintainers, and the export pipeline refuses to overwrite anything merged here that upstream does not have yet.

---

## Installation

### Vue 3.5 / Nuxt 4

```bash
# Bootstrap Tailwind tokens and utilities
npx shadcn-vue@latest add https://uipkge.dev/r/vue/init.json -y

# Install any component
npx shadcn-vue@latest add https://uipkge.dev/r/vue/button.json -y
```

### React 19 / Next.js 16

```bash
# Bootstrap Tailwind tokens and utilities
npx shadcn@latest add https://uipkge.dev/r/react/init.json

# Install any component
npx shadcn@latest add https://uipkge.dev/r/react/button.json
```

---

## 🚀 Official Boilerplates & Production Templates

Jumpstart your application with production-grade starters and reference templates built end-to-end on the UIPKGE component registry:

### ⚡ SaaS Starters & Boilerplates

| Boilerplate                     | Framework             | Features                                                                                                | Repository                                           |
| :------------------------------ | :-------------------- | :------------------------------------------------------------------------------------------------------ | :--------------------------------------------------- |
| **Nuxt 4 SaaS Boilerplate**     | Vue 3.5 / Nuxt 4      | 44-provider auth, magic-link, Polar billing, Drizzle ORM, dashboard, charts, forms, typed API envelope. | [GitHub](https://github.com/uday-a/nuxt-boilerplate) |
| **Next.js 16 SaaS Boilerplate** | React 19 / Next.js 16 | App Router, Radix UI primitives, authentication, dashboard metrics, and Tailwind CSS v4 design tokens.  | [GitHub](https://github.com/uday-a/next-boilerplate) |

### 🏥 Production Reference Templates

| Template                       | Framework        | Description                                                                                                       | Links                                                                                                                                          |
| :----------------------------- | :--------------- | :---------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| **HRMS Template**              | Nuxt 4 + Vue 3.5 | Human Resource Management System with 7 role personas, employee directory, leave management, and payroll.         | [GitHub](https://github.com/uday-a/uipkge-hrms-nuxt-template) · [Live Demo](https://uipkge-hrms-nuxt-template.uipkge.dev)                      |
| **Shipment Tracking Template** | Nuxt 4 + Vue 3.5 | Logistics & freight tracker featuring interactive ECharts route flow maps, shipment milestones, and status feeds. | [GitHub](https://github.com/uday-a/uipkge-shipment-tracking-template) · [Live Demo](https://uipkge-shipment-tracking-template.vercel.app/live) |
| **HMS Template**               | Nuxt 4 + Vue 3.5 | Hospital Management System with multi-persona clinical portals, patient queues, and env-gated Nitro backend.      | [GitHub](https://github.com/uday-a/uipkge-hms-nuxt-template)                                                                                   |

> 🌐 Explore all template previews in the [UIPKGE Vue Template Gallery](https://uipkge.dev/vue/templates) and [UIPKGE React Template Gallery](https://uipkge.dev/react/templates).

---

## Repository Structure

```text
uipkge-registry/
├── docs/                     # Specifications, architecture, & contributor documentation
├── packages/
│   ├── vue/                  # Vue 3.5 components, blocks, demos & dev playground
│   ├── react/                # React 19 components, blocks, demos & dev playground
│   └── shared/               # Canonical Tailwind v4 tokens & CVA variant definitions
├── CONTRIBUTING.md           # Single-framework contribution guide
└── README.md
```

---

## Development

Run lightweight, isolated playgrounds without touching other frameworks:

```bash
bun install

# Launch Vue playground (localhost:5173)
bun run dev:vue

# Launch React playground (localhost:5174)
bun run dev:react

# Build registry JSON manifests
bun run build:registry
```

---

## Community & Policies

- **License**: [MIT License](./LICENSE) © 2026 Uday Adaka & UIPKGE
- **Code of Conduct**: [Contributor Covenant v2.1](./CODE_OF_CONDUCT.md)
- **Security Policy**: [SECURITY.md](./SECURITY.md)
- **Questions & ideas**: [GitHub Discussions](https://github.com/uday-a/uipkge-registry/discussions)

### Third-Party Licenses

All code in this repository is MIT. One runtime dependency is not open source: [`mapbox-gl`](https://github.com/mapbox/mapbox-gl-js) (Mapbox GL JS v2+) is licensed under the [Mapbox Terms of Service](https://www.mapbox.com/legal/tos) and requires a Mapbox access token. It is pulled in by `map` and by the charts built on it: `bubble-map`, `choropleth-map-chart`, `dotted-map-chart`, `hexbin-map`, `route-flow-map` and `vector-map`. For a fully open stack use `leaflet-map` (OpenStreetMap tiles, no key). Every other dependency carries its own open-source license; check the `dependencies` of an item before you ship it.

### Acknowledgements

UIPKGE stands on:

- [shadcn/ui](https://ui.shadcn.com) (© 2023 shadcn, MIT) and [shadcn-vue](https://www.shadcn-vue.com) (© 2023 unovue, MIT) — the copy-the-source registry model, the CLIs that install from it, and the component conventions this registry follows. Portions of this registry derive from their code; their notices apply.
- [Radix UI](https://www.radix-ui.com) (© 2022 WorkOS, MIT) for React and [Reka UI](https://reka-ui.com) (© 2023 UnoVue, MIT) for Vue — the accessible headless primitives underneath.
- [Tailwind CSS](https://tailwindcss.com), [class-variance-authority](https://cva.style), [Lucide](https://lucide.dev) and [Apache ECharts](https://echarts.apache.org).
