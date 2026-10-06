import type { AngularStory } from './stories'

/** Story cards for the masked-input Angular demo (titles mirror demos/react/masked-input.tsx). */
export const stories: AngularStory[] = [
  { title: 'Phone', description: 'US phone format: (###) ###-####' },
  { title: 'Date', description: 'Date format: ##/##/####' },
  { title: 'SSN', description: 'Social Security format: ###-##-####' },
  { title: 'Credit Card', description: 'Card format: #### #### #### ####' },
  { title: 'Custom Pattern', description: 'License plate format: AAA-####' },
  { title: 'Without Mask Display', description: 'Only shows typed characters, no placeholder underscores.' },
  { title: 'Completed Event', description: "Emits 'complete' when the mask is fully filled." },
  {
    title: 'Native Placeholder',
    description: 'Shows standard placeholder when empty and unfocused, then guides with mask on focus.',
  },
  {
    title: 'Validation & Error State',
    description: 'Shows validation error message and invalid styling when input is incomplete or fails a rule.',
  },
  {
    title: 'Strict Character Blocking',
    description: 'Letters are rejected in numeric slots (#) and numbers are rejected in letter slots (A).',
  },
  { title: 'Disabled & Readonly', description: 'Non-interactive states.' },
]
