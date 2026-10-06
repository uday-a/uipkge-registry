import type { AngularStory } from './stories'

/** Story cards for the color-picker Angular demo (titles mirror demos/react/color-picker.tsx). */
export const stories: AngularStory[] = [
  { title: 'Default', description: 'Color picker bound to a hex string with the current value displayed below.' },
  { title: 'Side by side', description: 'Multiple independent pickers driving distinct theme tokens.' },
  { title: 'Disabled', description: 'Both the color trigger and the hex field become non-interactive.' },
  {
    title: 'Custom presets',
    description:
      'Pass a presets array to override the default swatch palette — pair with hide-hex-input for a swatch-only picker.',
  },
  { title: 'In a form', description: 'Wrapped in a labeled card with a helper sentence — the typical setting layout.' },
]
