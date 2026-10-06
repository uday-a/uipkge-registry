import type { AngularStory } from './stories'

/** Story cards for the tour Angular demo (titles mirror demos/react/tour.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Basic 4-step tour',
    description: 'Four stops anchored to four buttons. Press Esc or the close button to exit.',
  },
  {
    title: 'Cover image + primary type',
    description: "A step can include a cover image. type='primary' inverts the card style.",
  },
  { title: 'Centered (no target) step', description: 'A step with no target renders as a centered modal-style card.' },
  {
    title: 'Long onboarding tour (6 steps)',
    description:
      'Walk users through a larger surface. The progress indicator + Skip affordance keep cognitive load manageable past 4 stops.',
  },
  {
    title: 'Mask on / off per step',
    description:
      'Each step can opt in or out of the page dim. Use the dim when the target is what matters; drop it when the surrounding context tells the story.',
  },
]
