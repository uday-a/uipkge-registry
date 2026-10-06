import type { AngularStory } from './stories'

/** Story cards for the collapsible Angular demo (titles + descriptions mirror demos/react/collapsible.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Controlled',
    description: 'Two-way bound open state with the current value rendered alongside.',
  },
  {
    title: 'Uncontrolled',
    description: 'defaultOpen sets the initial state — the component manages it internally.',
  },
  {
    title: 'Button trigger',
    description: 'Using asChild lets the trigger forward props onto a custom Button.',
  },
  {
    title: 'Long content',
    description: 'Wraps a larger block of nested rows that toggle as one unit.',
  },
  {
    title: 'Animated chevron rotation',
    description:
      'The default slot exposes the open state, so the trigger icon can rotate as the content reveals. Pure CSS transition on a single class.',
  },
]
