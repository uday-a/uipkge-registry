import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'synthetic-data-generator',
  type: 'registry:block',
  categories: ['ai', 'data', 'app', 'security'],
  description:
    'Gretel and Tonic-style LLM and mathematical synthetic dataset generator with differential privacy epsilon controls, custom schema field builders, K-anonymity policy toggles, live tabular CSV preview, and streaming JSON Lines export.',
  files: [{ path: 'SyntheticDataGenerator.tsx', target: 'components/blocks/SyntheticDataGenerator.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/slider.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
