import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Default — fully featured',
    description:
      'Industry-standard layout: search + faceted filter chips in the toolbar (not a side panel), row selection, sortable columns, View dropdown, pagination. Filter chips open popovers — same pattern as shadcn / Linear / Airtable.',
  },
  {
    title: 'Sortable columns',
    description:
      'Wrap each column header with DataTableColumnHeader. Click cycles asc → desc → none. Arrow icon reflects state.',
  },
  {
    title: 'Plain headers',
    description:
      'Use plain string headers when you do not need sort. Pagination still works.',
  },
  {
    title: 'No search',
    description:
      'Hide the global search input with `enable-search=false`. Filters + view + pagination still render.',
  },
  {
    title: 'No view dropdown',
    description:
      'Hide the column-visibility dropdown with `enable-column-visibility=false`.',
  },
  {
    title: 'No pagination',
    description:
      'Hide the pagination footer with `enable-pagination=false`. Useful when the dataset is small or scrolled inline.',
  },
  {
    title: 'Hide toolbar entirely',
    description:
      '`hide-toolbar` removes search + filters + view in one shot. Combine with `enable-pagination=false` for a pure read-only sortable table.',
  },
  {
    title: 'Sticky header',
    description:
      'Combine `sticky-header` + `max-height` to keep headers visible while the body scrolls.',
  },
  {
    title: 'Density: compact',
    description:
      'Tighter row padding for log-style or analytics views.',
  },
  {
    title: 'Density: comfortable',
    description:
      'Roomier padding when content is heavy or visual breathing room matters.',
  },
  {
    title: 'Row click navigation',
    description:
      '`onRowClick` fires with the original row record. Rows get cursor-pointer + hover bg automatically.',
  },
  {
    title: 'Bulk action bar',
    description:
      'When rows are selected, a #bulk-actions slot renders above the table. Use it for Delete N, Export N, etc.',
  },
  {
    title: 'Empty state',
    description:
      '`#empty` slot replaces the default \'No results\' message. Useful for first-run prompts or filter-mismatch hints.',
  },
  {
    title: 'Row expansion',
    description:
      '`#expanded` slot renders custom content under any expanded row. Columns use `row.toggleExpanded()` to drive state.',
  },
  {
    title: 'Column pinning',
    description:
      'Pin Name to the left, Status to the right. Pinned columns stay in place during horizontal scroll.',
  },
  {
    title: 'Column resizing',
    description:
      '`enable-resize` adds drag handles between columns. Drag right edges to widen / shrink.',
  },
  {
    title: 'Export CSV',
    description:
      '`enable-export` adds a Download button in the toolbar. Exports the currently filtered + visible columns.',
  },
  {
    title: 'Custom cells + headers',
    description:
      'Anything React can render works in `column.cell` / `column.header`. Avatar+name composite, progress bar with side label, custom header markup — all just functions returning nodes.',
  },
  {
    title: 'Custom filter UI',
    description:
      '`#custom-filters` slot drops your own controls into any filter mode (inline / popover / sheet). Bind to your own ref and call table.getColumn() to apply.',
  },
  {
    title: 'Drag-to-reorder columns',
    description:
      '`enable-reorder` makes column headers draggable. Pick up a header and drop on another to swap positions.',
  },
  {
    title: 'Virtual scrolling (large dataset)',
    description:
      '`virtual` enables CSS content-visibility on every row — browser skips layout/paint of off-screen rows. Pair with `max-height` for a scroll container.',
  },
  {
    title: 'Footer / totals row',
    description:
      '`#footer` slot renders below TableBody. Useful for sums and totals.',
  },
  {
    title: 'Inline filter mode (default)',
    description:
      'Faceted filter chips in the toolbar — the default and industry standard for most tables. Best when you have ≤4–5 filters.',
  },
  {
    title: 'Popover filter mode',
    description:
      'Filters open in a small popup attached to a toolbar button. Compact when you have many filters but want them quick to reach.',
  },
  {
    title: 'Modal filter mode (side panel)',
    description:
      'Opt-in: `filterMode=modal` opens filters in a right Sheet. Use when you have many filters or dense inputs (date ranges, long multiselects) that would crowd the toolbar.',
  },
  {
    title: 'Per-column header filter',
    description:
      'Each header carries a funnel icon next to the sort affordance. Click it to open a popover with the appropriate UI for the column type (text input on Name/Email, multiselect on Department/Status). The active filter shows a primary dot on the funnel; toolbar Clear-all still works.',
  },
  {
    title: 'Header filters + toolbar (both)',
    description:
      'Same column setup but with the toolbar still visible. Demonstrates that header-level filters and the toolbar filter chips (inline/popover/modal) can coexist — both pipe into the same TanStack column-filter state.',
  },
  {
    title: 'Loading',
    description:
      '`loading` renders a skeleton while the first page is empty, then dims the body on subsequent fetches. Pair with server-side `totalRows`.',
  },
  {
    title: 'Infinite scroll',
    description:
      '`infinite` hides pagination and calls `onFetchMore` when the sentinel row enters the viewport. Append rows on the consumer side.',
  },
  {
    title: 'Density toggle',
    description:
      '`enableDensityToggle` adds a Compact / Cozy / Comfortable control in the toolbar. The table density updates immediately.',
  },
  {
    title: 'Date range filter',
    description:
      '`type: \'date\'` on a filter definition opens a range calendar. ISO `YYYY-MM-DD` cell values compare lexicographically.',
  },
  {
    title: 'Grouped by department',
    description:
      '`defaultGrouping` clusters rows under a group header. Click a header to collapse or expand the group.',
  },
  {
    title: 'Keyboard navigation',
    description:
      'Focus the table, then J/K or arrows move the row, Space selects, Enter activates, Esc clears, ⌘A selects all, ⌘C copies TSV.',
  },
  {
    title: 'Borderless',
    description:
      '`borderless=\'full\'` drops the outer card chrome so the table sits flush on a parent surface.',
  },
  {
    title: 'Server-side pagination',
    description:
      'Pass `totalRows` from the API and listen to `onStateChange` to fetch the next page. The table does not filter or paginate locally.',
  },
  {
    title: 'Inline bulk dock',
    description:
      '`bulkActionPosition=\'inline\'` renders selected-row actions as a banner above the table instead of the floating HUD.',
  },
]
