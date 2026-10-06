import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'typewriter',
  type: 'registry:ui',
  categories: ['display', 'motion'],
  framework: 'angular',
  description:
    'Types text character-by-character with a blinking caret, optionally cycling through multiple phrases. Configurable speeds, pause, start delay, looping, and caret visibility. SSR-safe.',
  files: [
    { path: 'typewriter.component.ts', target: 'components/ui/typewriter/typewriter.component.ts' },
    { path: 'index.ts', target: 'components/ui/typewriter/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
