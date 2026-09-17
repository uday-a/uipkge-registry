import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'media-asset-gallery',
  type: 'registry:block',
  categories: ['media', 'app', 'dashboard'],
  description:
    'Figma/Unsplash style Digital Asset Manager (DAM) with resolution tags, aspect ratio filters, tag chips, color palette inspector, multi-resolution download picker, and slide-over inspector drawer.',
  files: [{ path: 'MediaAssetGallery.tsx', target: 'components/blocks/MediaAssetGallery.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/sheet.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
