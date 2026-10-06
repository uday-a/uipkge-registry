import type { AngularStory } from './stories'

/** Story cards for the kanban Angular demo (titles mirror demos/react/kanban.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description:
      'A composable Kanban primitive with drag-and-drop column routing and tactile card feedback. Cards are also keyboard-operable — see the next story.',
  },
  {
    title: 'Keyboard drag and drop',
    description:
      'Tab to a card, press Space to pick it up, then ← → to change column and ↑ ↓ to reorder. Space drops it, Escape cancels. Every step is announced through a polite live region.',
  },
  {
    title: 'Reorder within a column',
    description:
      '↑ and ↓ on a held card emit a move with `toIndex`, so a single handler covers both cross-column routing and in-column priority.',
  },
  {
    title: 'Locked card',
    description:
      '`disabled` takes a card out of the tab order, blocks the grab, and marks it aria-disabled — for cards a workflow rule owns.',
  },
  {
    title: 'Pointer-only cards',
    description:
      '`keyboardDraggable={false}` keeps mouse dragging and drops the keyboard affordance — for boards where a separate control already moves cards.',
  },
  {
    title: 'Empty column',
    description: '`KanbanColumnEmpty` fills a column that has no cards so the drop target still reads as a target.',
  },
  {
    title: 'WIP limit',
    description:
      'The count badge is a slot, not a fixed string — colour it against a limit to make an over-capacity column obvious.',
  },
  {
    title: 'Compact cards',
    description: 'Title-only cards for dense boards. The card is a container — everything inside it is yours.',
  },
  {
    title: 'Scrolling board',
    description:
      '`KanbanBoard` scrolls horizontally once the columns outrun the viewport; each column keeps its own vertical scroll.',
  },
  {
    title: 'Column accents',
    description:
      '`KanbanColumnDot` takes any background utility, so columns can carry the same status colours as the rest of the app.',
  },
]
