import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'footer-mega-newsletter',
  title: 'Footer — Mega with Newsletter',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Large footer pairing a newsletter signup and status line with five link columns, a social row, and a legal bar carrying the copyright and a compliance badge.',
  files: [{ path: 'FooterMegaNewsletter.tsx', target: 'components/blocks/FooterMegaNewsletter.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
