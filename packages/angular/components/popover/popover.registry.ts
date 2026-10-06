import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'popover',
  type: 'registry:ui',
  categories: ['overlay'],
  framework: 'angular',
  description:
    'Click-triggered floating panel anchored to a trigger element. Radix Popover behaviour: body portal positioned with side / align / sideOffset (flip + shift), focus in and back to the trigger, Escape / outside dismiss. Supports optional persistence and configurable dismissal (click-outside, escape, manual), plus an optional anchor.',
  files: [
    { path: 'popover.component.ts', target: 'components/ui/popover/popover.component.ts' },
    { path: 'index.ts', target: 'components/ui/popover/index.ts' },
  ],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/popper.json'],
})
