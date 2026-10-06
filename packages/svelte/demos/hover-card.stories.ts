import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Hover the trigger to reveal a card with avatar and details.' },
  {
    title: 'Custom delays',
    description: 'openDelay / closeDelay (ms) tune how quickly the card appears and dismisses.',
  },
  {
    title: 'With image content',
    description: 'Card with an avatar image, header, body, and metadata footer.',
  },
  {
    title: 'Inline mentions in a paragraph',
    description: 'Multiple HoverCard triggers inline — the @-mention pattern from social tools.',
  },
  {
    title: 'Placement variants',
    description:
      'HoverCardContent takes side and align props — place the card top, right, bottom, or left of the trigger. Defaults to bottom.',
  },
]
