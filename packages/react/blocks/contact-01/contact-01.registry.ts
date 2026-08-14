import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'contact-01',
  title: 'Sales Contact Form',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Interactive enterprise solutions architect dispatch workbench with track selection, live hub timezones, SLA badges, and ticket generator.',
  files: [{ path: 'Contact01.tsx', target: 'components/blocks/Contact01.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/label.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})
