import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Phone', description: 'US phone format: (###) ###-####' },
  { title: 'Date', description: 'Date format with a custom placeholder character.' },
  { title: 'Credit Card', description: 'Card format: #### #### #### ####' },
  { title: 'Completed event', description: 'oncomplete fires when every slot is filled.' },
  { title: 'Validation', description: 'validate returns true or an error message.' },
  { title: 'Disabled & readonly', description: 'Non-editable states keep the mask visible.' },
]
