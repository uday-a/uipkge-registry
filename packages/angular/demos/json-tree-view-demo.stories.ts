import type { AngularStory } from './stories'

export const stories: AngularStory[] = [
  {
    title: 'API response inspector',
    description:
      "A typical paginated user fetch — the kind of payload you'd inspect in a network debugger or admin panel.",
  },
  {
    title: 'Error response',
    description: "Validation errors with a nested details array — root-labeled 'error' to mirror the response shape.",
  },
  {
    title: 'Webhook payload',
    description: 'A Stripe-style event payload with nested object and line-item arrays — common in integration logs.',
  },
  {
    title: 'In a debug card',
    description: 'The viewer inside a Card with a status badge — how it looks embedded in a real admin dashboard.',
  },
  {
    title: 'Searchable + copy on click',
    description: 'Type in the filter to dim non-matching nodes; click any value to copy it and fire a copy event.',
  },
  {
    title: 'Collapsed vs. expanded',
    description: 'expandDepth 0 shows only the root; expandDepth 2 reveals two levels. Use the toolbar to expand all.',
  },
  {
    title: 'Minimal toolbar',
    description: "Hide search controls or the whole toolbar for a cleaner embed where filtering isn't needed.",
  },
]
