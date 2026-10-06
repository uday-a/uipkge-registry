import type { AngularStory } from './stories'

/** Story cards for the textarea Angular demo (titles mirror demos/react/textarea.tsx). */
export const stories: AngularStory[] = [
  { title: 'Default', description: 'Multi-line text input. Two-way bound with v-model.' },
  { title: 'Auto size', description: 'Automatically grows and shrinks with content.' },
  { title: 'Auto size with min & max rows', description: 'Limits the height to a range.' },
  { title: 'Show count', description: 'Displays character count below the textarea.' },
  { title: 'Show count with formatter', description: 'Custom count formatting using a function.' },
  { title: 'Allow clear', description: 'Click the X to clear the value.' },
  { title: 'Max length with show count', description: 'Native maxlength combined with visual counter.' },
  {
    title: 'Disabled & Readonly',
    description: 'Disabled prevents interaction; readonly shows value without editing.',
  },
  {
    title: 'Variants with new features',
    description: 'Outlined, filled, solo, underlined, and plain variants combined with allowClear and showCount.',
  },
]
