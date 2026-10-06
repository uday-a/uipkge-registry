import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Default',
    description: 'Single-open accordion with bottom-border separators between items.',
  },
  {
    title: 'Multiple',
    description: "type='multiple' lets several items stay expanded at the same time.",
  },
  {
    title: 'Separated variant',
    description: "variant='separated' renders each item as its own bordered card with a small gap between them.",
  },
  {
    title: 'Ghost variant',
    description:
      "variant='ghost' drops the borders entirely — pair with a parent surface that already provides framing.",
  },
  {
    title: 'Non-collapsible',
    description: "type='single' with collapsible=false ensures one item stays open at all times.",
  },
  {
    title: 'With AccordionHeader',
    description: 'Custom header layout pairing the trigger with extra metadata aligned outside the trigger.',
  },
  {
    title: 'Pre-opened',
    description: 'Use defaultValue to render an item expanded on first paint.',
  },
]
