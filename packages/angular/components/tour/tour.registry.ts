import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'tour',
  type: 'registry:ui',
  categories: ['overlay'],
  framework: 'angular',
  description:
    'Multi-step guided overlay walkthrough. Highlights a target element with a dim mask cutout and shows a card next to it. Targets by selector, element or getter; per-step mask and button labels; cover images; primary type; centered (no-target) steps; Escape / close button, focus trap and focus restore.',
  files: [
    { path: 'tour.component.ts', target: 'components/ui/tour/tour.component.ts' },
    { path: 'index.ts', target: 'components/ui/tour/index.ts' },
  ],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/button.json', 'https://uipkge.dev/r/popper.json'],
})
