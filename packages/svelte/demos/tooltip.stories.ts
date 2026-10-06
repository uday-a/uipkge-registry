import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Basic', description: 'Wrap any trigger; content renders on hover/focus with a 200ms delay.' },
  { title: 'Sides', description: "side='top' | 'right' | 'bottom' | 'left' positions the popover." },
  {
    title: 'Icon-only buttons',
    description: 'The canonical case — pair every icon-only control with a tooltip describing its action.',
  },
  { title: 'With shortcut hint', description: 'Combine label and a kbd-styled span for hotkeys.' },
  {
    title: 'Disabled trigger',
    description: 'The wrapper span fires focus events so tooltips work even on disabled controls.',
  },
  {
    title: 'Custom delay',
    description: 'delayDuration on TooltipProvider sets the hover lag per subtree.',
  },
]
