import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'integrations-directory',
  type: 'registry:block',
  categories: ['devops', 'marketing', 'dashboard'],
  description:
    'App marketplace surface: functional search, category chips with counts and an installed-only switch above a responsive grid of integration cards (logo tile, one-line blurb, author row, install/connected footer). Clicking a card opens a detail dialog with permissions; pass `featuredId` to render that dialog body as an always-visible panel. Stateful demo — swap the stub catalog for your source.',
  framework: 'vue',
  files: [
    { path: 'IntegrationsDirectory.vue', target: 'components/blocks/integrations-directory/IntegrationsDirectory.vue' },
    { path: 'page.vue', target: 'app/pages/integrations-directory-demo.vue' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/chip.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/empty-state.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/switch.json',
  ],
})
