import type { AngularStory } from './stories'

/** Story cards for the label Angular demo (titles mirror demos/react/label.tsx). */
export const stories: AngularStory[] = [
  { title: 'With input', description: 'Label paired with an Input via matching for/id attributes.' },
  {
    title: 'Required and invalid',
    description: 'Destructive-colored label with required asterisk paired with an aria-invalid input.',
  },
  { title: 'Inline with checkbox', description: 'Muted label sitting next to a checkbox, linked via for/id.' },
]
