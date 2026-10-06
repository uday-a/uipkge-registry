import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Sign-up with strength meter',
    description: 'Live strength bar turns from red to green as the password meets more criteria.',
  },
  {
    title: 'Size variants',
    description: 'Small for dense toolbars, default for forms, large for touch-first layouts.',
  },
  {
    title: 'Variant styles',
    description: 'Outlined (default), filled for subtle surfaces, and borderless for inline editing.',
  },
  {
    title: 'States',
    description: 'Read-only with a pre-filled API key, and a disabled input that blocks interaction.',
  },
  {
    title: 'Without toggle',
    description: 'Hide the eye button for fields where revealing is not allowed, e.g. compliance-controlled inputs.',
  },
  {
    title: 'In context: Login card',
    description: 'A realistic sign-in form with email and password fields inside a card.',
  },
]
