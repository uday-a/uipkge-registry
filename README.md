# UIPKGE Registry

> Open-source dual-framework component registry for **Vue 3.5** (Nuxt 4) and **React 19** (Next.js 16).

In UIPKGE, the **components are the product**, not an npm package. Source code is copied directly into your project via the CLI. You own the code, edit it freely, and have zero semver lock-in.

- 🌐 **Documentation & Live Previews**: [uipkge.dev](https://uipkge.dev)
- 🤝 **Contributing**: See [CONTRIBUTING.md](./CONTRIBUTING.md) (Single-framework contributions are welcomed!)

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

## Repository Structure

```text
uipkge-registry/
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

## License

MIT © UIPKGE
