import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Basic',
    description: 'Pick from the source, click the right arrow to move.',
  },
  {
    title: 'With search',
    description: 'Search input filters each side independently.',
  },
  {
    title: 'With pagination',
    description: 'pagination={true} uses page size 10. Pass {pageSize} to override.',
  },
  {
    title: 'One-way',
    description: 'oneWay hides the right-to-left button.',
  },
  {
    title: 'Drag and drop',
    description:
      'draggable enables HTML5 drag between lists and reordering inside the target. Drag a selected row to drag the whole selection.',
  },
  {
    title: 'selectable={false} (no checkboxes)',
    description:
      'Hides checkboxes; row click uses desktop pattern — plain=replace, cmd/ctrl+click=toggle, shift+click=range. Combine with draggable for pure drag UX.',
  },
  {
    title: 'Custom titles + footer',
    description: 'titles prop labels each side; footer snippets add per-side actions.',
  },
]
