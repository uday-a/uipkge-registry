import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'pricing-01',
  title: 'Seat Pricing Matrix',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Comprehensive enterprise pricing workbench with monthly/annual billing cycle toggle, currency selector (USD/EUR/GBP), team seat simulator slider, dynamic add-on calculators, and an expandable side-by-side feature comparison matrix.',
  framework: 'react',
  files: [{ path: 'Pricing01.tsx', target: 'components/blocks/Pricing01.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/slider.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/toggle-group.json',
  ],
})
