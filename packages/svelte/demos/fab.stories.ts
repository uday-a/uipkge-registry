import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'In a settings panel',
    description:
      "A primary action FAB anchored to the bottom-right of a card — the classic 'add new' affordance in a list view.",
  },
  {
    title: 'Variants & sizes',
    description: 'All four color variants and three circular sizes in one row, so the visual weight reads at a glance.',
  },
  {
    title: 'Extended FAB',
    description:
      'Pass label to render a pill-shaped extended FAB — used for the primary action on a screen when a label aids discoverability.',
  },
  {
    title: 'Positioning',
    description:
      'Five anchor positions rendered inside a positioned preview box. In a real page these are fixed to the viewport.',
  },
  {
    title: 'With badge',
    description: 'Layer a notification count over the FAB — common for a messaging compose button with unread drafts.',
  },
  {
    title: 'Disabled',
    description: 'Non-interactive FABs are dimmed and ignore clicks.',
  },
  {
    title: 'Fixed to viewport',
    description: 'A real fixed FAB pinned to the demo viewport bottom-right. Scroll the page — it stays put.',
  },
]
