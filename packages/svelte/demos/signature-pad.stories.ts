import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Default pad',
    description: 'Standard signature capture with a built-in clear button and live point count.',
  },
  {
    title: 'Styled ink',
    description: 'Blue pen with a thicker stroke on a tinted background — common for legal documents.',
  },
  {
    title: 'Live config',
    description: 'Adjust pen color, thickness, and background at runtime to preview different styles.',
  },
  {
    title: 'Programmatic control',
    description: 'Use bind:this to clear and export without the built-in button. Shows isEmpty and point count.',
  },
  {
    title: 'States',
    description: 'Disabled blocks all interaction; readonly shows existing ink but prevents edits.',
  },
  {
    title: 'In context: Contract signing',
    description: 'A realistic agreement card with terms text, a signature pad, and a custom actions row for submit.',
  },
]
