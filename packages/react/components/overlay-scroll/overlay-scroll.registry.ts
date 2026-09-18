import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'overlay-scroll',
  type: 'registry:ui',
  categories: ['layout'],
  description:
    'Slack-style overlay scrollbar. Hides the native scrollbar so the scrolled content uses the full container width (no gutter reservation), then draws a thin auto-fading thumb absolutely positioned on top. Drag-to-scroll via Pointer Events covers mouse, touch, and pen. Vertical only. The component does not enforce a height — give it a bounded height via the parent (`flex-1 min-h-0` in a flex column, or a fixed `h-*` / `max-h-*`).',
  files: [
    { path: 'overlay-scroll.tsx', target: 'components/ui/overlay-scroll/overlay-scroll.tsx' },
    { path: 'index.ts', target: 'components/ui/overlay-scroll/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
