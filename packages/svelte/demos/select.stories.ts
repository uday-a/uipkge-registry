import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Controlled single-select with a placeholder.' },
  { title: 'Grouped with labels', description: 'Groups separated by labels and a separator.' },
  { title: 'Disabled item', description: 'Individual options can be disabled.' },
  { title: 'Sizes and states', description: 'Small size, error state, and loading trigger.' },
  { title: 'Disabled trigger', description: 'The whole select can be disabled.' },
  { title: 'Native select', description: 'Zero-JS styled <select> for lightweight/mobile use.' },
]
