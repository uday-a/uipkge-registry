import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'tour',
  type: 'registry:ui',
  categories: ['overlay'],
  framework: 'svelte',
  description:
    'Multi-step guided overlay walkthrough. Highlights a target element with a dim mask cutout and shows a card next to it. Steps support targets by selector, ref, or function; centered (no-target) steps work as modal-style intros.',
  files: [
    { path: 'Tour.svelte', target: 'components/ui/tour/Tour.svelte' },
    { path: 'TourMask.svelte', target: 'components/ui/tour/TourMask.svelte' },
    { path: 'TourCard.svelte', target: 'components/ui/tour/TourCard.svelte' },
    { path: 'tour-target.svelte.ts', target: 'components/ui/tour/tour-target.svelte.ts' },
    { path: 'index.ts', target: 'components/ui/tour/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: ['https://uipkge.dev/r/button.json'],
})
