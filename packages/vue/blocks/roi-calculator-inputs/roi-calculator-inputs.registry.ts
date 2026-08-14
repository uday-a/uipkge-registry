import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'roi-calculator-inputs',
  title: 'ROI — Calculator',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Input-driven ROI estimate where team size, close days, and analyst rate drive a computed saving, with the assumptions stated beneath the figure.',
  framework: 'vue',
  files: [{ path: 'RoiCalculatorInputs.vue', target: 'components/blocks/RoiCalculatorInputs.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/slider.json',
  ],
})
