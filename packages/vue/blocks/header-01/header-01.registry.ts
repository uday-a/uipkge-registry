import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'header-01',
  title: 'Sticky Top Navbar',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Sticky marketing top-bar. Brand mark on the left, five inline anchor links in the centre on desktop, "Sign in" + primary trial CTA on the right. Below the md breakpoint the right side collapses into a hamburger that opens a right-side Sheet with the same links and CTAs stacked. Translucent background uses backdrop-blur so content can scroll behind it.',
  framework: 'vue',
  files: [{ path: 'Header01.vue', target: 'components/blocks/Header01.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: ['https://uipkge.dev/r/button.json', 'https://uipkge.dev/r/sheet.json'],
})
