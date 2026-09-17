import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'header-transparent-scroll',
  title: 'Header — Transparent Over Hero',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Marketing navbar that starts transparent over the hero and fades in a bordered, blurred surface once the page scrolls, with a nav row, theme-neutral CTA pair, and a mobile sheet.',
  files: [{ path: 'HeaderTransparentScroll.tsx', target: 'components/blocks/HeaderTransparentScroll.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/sheet.json',
  ],
})
