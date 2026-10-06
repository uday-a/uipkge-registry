import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Default',
    description: 'Two built-in variants: default and destructive.',
  },
  { title: 'Destructive', description: 'For errors and warnings about data loss.' },
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
      'Pair the alert with an {#if} and a close button to make it dismissible. The Alert primitive itself is stateless; the host owns the visibility.',
  },
]
