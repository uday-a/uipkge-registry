import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'code-install-command',
  title: 'Code — Install Command',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Package-manager tab strip over a single install command with a copy button, a resolved-version line, and a short note on what the command writes to disk.',
  framework: 'vue',
  files: [{ path: 'CodeInstallCommand.vue', target: 'components/blocks/CodeInstallCommand.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
