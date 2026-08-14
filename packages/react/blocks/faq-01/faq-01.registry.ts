import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'faq-01',
  title: 'Accordion FAQ',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Interactive architecture knowledge base and FAQ section with real-time keyword search, category topic filtering, and helpfulness voting.',
  files: [{ path: 'Faq01.tsx', target: 'components/blocks/Faq01.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/accordion.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
