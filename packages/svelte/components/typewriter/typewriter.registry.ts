import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'typewriter',
  type: 'registry:ui',
  categories: ['display', 'motion'],
  framework: 'svelte',
  description:
    'Types text character-by-character with a blinking caret, optionally cycling through multiple phrases (type -> pause -> delete -> next). Configurable typing/deleting speeds, completion pause, start delay, looping, and caret visibility. Renders empty on the server for hydration-safe SSR, restarts when `phrases` changes, and shows phrases in full under `prefers-reduced-motion`.',
  files: [
    { path: 'Typewriter.svelte', target: 'components/ui/typewriter/Typewriter.svelte' },
    { path: 'index.ts', target: 'components/ui/typewriter/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
