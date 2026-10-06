import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Variants',
    description:
      'Seven visual styles. default / filled / outlined / elevated for visual weight; success / warning / destructive for tone.',
  },
  {
    title: 'Sizes',
    description: 'Three sizes — sm, default, lg — pair naturally with surrounding text scale.',
  },
  {
    title: 'With leading icon',
    description: 'Slot any icon before the label — common for hashtag and category chips.',
  },
  {
    title: 'Closable',
    description:
      'closable renders a built-in dismiss button and fires onclose. Listen for onclose to remove the chip from your list.',
  },
  {
    title: 'ChipGroup with reactive removal',
    description: 'Combine ChipGroup with each-blocks and closable chips — handle onclose to update the list.',
  },
  {
    title: 'Status filters',
    description: 'Tone variants are useful for filter-bar status chips that double as legend items.',
  },
]
