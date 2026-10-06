import type { AngularStory } from './stories'

/** Story cards for the tooltip Angular demo (titles + descriptions mirror demos/react/tooltip.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Basic',
    description: 'Wrap any trigger; TooltipContent renders on hover/focus with a 200ms delay.',
  },
  {
    title: 'Sides',
    description: "side='top' | 'right' | 'bottom' | 'left' positions the popover relative to the trigger.",
  },
  {
    title: 'Icon-only buttons',
    description: 'The canonical case — pair every icon-only control with a tooltip describing its action.',
  },
  {
    title: 'With shortcut hint',
    description: 'Combine label and a kbd-styled span for editor / power-user hotkeys.',
  },
  {
    title: 'Disabled trigger',
    description:
      'Reka UI dispatches focus events on a wrapper span so tooltips fire even when the underlying control is disabled — useful for explaining why an action is unavailable.',
  },
  {
    title: 'Custom delay',
    description:
      ':delay-duration on TooltipProvider sets the global hover lag — wrap a small subtree with its own provider to override.',
  },
]
