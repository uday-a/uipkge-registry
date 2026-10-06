import type { AngularStory } from './stories'

/** Story cards for the knob Angular demo (titles mirror demos/react/knob.tsx). */
export const stories: AngularStory[] = [
  { title: 'Default', description: 'A 100px knob with 0-100 range and step 1. Drag, arrow keys, or wheel to change.' },
  { title: 'Custom range and step', description: '0-10 with step 1. Use any numeric domain.' },
  { title: 'Sized', description: 'Pass size in pixels. The dial is square; text scales with the SVG viewBox.' },
  { title: 'Custom colors', description: 'valueColor and rangeColor accept any CSS color or var.' },
  {
    title: 'Readonly and disabled',
    description: 'Readonly displays the value but blocks input. Disabled also greys out and removes focus.',
  },
  { title: 'Custom value template', description: 'Override the centered text via the value slot.' },
]
