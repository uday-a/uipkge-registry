import type { AngularStory } from './stories'

/** Story cards for the signature-pad Angular demo (titles mirror demos/react/signature-pad.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default pad',
    description: 'Standard signature capture with a built-in clear button and live point count.',
  },
  {
    title: 'Styled ink',
    description: 'Blue pen with a thicker stroke on a tinted background — common for legal documents.',
  },
  {
    title: 'Live config',
    description: 'Adjust pen color, thickness, and background at runtime to preview different styles.',
  },
  {
    title: 'Programmatic control',
    description: 'Use a template ref to clear and export without the built-in button. Shows isEmpty and pointCount.',
  },
  {
    title: 'States',
    description: 'Disabled blocks all interaction; readonly shows existing ink but prevents edits.',
  },
  {
    title: 'In context: Contract signing',
    description: 'A realistic agreement card with terms text, a signature pad, and a custom actions slot for submit.',
  },
]
