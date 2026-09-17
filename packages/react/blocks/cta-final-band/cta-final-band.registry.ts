import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'cta-final-band',
  title: 'CTA — Final Band',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Closing call to action centred on a bordered band, pairing the primary action with a secondary path and a line of proof for readers not ready to commit.',
  files: [{ path: 'CtaFinalBand.tsx', target: 'components/blocks/CtaFinalBand.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
