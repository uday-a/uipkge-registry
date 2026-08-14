import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'performance-review-matrix',
  type: 'registry:block',
  categories: ['hr', 'app'],
  description:
    '360-degree employee performance review scorecard and competency matrix: executive metrics, self vs manager rating comparison, detailed competency accordion with manager remarks, OKR progress table, and peer feedback quotes.',
  files: [{ path: 'PerformanceReviewMatrix.tsx', target: 'components/blocks/PerformanceReviewMatrix.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/accordion.json',
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
