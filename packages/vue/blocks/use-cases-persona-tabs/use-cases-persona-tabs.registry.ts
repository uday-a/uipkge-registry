import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'use-cases-persona-tabs',
  title: 'Use Cases — Persona Tabs',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Persona-switched use-case section: a tab list of roles swaps the pain-point summary, a three-item outcome list, a supporting metric, and a role-specific CTA without leaving the page.',
  framework: 'vue',
  files: [{ path: 'UseCasesPersonaTabs.vue', target: 'components/blocks/UseCasesPersonaTabs.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
