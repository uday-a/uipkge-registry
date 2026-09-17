import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'lead-capture-popup',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'High-conversion exit-intent discount popup and newsletter lead generator with live ticking countdown timer, emerald value props, star rating social proof, and coupon code reveal.',
  files: [{ path: 'LeadCapturePopup.tsx', target: 'components/blocks/LeadCapturePopup.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/badge.json',
  ],
})
