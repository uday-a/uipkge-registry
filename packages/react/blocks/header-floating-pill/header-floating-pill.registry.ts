import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'header-floating-pill',
  title: 'Header — Floating Pill',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Detached pill navbar that floats above the page with a blurred surface, a sliding active indicator that tracks the current link, and a compact CTA on the right.',
  files: [{ path: 'HeaderFloatingPill.tsx', target: 'components/blocks/HeaderFloatingPill.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: ['https://uipkge.dev/r/button.json', 'https://uipkge.dev/r/sheet.json'],
})
