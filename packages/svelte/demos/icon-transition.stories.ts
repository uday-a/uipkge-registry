import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Default — copy command',
    description:
      'Standard copy button. Click runs the async action; on success the icon springs into the Check, then auto-reverts after 1.5s.',
  },
  {
    title: 'Externally controlled — like button',
    description:
      'Pass `active` to drive the icon swap from your own state, instead of using the built-in click handler. Useful when the parent already manages the toggle.',
  },
  {
    title: 'Stay active — bookmark with manual reset',
    description:
      'Pass `resetAfter={0}` to keep the active icon. Reset programmatically by calling the exposed `reset()` method via bind:this.',
  },
  {
    title: 'Different icons per role',
    description:
      'The active icon does not have to be a Check — any pair of icons works. Here are share/follow/star patterns built on the same primitive.',
  },
  {
    title: 'Inline inside a chip',
    description:
      'Use `as="span"` and `active` to make the icon a passive child of an outer button. The chip handles the click and tracks state — the icon just animates.',
  },
]
