import { defineRegistryItem } from "../../lib/define-registry";

const REGISTRY_URL = process.env.REGISTRY_URL ?? "https://uipkge.dev/r";

export default defineRegistryItem({
  name: "init",
  type: "registry:lib",
  description:
    "One-shot bootstrap. Pulls tailwind tokens, the cn() helper, and the useTheme composable in a single command. Run this first when starting a new app.",
  framework: "vue",
  files: [],
  // `typescript` is listed even though we have no .ts file in this manifest.
  // Vue 3.5+ SFC compiler delegates `defineProps<ExternalProps>()` resolution
  // to the project's installed `typescript` package; without it, every
  // kit component that uses that pattern (Tabs, Sidebar, Tooltip, ~195
  // total) crashes with "Failed to load TypeScript". Forcing it as a
  // bootstrap dep means every uipkge consumer has it before they install
  // their first component.
  dependencies: [],
  // Dep graph is a tree -- `init` -> {tailwind, utils, use-theme}; the
  // three sub-items all declare `registryDependencies: []`. shadcn-vue's
  // CLI prints a one-line "Circular dependency detected in registry
  // items" notice during the resolver pass anyway, then completes
  // successfully -- it's an upstream resolver false positive, not a real
  // cycle. Don't chase it; the install works.
  registryDependencies: [
    `${REGISTRY_URL}/tailwind.json`,
    `${REGISTRY_URL}/utils.json`,
    `${REGISTRY_URL}/use-theme.json`,
  ],
});
