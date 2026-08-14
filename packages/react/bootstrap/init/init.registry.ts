import { defineRegistryItem } from '../../lib/define-registry'

const REGISTRY_URL = process.env.REGISTRY_URL ?? 'https://uipkge.dev/r'

export default defineRegistryItem({
  name: 'init',
  type: 'registry:lib',
  description:
    'One-shot bootstrap. Pulls tailwind tokens, the cn() helper, and the theme provider/useTheme hook in a single command. Run this first when starting a new app.',
  files: [],
  // Dep graph is a tree -- `init` -> {tailwind, utils, use-theme}; the three
  // sub-items all declare `registryDependencies: []`. shadcn's CLI may print a
  // one-line "Circular dependency detected" notice during the resolver pass,
  // then completes successfully -- upstream resolver false positive.
  registryDependencies: [
    `${REGISTRY_URL}/tailwind.json`,
    `${REGISTRY_URL}/utils.json`,
    `${REGISTRY_URL}/use-theme.json`,
  ],
})
