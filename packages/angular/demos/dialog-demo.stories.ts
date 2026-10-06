import type { AngularStory } from './stories'

/** Story cards for the dialog Angular demo (titles + descriptions mirror demos/react/dialog.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Form dialog',
    description: 'Most common pattern — inputs inside DialogContent with a save action in the footer.',
  },
  {
    title: 'Share link',
    description: 'Single-input dialog for sharing a URL. The trigger sits inline next to a label.',
  },
  {
    title: 'New project — multi-section form',
    description:
      'Bigger dialog with a header card, a body grid of fields, and a typed v-model:open binding for programmatic close.',
  },
  {
    title: 'Onboarding card',
    description: 'Hero-style dialog with an icon ring, single CTA, and footer-less layout for one-action prompts.',
  },
  {
    title: 'Pricing comparison',
    description: 'Wider dialog with a 3-up grid — works as a quick upgrade prompt without leaving the page.',
  },
  {
    title: 'Connect integrations',
    description:
      'List of external services as pickable rows. Closes-on-select pattern via DialogClose around each row.',
  },
  {
    title: 'Long content with scroll',
    description:
      'DialogContent grows with its content; combine with DialogScrollContent for very long bodies — the scroll lives inside the dialog, not the page.',
  },
]
