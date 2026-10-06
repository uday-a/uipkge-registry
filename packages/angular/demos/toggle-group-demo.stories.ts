import type { AngularStory } from './stories'

/** Story cards for the toggle-group Angular demo (titles + descriptions mirror demos/react/toggle-group.tsx). */
export const stories: AngularStory[] = [
  { title: 'Single select', description: 'Mutually exclusive icon toggles for text alignment.' },
  { title: 'Multiple select', description: "Type='multiple' allows several items to be active at once." },
  { title: 'Variants', description: 'Default and outline variants applied at the group level.' },
  { title: 'Sizes', description: 'Small, default, and large heights propagate to all items.' },
  {
    title: 'With spacing',
    description: 'Pass a numeric spacing prop to gap items apart instead of joining them.',
  },
  { title: 'Disabled', description: 'Disable the entire group or individual items.' },
  { title: 'Static (no indicator)', description: 'animated=false paints on-state chrome on the item itself.' },
]
