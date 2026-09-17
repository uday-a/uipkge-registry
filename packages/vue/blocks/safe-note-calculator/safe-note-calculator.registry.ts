import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'safe-note-calculator',
  type: 'registry:block',
  categories: ['finance', 'legal', 'billing'],
  description:
    'Y Combinator Post-Money SAFE note valuation, conversion share price, effective discount, and cap table equity dilution simulator with interactive parameter controls and Series A financing sensitivity matrix.',
  framework: 'vue',
  files: [{ path: 'SafeNoteCalculator.vue', target: 'components/blocks/SafeNoteCalculator.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/slider.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
