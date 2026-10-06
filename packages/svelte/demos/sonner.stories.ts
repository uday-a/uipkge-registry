import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Variants',
    description: 'Toast styles for default, success, info, warning, error, and with-description.',
  },
  {
    title: 'With action button',
    description: 'Pass an action with label + onClick — shown as a trailing button inside the toast.',
  },
  {
    title: 'With dismiss button',
    description: 'Pass closeButton: true (or set globally on Toaster) to render an X dismiss control.',
  },
  {
    title: 'Long-running with manual dismiss',
    description: 'Set duration: Infinity to keep the toast open until the user dismisses it.',
  },
  {
    title: 'Promise toast',
    description: 'toast.promise binds a promise to loading / success / error states automatically.',
  },
]
