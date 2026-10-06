import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Basic treemap',
    description: 'Flat array of `{ name, value }` — each tile sized by value, labelled with name + value.',
  },
  {
    title: 'Nested',
    description:
      'Pass a tree of `{ name, children }` to get sub-rectangles within each parent. Tooltips show the full breadcrumb path.',
  },
  {
    title: 'Color by value',
    description:
      "Override the per-tile colour to follow the value (warm-to-burnt). Useful when categories don't matter — magnitude does.",
  },
  {
    title: 'With breadcrumb',
    description:
      'Enable the navigation breadcrumb. Combined with `roam` / `nodeClick`, this turns the treemap into a drill-down explorer.',
  },
  {
    title: 'Compact',
    description:
      'Shorter height for in-card placement. Works because treemap reads by relative area — even at 200px, the dominant tile is unambiguous.',
  },
  {
    title: 'Lane tonnage',
    description: 'Air cargo weekly uplift — tile area is tonnage, PVG–LAX dominates.',
  },
]
