import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Default',
    description:
      'Drop in title, description, and labels — AlertModal renders an alertdialog (no soft-dismiss, semantic role).',
  },
  {
    title: 'Destructive tone',
    description: "tone='destructive' colors the action button red and pairs with the error icon.",
  },
  {
    title: 'Tone variants',
    description: 'Built-in icon shortcuts (info / success / warning / error) and matching tone tokens.',
  },
  {
    title: 'Async action with loading',
    description: 'loading shows a spinner on the action button and disables both buttons until the promise resolves.',
  },
  {
    title: 'Controlled (no trigger)',
    description: 'Drive open state from the outside with bind:open — no trigger needed.',
  },
]
