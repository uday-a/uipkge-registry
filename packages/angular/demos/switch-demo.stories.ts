import type { AngularStory } from './stories'

/** Story cards for the switch Angular demo (titles mirror demos/react/switch.tsx). */
export const stories: AngularStory[] = [
  { title: 'Default', description: 'Two-way bound boolean. Click toggles the state.' },
  { title: 'States', description: 'On / off / disabled / disabled-on combinations.' },
  { title: 'With text', description: 'Checked and unchecked text labels inside the track.' },
  { title: 'With icons', description: 'Nodes for checked and unchecked children support icons.' },
  { title: 'Loading', description: 'Loading state shows a spinner and disables interaction.' },
  { title: 'Sizes', description: 'Three sizes with and without inner labels.' },
  { title: 'Colors', description: 'Custom track colors beyond the default primary.' },
]
