import type { AngularStory } from './stories'

/** Story cards for the select Angular demo (titles + descriptions mirror demos/react/select.tsx). */
export const stories: AngularStory[] = [
  { title: 'Default', description: 'Single-select dropdown with a placeholder and basic options.' },
  { title: 'Grouped with labels', description: 'Multiple SelectGroups, each with a SelectLabel header.' },
  { title: 'Disabled item', description: 'Individual items can be disabled via the disabled prop.' },
  { title: 'With separator', description: 'Use SelectSeparator to visually split groups inside the popover.' },
  {
    title: 'Long list with scroll buttons',
    description: 'When content exceeds available height, scroll up/down buttons render automatically.',
  },
  { title: 'Disabled trigger', description: 'Pass disabled to the root to lock the entire control.' },
  {
    title: 'Multi-select',
    description:
      "Radix Select is single-value only. Use AdvanceSelect with mode='multiple' for the same string[] model Vue gets from Select multiple.",
  },
  {
    title: 'Native Select',
    description: 'Zero-JS lightweight HTML select styled with tokens and chevron for mobile & fast forms.',
  },
]
