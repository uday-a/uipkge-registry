import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'footer-minimal-row',
  title: 'Footer — Minimal Row',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Single-row footer carrying the wordmark, a short inline link list, social icons, and the copyright line, for pages that should end quietly.',
  files: [{ path: 'FooterMinimalRow.tsx', target: 'components/blocks/FooterMinimalRow.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: ['https://uipkge.dev/r/button.json', 'https://uipkge.dev/r/separator.json'],
})
