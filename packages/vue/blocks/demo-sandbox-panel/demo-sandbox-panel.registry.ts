import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'demo-sandbox-panel',
  title: 'Demo — Sandbox Panel',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Interactive sandbox panel where editing a definition field updates a rendered result and a generated query side by side, with a reset control.',
  framework: 'vue',
  files: [{ path: 'DemoSandboxPanel.vue', target: 'components/blocks/DemoSandboxPanel.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
