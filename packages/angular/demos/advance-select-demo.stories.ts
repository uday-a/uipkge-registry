import type { AngularStory } from './stories'

/** Story cards for the advance-select Angular demo (titles + descriptions mirror demos/react/advance-select.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Basic',
    description: 'Simple single select dropdown.',
  },
  {
    title: 'Searchable',
    description: 'Single select with built-in search filtering.',
  },
  {
    title: 'Multiple',
    description: 'Select multiple items with tag chips.',
  },
  {
    title: 'Tags',
    description: 'Create custom tags not in the predefined list.',
  },
  {
    title: 'Grouped',
    description: 'Options organized by country groups.',
  },
  {
    title: 'Disabled options',
    description: 'Some items are non-selectable.',
  },
  {
    title: 'Loading',
    description: 'Shows a spinner in the trigger while loading.',
  },
  {
    title: 'Size: small',
    description: 'Compact trigger for dense layouts.',
  },
  {
    title: 'Size: large',
    description: 'Taller trigger for touch-friendly interfaces.',
  },
  {
    title: 'Status: error',
    description: 'Red border for validation errors.',
  },
  {
    title: 'Status: warning',
    description: 'Amber border for warnings.',
  },
  {
    title: 'Clearable',
    description: 'Click the X to clear the selection.',
  },
  {
    title: 'Max count',
    description: 'Limit selection to 3 items.',
  },
  {
    title: 'Max tag count',
    description: 'Show only 2 tags, rest collapsed to +N.',
  },
  {
    title: 'Hide selected',
    description: 'Selected items are hidden from the dropdown list.',
  },
  {
    title: 'Custom option render',
    description: 'Render rich content in dropdown items with avatars.',
  },
  {
    title: 'Custom tag render',
    description: 'Custom badge styling for selected tags.',
  },
  {
    title: 'Virtual scroll',
    description: '10,000 items with CSS content-visibility optimization.',
  },
  {
    title: 'Variants',
    description: 'Outlined (default), filled, and borderless styles.',
  },
  {
    title: 'Token separators',
    description: "Type 'apple,banana' or press Enter to create multiple tags at once.",
  },
  {
    title: 'Not found',
    description: 'Custom empty state when search yields no results.',
  },
  {
    title: 'Auto clear search',
    description: 'Control whether search text clears after selection.',
  },
  {
    title: 'Custom field names',
    description: 'Map option object keys to label/value/group.',
  },
  {
    title: 'Remote search',
    description: 'Simulated async fetch with debounce and loading state.',
  },
  {
    title: 'Label in value',
    description: 'Value stores both id and label as an object.',
  },
  {
    title: 'Prefix & suffix icons',
    description: 'Custom icons inside the trigger.',
  },
  {
    title: 'Full featured',
    description: 'Multiple mode + search + max count + clearable + custom option render all together.',
  },
]
