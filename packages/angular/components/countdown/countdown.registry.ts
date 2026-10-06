import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'countdown',
  type: 'registry:ui',
  categories: ['display', 'utility'],
  framework: 'angular',
  description:
    'Countdown timer showing time remaining to a target date. DD:HH:MM:SS, HH:MM:SS, MM:SS, and SS formats plus custom token formats, label, leading-zero padding, custom separator, paused state, finish / tick events, digit flip animation, and per-unit or whole-display template overrides.',
  files: [
    { path: 'countdown.component.ts', target: 'components/ui/countdown/countdown.component.ts' },
    { path: 'index.ts', target: 'components/ui/countdown/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
