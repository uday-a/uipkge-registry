import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Inline in body copy', description: 'Primary links with hover underline inside prose.' },
  { title: 'Color & underline', description: 'Three colors and three underline behaviors.' },
  { title: 'Sizes', description: 'Small, default, and large text sizes.' },
  { title: 'With icons', description: 'Leading and trailing icon snippets, auto-spaced.' },
  { title: 'External vs internal', description: 'http(s) links open in a new tab unless overridden.' },
  { title: 'Disabled', description: 'Dimmed, non-interactive, removed from tab order.' },
  { title: 'Child snippet', description: 'Spread link props onto your own anchor element.' },
]
