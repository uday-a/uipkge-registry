import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'loan-calculator',
  type: 'registry:block',
  categories: ['finance', 'billing'],
  description:
    'Interactive mortgage and commercial loan amortization schedule calculator with dynamic sliders, loan type presets, extra payment impact simulation, principal vs interest visual ratio bar, and year-by-year amortization breakdown table.',
  files: [{ path: 'LoanCalculator.tsx', target: 'components/blocks/LoanCalculator.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/slider.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
