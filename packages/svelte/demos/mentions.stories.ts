import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Profile hover popup', description: 'MentionTag with a Twitter/X-style hover profile card.' },
  { title: 'Static options', description: 'Filter a fixed user list; onselect reports the pick.' },
  { title: 'Multi-trigger', description: '@ users, # topics, and $ tickers from one input.' },
  { title: 'Async options', description: 'Debounced loadOptions for server-side search.' },
  { title: 'Custom row content', description: 'Override each suggestion row via the option snippet.' },
]
