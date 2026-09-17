import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'case-study-metric-cards',
  title: 'Case Studies — Metric Cards',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Three-up customer results grid where each card leads with the headline metric, then the customer logo wordmark, a one-line outcome, the pull quote with attribution, and a link to the full story.',
  files: [{ path: 'CaseStudyMetricCards.tsx', target: 'components/blocks/CaseStudyMetricCards.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
