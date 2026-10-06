import type { AngularStory } from './stories'

/** Story cards for the alert Angular demo (titles + descriptions mirror demos/react/alert.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Two built-in variants: default and destructive.',
  },
  {
    title: 'Destructive',
    description: 'For errors and warnings about data loss.',
  },
  {
    title: 'Tinted icons',
    description: 'Color the icon for tonal variants — info, success, warning — without changing the alert background.',
  },
  {
    title: 'With action button',
    description:
      'Slot a primary action into the description for retryable / actionable alerts. Common for failed-payment or stale-data prompts.',
  },
  {
    title: 'Dismissible',
    description:
      'Pair the alert with conditional rendering and a close button to make it dismissible. The Alert primitive itself is stateless; the host owns the visibility.',
  },
]
