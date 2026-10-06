import type { AngularStory } from './stories'

/** Story cards for the pin-input Angular demo (titles mirror demos/react/pin-input.tsx). */
export const stories: AngularStory[] = [
  { title: 'Default', description: 'Six-slot one-time code input bound to a string array model.' },
  { title: 'Masked (Password)', description: 'Hides entered characters like a password field.' },
  { title: 'Sizes', description: 'Small, medium (default), and large slot sizes.' },
  { title: 'Status', description: 'Error, warning, and success visual states.' },
  {
    title: 'Error shake',
    description: 'One-shot shake when status becomes error. Enter any code except 1234 to trigger.',
  },
  { title: 'With Separator', description: 'Visual grouping with separators.' },
  { title: 'Auto Submit', description: 'Emits complete event when all slots are filled.' },
  { title: 'Disabled', description: 'Non-interactive state.' },
]
