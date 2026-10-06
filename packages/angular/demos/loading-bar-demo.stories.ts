import type { AngularStory } from './stories'

/** Story cards for the loading-bar Angular demo (titles mirror demos/react/loading-bar.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Page navigation',
    description:
      'The classic top-of-viewport bar that fills while a route or heavy page loads. Click to simulate a 1.8s navigation.',
  },
  {
    title: 'Form submission',
    description:
      'Block the submit button and run a green bar while the save request is in flight, then clear on success.',
  },
  {
    title: 'Manual control',
    description: 'Bind value when you know the exact progress — e.g. a file upload reporting bytes transferred.',
  },
  {
    title: 'Indeterminate fetching',
    description: "When you can't estimate the remaining work, indeterminate slides a segment across the viewport top.",
  },
  {
    title: 'Bottom-anchored bar',
    description:
      "position='bottom' pins the bar to the lower viewport edge — handy for background sync tasks that shouldn't distract from content.",
  },
  {
    title: 'Appearance options',
    description: 'Color, height, and error state — the building blocks for matching the bar to your theme.',
  },
]
