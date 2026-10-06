import type { AngularStory } from './stories'

/** Story cards for the button Angular demo (titles + descriptions mirror demos/react/button.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Variants',
    description: 'Six visual styles. Default is the primary action; ghost and link blend into surrounding text.',
  },
  {
    title: 'Sizes',
    description: 'Four text sizes for inline buttons.',
  },
  {
    title: 'Icon-only',
    description: 'Square icon buttons in three sizes. Use aria-label for accessibility.',
  },
  {
    title: 'With icon',
    description: 'Place icons before or after the label. Auto-spaced.',
  },
  {
    title: 'States',
    description: 'Disabled keeps the variant style. Add a spinner for loading.',
  },
  {
    title: 'Button Group & Split Buttons',
    description: 'Segmented toolbars and split action buttons with shared borders.',
  },
]
