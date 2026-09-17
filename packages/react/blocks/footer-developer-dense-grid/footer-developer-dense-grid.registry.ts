import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'footer-developer-dense-grid',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Dense developer footer with multi-column categorized links, live operational status beacon, and social triggers.',
  files: [{ path: 'FooterDeveloperDenseGrid.tsx', target: 'components/blocks/FooterDeveloperDenseGrid.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: ['https://uipkge.dev/r/badge.json', 'https://uipkge.dev/r/button.json'],
})
