import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'header-centered-logo',
  title: 'Header — Centered Logo',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Symmetrical navbar with the wordmark centred between two nav halves, a utility cluster on the right, and a mobile layout that collapses the split into a single sheet trigger.',
  framework: 'vue',
  files: [{ path: 'HeaderCenteredLogo.vue', target: 'components/blocks/HeaderCenteredLogo.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/sheet.json',
  ],
})
