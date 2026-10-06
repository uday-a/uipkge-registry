import type { AngularStory } from './stories'

/** Story cards for the checkbox Angular demo (titles mirror demos/react/checkbox.tsx). */
export const stories: AngularStory[] = [
  { title: 'States', description: 'All four interaction states.' },
  { title: 'In a list', description: 'Common pattern for preference toggles.' },
  { title: 'Group with options', description: 'CheckboxGroup renders checkboxes from an options array.' },
  { title: 'Check all / Uncheck all', description: 'Master checkbox controls all items with indeterminate state.' },
  { title: 'Group disabled', description: 'Disabled group prevents interaction with all checkboxes.' },
  { title: 'Group inline layout', description: 'Horizontal arrangement with the inline prop.' },
  { title: 'Group with name', description: 'Name attribute for form submission.' },
]
