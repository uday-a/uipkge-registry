import type { AngularStory } from './stories'

/** Story cards for the mentions Angular demo (titles + descriptions mirror demos/react/mentions.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Twitter / X-Style Profile Hover Popup',
    description:
      'Hover over mention tokens to reveal an animated Twitter/X-style profile preview card with avatar, verified badge, bio, following stats, and tactile follow button.',
  },
  {
    title: 'Multi-Trigger Autocomplete (@, #, $)',
    description: 'Type @ for users, # for issue/project tags, or $ for stock/token tickers with custom prefix mapping.',
  },
  {
    title: 'Static Options with Mentions Input',
    description: 'Type @ to filter users with instant keyboard navigation.',
  },
  {
    title: 'Async Debounced Options',
    description: 'loadOptions returns a promise debounced 200ms.',
  },
  {
    title: 'Custom Row Content',
    description: 'Options with avatar + description render in clean two-line layout.',
  },
]
