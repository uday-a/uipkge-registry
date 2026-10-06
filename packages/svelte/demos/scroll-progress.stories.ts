import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Slim primary bar pinned to the top of its container.' },
  { title: 'Thick editorial', description: '6px bar for long-form reading surfaces.' },
  { title: 'Brand gradient', description: 'Any CSS color or gradient via the color prop.' },
  { title: 'Smooth off', description: '1:1 tracking without lerp smoothing.' },
  { title: 'Contained mode', description: 'Measure a supplied scrollable element instead of the window.' },
]
