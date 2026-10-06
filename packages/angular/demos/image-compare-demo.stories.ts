import type { AngularStory } from './stories'

/** Story cards for the image-compare Angular demo (titles mirror demos/react/image-compare.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Photo edit before / after',
    description:
      'Drag the slider to compare an original photo with its color-graded version — the classic retouching reveal.',
  },
  {
    title: 'UI redesign',
    description: 'Show stakeholders the old dashboard vs the new layout in one interactive frame.',
  },
  {
    title: 'Controlled slider',
    description: 'value binds the position (0–100). Pair with a range input for precise, keyboard-friendly control.',
  },
  {
    title: 'Orientation & labels',
    description: 'Vertical divider and hidden captions for minimalist layouts.',
  },
  {
    title: 'Custom handle',
    description: 'Replace the default arrow icon with a grip — or hide the handle entirely for a clean divider line.',
  },
  {
    title: 'Disabled & initial position',
    description: 'disabled locks the slider; set a defaultValue to start the comparison at a specific point.',
  },
  {
    title: 'In a product card',
    description:
      'Before/after comparison embedded in a card with context — the pattern for case studies and portfolios.',
  },
]
