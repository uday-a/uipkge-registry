import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'search-results-page',
  type: 'registry:block',
  categories: ['layout', 'app'],
  description:
    'Full search results page: large pre-filled search input with result count, removable filter chips with clear-all, a left facet sidebar with Type and Team checkbox groups (hidden below lg), six result rows with icon tiles, titles, paths, snippets, and type/updated meta, plus a Previous/Next pagination footer. Chips and facets are interactive; swap the stub rows for your search source.',
  files: [{ path: 'SearchResultsPage.tsx', target: 'components/blocks/SearchResultsPage.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/chip.json',
    'https://uipkge.dev/r/input.json',
  ],
})
