import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'environment-variables-manager',
  type: 'registry:block',
  categories: ['devops', 'dashboard', 'data', 'developer'],
  description:
    'Vercel and Supabase style environment variables and secrets manager with environment scoping, mask/reveal toggles, bulk import, and inline editing.',
  framework: 'vue',
  files: [{ path: 'EnvironmentVariablesManager.vue', target: 'components/blocks/EnvironmentVariablesManager.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/tabs.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})
