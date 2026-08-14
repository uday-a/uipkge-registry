import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'prompt-ab-testing-comparator',
  type: 'registry:block',
  categories: ['ai', 'analytics', 'dashboard'],
  description:
    'Side-by-side prompt variation comparison shootout with automated LLM judge scoring, win rates, and token diffs. Features benchmark test payload, side-by-side arena with latency, cost, and judge critique, plus aggregate win-rate scorecard.',
  files: [{ path: 'PromptAbTestingComparator.tsx', target: 'components/blocks/PromptAbTestingComparator.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
