import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'case-study-metric-comparison',
  title: 'Case Study — Metric Comparison',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Single customer result shown as a before-and-after table of four metrics, each row carrying the prior value, the current value, and the delta, under a short context line.',
  files: [{ path: 'CaseStudyMetricComparison.tsx', target: 'components/blocks/CaseStudyMetricComparison.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
