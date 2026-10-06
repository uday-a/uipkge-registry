import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'range-slider',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'svelte',
  description:
    'Two-thumb range slider for "between X and Y" inputs — price filters, age ranges, time windows. Hand-rolled runes implementation with pointer dragging, keyboard handling, and aria-valuetext.',
  files: [
    { path: 'RangeSlider.svelte', target: 'components/ui/range-slider/RangeSlider.svelte' },
    { path: 'index.ts', target: 'components/ui/range-slider/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
