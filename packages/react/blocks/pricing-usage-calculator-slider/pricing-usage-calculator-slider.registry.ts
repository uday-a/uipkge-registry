import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'pricing-usage-calculator-slider',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Interactive frontend infrastructure ROI calculator with real-time MAU, QPS, and edge replica sliders and annual cost savings scorecard.',
  files: [{ path: 'PricingUsageCalculatorSlider.tsx', target: 'components/blocks/PricingUsageCalculatorSlider.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})
