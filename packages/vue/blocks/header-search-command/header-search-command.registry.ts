import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'header-search-command',
  title: 'Header — Inline Search',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Navbar with an inline search trigger that opens a command palette on click or ⌘K, listing grouped results with keyboard hints alongside the usual nav links and CTA.',
  framework: 'vue',
  files: [{ path: 'HeaderSearchCommand.vue', target: 'components/blocks/HeaderSearchCommand.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/command.json',
    'https://uipkge.dev/r/kbd.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/sheet.json',
  ],
})
