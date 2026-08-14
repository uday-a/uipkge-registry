import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'header-mega-menu',
  title: 'Header — Mega Menu',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Navbar whose product and resources items open a full-width mega panel of grouped, described links plus a highlighted feature card, keyboard navigable and closing on Escape.',
  framework: 'vue',
  files: [{ path: 'HeaderMegaMenu.vue', target: 'components/blocks/HeaderMegaMenu.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/navigation-menu.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/sheet.json',
  ],
})
