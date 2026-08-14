import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'case-study-results-strip',
  title: 'Case Studies — Results Strip',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Compact proof band pairing each customer wordmark with its single headline result, sized for the gap between a feature section and a pricing table.',
  files: [{ path: 'CaseStudyResultsStrip.tsx', target: 'components/blocks/CaseStudyResultsStrip.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
