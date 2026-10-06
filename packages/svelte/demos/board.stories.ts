import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: '1 · Four-lane board',
    description:
      'The basic shape: Board wraps a grid of BoardLanes, each lane composes BoardLaneHeader / BoardLaneBody / BoardLaneEmpty. Drag a card between any two columns — the landed card gets a brief ring.',
  },
  {
    title: '2 · Single-lane sortable list',
    description:
      'One lane = a reorderable list. Same drop math, same insertion-index. The Board primitive collapses freely from N lanes to 1 by virtue of being layout-agnostic.',
  },
  {
    title: '3 · Two lanes (before / after, draft / live, …)',
    description: 'Same shape, two lanes. Useful for promote / publish flows, draft → live swaps, comparison boards.',
  },
  {
    title: '4 · Disabled lane',
    description:
      'Pass disabled on a BoardLane to reject all drops on it. The lane keeps its cards (and their drag) but the drop target goes inert and dims. Here "Done" is locked — try dragging anything onto it.',
  },
  {
    title: '5 · Disabled card',
    description:
      "Mark a card disabled to lock it in place — no drag, no click, dimmed + grayscaled. Useful for archived items, server-policy locked records, or a step you haven't unlocked yet.",
  },
  {
    title: '6 · Per-card allowedLanes allow-list',
    description:
      'Pass allowedLanes on any BoardCard to whitelist its destinations. Other lanes silently reject the drop (with `dropEffect = "none"`). Try the highlighted blue card — it only accepts "review" as a destination.',
  },
  {
    title: '7 · Global accepts predicate',
    description:
      'Pass an accepts function to the board state to encode rules across the whole board. Here we block any drop from "done" back to "todo" — try dragging "Q1 OKR alignment doc" from Done over Todo.',
  },
  {
    title: '8 · Multi-select drag',
    description:
      "Cmd/Ctrl/Shift+click cards to add them to a selection (you'll see a ring on each). Then grab any selected card — every selected card moves to the drop target together, preserving relative order. Plain click clears the selection (and calls onclick on your detail handler).",
  },
  {
    title: '9 · Programmatic move (no DnD)',
    description:
      "moveItem() is exposed for keyboard a11y, undo, or server-pushed updates. Here, a Triage button calls moveItem(id, 'triaged') with no drag at all — same animation, same onChange.",
  },
  {
    title: '10 · onChange audit log',
    description:
      'The board state fires onChange({ itemId, itemIds, from, to, index }) on every move — pointer drag, keyboard move, or programmatic moveItem. Wire this to your store, your analytics, your audit log.',
  },
  {
    title: '11 · Keyboard a11y',
    description:
      'Every BoardCard is reachable via Tab. Press Space to grab — the card gets a visible dragging state. While grabbed: ArrowLeft / ArrowRight switches lanes, ArrowUp / ArrowDown reorders within the lane. Press Space again (or Escape) to drop. Try it on any board above.',
  },
]
