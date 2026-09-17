import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'comparison-table',
  type: 'registry:block',
  categories: ['marketing', 'pricing'],
  description:
    'Plan comparison feature matrix (Starter / Pro / Enterprise) with a sticky header row, monthly/yearly ToggleGroup that flips prices live, grouped feature rows (Core / Collaboration / Support), and check / minus / short-value cells. The Pro column is highlighted with a "Popular" badge and a bg-primary/5 tint down the whole column.',
  files: [{ path: 'ComparisonTable.tsx', target: 'components/blocks/ComparisonTable.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/toggle-group.json',
  ],
})
