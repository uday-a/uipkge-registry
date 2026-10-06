import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Pass items. Progress, next, skip, and submit come from those props.' },
  { title: 'Letter shortcuts', description: 'shortcuts=letters assigns A, B, C to choices.' },
  { title: 'Number shortcuts', description: 'shortcuts=numbers assigns 1–9.' },
  { title: 'Multiple', description: 'Set multiple on an item to collect checkboxes.' },
  {
    title: 'Freeform only',
    description: 'An item with input and no choices. Skip is available when required is false.',
  },
  { title: 'Required validation', description: 'Next on an empty required item shows requiredMessage.' },
  { title: 'Hide progress', description: 'showProgress=false removes the bar.' },
  { title: 'Disabled choice', description: 'A choice can set disabled: true in the items array.' },
  { title: 'Single question', description: 'One required item — Submit shows immediately.' },
  { title: 'Submit payload', description: 'Listen for submit to read the answers map.' },
]
