import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'logo-cloud-grayscale',
  title: 'Logo Cloud — Grayscale Hover',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Customer logo wall rendered in muted monochrome that resolves to full contrast on hover, with a headline count and a segment line beneath.',
  files: [{ path: 'LogoCloudGrayscale.tsx', target: 'components/blocks/LogoCloudGrayscale.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
