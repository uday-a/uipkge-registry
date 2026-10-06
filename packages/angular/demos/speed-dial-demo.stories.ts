import type { AngularStory } from './stories'

/** Story cards for the speed-dial Angular demo (titles mirror demos/react/speed-dial.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Compose menu (click)',
    description:
      "A document editor's primary action — click the FAB to fan out the 'create new' actions. The log records what fired.",
  },
  {
    title: 'Share menu (hover)',
    description:
      "trigger='hover' opens the dial on mouse enter — ideal for a share affordance that should feel weightless.",
  },
  {
    title: 'In a card',
    description:
      'A media capture card with the speed dial anchored to its bottom-right corner via absolute positioning.',
  },
  {
    title: 'Directions',
    description:
      'Expand up, down, left, or right from the trigger. Pick the direction that points into open space in your layout.',
  },
  {
    title: 'Variants & custom icon',
    description: 'The FAB variant controls the trigger color; pass an icon component to replace the default plus.',
  },
  {
    title: 'Disabled action & keep-open',
    description:
      "Left: 'Send now' is disabled so it can't fire. Right: closeOnAction={false} leaves the dial open after each pick.",
  },
  {
    title: 'Fixed to viewport',
    description: 'A real fixed speed dial pinned to the demo viewport bottom-right. Scroll — it stays pinned.',
  },
]
