import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Default',
    description: 'Three triggers in a segmented TabsList; each TabsContent shows when its value matches.',
  },
  {
    title: 'Overflow scroll',
    description:
      'When triggers exceed the list width it scrolls horizontally (scrollbar hidden). Centering degrades to start alignment and the sliding indicator tracks the active trigger.',
  },
  {
    title: 'Vertical orientation',
    description: "orientation='vertical' rotates the layout — TabsList becomes a left rail and content fills the rest.",
  },
  {
    title: 'Underline variant',
    description:
      "variant='underline' on TabsList renders a bottom-border bar with an underline indicator on the active trigger.",
  },
  {
    title: 'Pill variant',
    description: "variant='pill' gives a rounded-full pill style with no background track.",
  },
  {
    title: 'With disabled tab',
    description: 'A TabsTrigger with disabled is unclickable and renders at 50% opacity.',
  },
  {
    title: 'Many tabs (overflow)',
    description: 'Wrap TabsList in a horizontal-scroll container to handle long trigger lists gracefully.',
  },
  {
    title: 'Card-wrapped content',
    description: 'Each TabsContent renders a card so the panel reads as a self-contained surface.',
  },
]
