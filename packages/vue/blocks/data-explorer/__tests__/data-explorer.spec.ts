import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import DataExplorer from '../DataExplorer.vue'
import {
  aggregate,
  applyQuery,
  compareRows,
  computeWindow,
  createMockSource,
  fmtDelta,
  fmtRelative,
  layoutColumns,
  matchesFilter,
  parsePersisted,
  renderExport,
} from '../data-explorer-core'
import { PIPELINE_RUN_COLUMNS, createSampleRuns, type PipelineRun } from '../data-explorer-data'
import type { ExplorerColumn } from '../data-explorer-types'

const NOW = new Date('2026-09-09T12:00:00Z')
const columns = PIPELINE_RUN_COLUMNS
const col = (key: string) => columns.find((c) => c.key === key)!

describe('createSampleRuns', () => {
  it('is deterministic for a fixed clock, so both framework demos show the same rows', () => {
    const a = createSampleRuns(NOW)
    const b = createSampleRuns(NOW)
    expect(a).toHaveLength(64)
    expect(a.map((r) => r.id)).toEqual(b.map((r) => r.id))
    expect(createSampleRuns(NOW, 5000)).toHaveLength(5000)
  })

  it('lists runs newest first and keeps in-flight runs without a finish time', () => {
    const runs = createSampleRuns(NOW)
    for (let i = 1; i < runs.length; i++) {
      expect(new Date(runs[i - 1]!.startedAt).getTime()).toBeGreaterThan(new Date(runs[i]!.startedAt).getTime())
    }
    for (const r of runs.filter((r) => r.status === 'running' || r.status === 'queued')) {
      expect(r.finishedAt).toBeNull()
      expect(r.expectedFinishAt).not.toBeNull()
    }
  })
})

describe('matchesFilter', () => {
  const run = createSampleRuns(NOW)[0]!

  it('string `equals` matches either line of a two-line cell', () => {
    expect(matchesFilter(run, { column: 'id', operator: 'equals', value: run.id }, col('id'))).toBe(true)
    expect(matchesFilter(run, { column: 'id', operator: 'equals', value: run.pipeline }, col('id'))).toBe(true)
    expect(matchesFilter(run, { column: 'id', operator: 'equals', value: 'nope' }, col('id'))).toBe(false)
  })

  it('`equals` on a badge column matches the label people can see, not only the raw value', () => {
    const failed: PipelineRun = { ...run, status: 'failed' }
    expect(matchesFilter(failed, { column: 'status', operator: 'equals', value: 'Failed' }, col('status'))).toBe(true)
    expect(matchesFilter(failed, { column: 'status', operator: 'equals', value: 'failed' }, col('status'))).toBe(true)
  })

  it('`empty` is the only operator that matches a null value', () => {
    const running: PipelineRun = { ...run, status: 'running', durationMinutes: null }
    expect(matchesFilter(running, { column: 'delta', operator: 'empty', value: '' }, col('delta'))).toBe(true)
    expect(matchesFilter(running, { column: 'delta', operator: 'gt', value: '0' }, col('delta'))).toBe(false)
  })

  it('date operators compare against a YYYY-MM-DD boundary', () => {
    const r: PipelineRun = { ...run, startedAt: '2026-09-08T10:00:00Z' }
    expect(matchesFilter(r, { column: 'startedAt', operator: 'after', value: '2026-09-07' }, col('startedAt'))).toBe(
      true,
    )
    expect(matchesFilter(r, { column: 'startedAt', operator: 'before', value: '2026-09-07' }, col('startedAt'))).toBe(
      false,
    )
  })
})

describe('compareRows + applyQuery', () => {
  it('sinks empty values to the bottom in both directions', () => {
    const [a, b] = createSampleRuns(NOW)
    const withDelta: PipelineRun = { ...a!, status: 'succeeded', durationMinutes: 10, baselineMinutes: 5 }
    const noDelta: PipelineRun = { ...b!, status: 'running', durationMinutes: null }
    expect(compareRows(noDelta, withDelta, [{ key: 'delta', dir: 'asc' }], columns)).toBeGreaterThan(0)
    expect(compareRows(noDelta, withDelta, [{ key: 'delta', dir: 'desc' }], columns)).toBeGreaterThan(0)
  })

  it('multi-sort breaks ties with the next key', () => {
    const rows = createSampleRuns(NOW)
    const sorted = applyQuery(
      rows,
      {
        search: '',
        filters: [],
        sort: [
          { key: 'status', dir: 'asc' },
          { key: 'rowsWritten', dir: 'desc' },
        ],
        facet: null,
      },
      columns,
    ).rows
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1]!
      const cur = sorted[i]!
      if (prev.status === cur.status) expect(prev.rowsWritten).toBeGreaterThanOrEqual(cur.rowsWritten)
    }
  })

  it('counts facets before the facet filter so the other options stay comparable', () => {
    const rows = createSampleRuns(NOW)
    const { rows: onlyFailed, facets } = applyQuery(
      rows,
      { search: '', filters: [], sort: [], facet: { column: 'status', value: 'failed' } },
      columns,
      'status',
    )
    expect(onlyFailed.every((r) => r.status === 'failed')).toBe(true)
    expect(facets.reduce((s, f) => s + f.count, 0)).toBe(rows.length)
  })
})

describe('layoutColumns', () => {
  it('orders left-pinned, unpinned, right-pinned with sticky offsets', () => {
    const cols: ExplorerColumn[] = [
      { key: 'a', label: 'A', width: 100 },
      { key: 'b', label: 'B', width: 120, pin: 'right' },
      { key: 'c', label: 'C', width: 80, pin: 'left' },
      { key: 'd', label: 'D', width: 90, hidden: true },
    ]
    const layout = layoutColumns(cols, {
      order: ['a', 'b', 'c', 'd'],
      hidden: new Set(['d']),
      pins: {},
      widths: { a: 150 },
    })
    expect(layout.map((l) => l.column.key)).toEqual(['c', 'a', 'b'])
    expect(layout[0]).toMatchObject({ pin: 'left', offset: 0, edge: true, width: 80 })
    expect(layout[1]).toMatchObject({ pin: null, width: 150 })
    expect(layout[2]).toMatchObject({ pin: 'right', offset: 0, edge: true })
  })
})

describe('computeWindow', () => {
  it('mounts only the rows around the viewport plus overscan', () => {
    const w = computeWindow(5700, 570, 57, 5000, 6)
    expect(w.start).toBe(94)
    expect(w.end).toBeLessThan(140)
    expect(w.padTop).toBe(94 * 57)
    expect(w.padTop + (w.end - w.start) * 57 + w.padBottom).toBe(5000 * 57)
  })
})

describe('aggregate + formatting', () => {
  it('sums, averages and formats through the column type', () => {
    const rows = createSampleRuns(NOW).slice(0, 10)
    const sum = rows.reduce((s, r) => s + r.rowsWritten, 0)
    expect(aggregate(col('rowsWritten'), rows)).toBe(sum.toLocaleString())
    expect(aggregate({ key: 'x', label: 'x', aggregate: 'count' }, rows)).toBe('10')
    expect(aggregate(col('costUsd'), rows)).toMatch(/^\$/)
  })

  it('signs the drift so a glance tells over from under', () => {
    expect(fmtDelta(4.24)).toBe('+4.2')
    expect(fmtDelta(-1.1)).toBe('-1.1')
    expect(fmtDelta(null)).toBe('—')
    expect(fmtRelative(new Date(NOW.getTime() - 2 * 3_600_000), NOW)).toBe('2h ago')
  })
})

describe('renderExport', () => {
  it('quotes CSV cells that would otherwise break the row and skips the actions column', () => {
    const run = createSampleRuns(NOW)[0]!
    const cols: ExplorerColumn<PipelineRun>[] = [...columns, { key: '__actions', label: 'Actions', type: 'actions' }]
    const csv = renderExport([{ ...run, id: 'run,"daily"' }], cols, 'csv')
    expect(csv.split('\n')).toHaveLength(2)
    expect(csv).toContain('"run,""daily"""')
    expect(csv.split('\n')[0]).not.toContain('Actions')
  })
})

describe('parsePersisted', () => {
  it('drops unknown columns and malformed entries field by field', () => {
    const s = parsePersisted(
      JSON.stringify({
        sort: [
          { key: 'id', dir: 'asc' },
          { key: 'ghost', dir: 'asc' },
        ],
        hidden: ['tags', 'nope'],
        density: 'compact',
        pageSize: 9999,
        widths: { id: 300, tags: 5 },
      }),
      new Set(['id', 'tags']),
    )
    expect(s.sort).toEqual([{ key: 'id', dir: 'asc' }])
    expect(s.hidden).toEqual(['tags'])
    expect(s.density).toBe('compact')
    expect(s.pageSize).toBeUndefined()
    expect(s.widths).toEqual({ id: 300 })
    expect(parsePersisted('not json', new Set())).toEqual({})
  })
})

describe('createMockSource', () => {
  it('pages and hands back a cursor while more rows remain', async () => {
    const rows = createSampleRuns(NOW)
    const source = createMockSource(rows, columns, { latency: 0 })
    const first = await source({ search: '', filters: [], sort: [], facet: null, page: 0, pageSize: 25, cursor: null })
    expect(first.rows).toHaveLength(25)
    expect(first.total).toBe(64)
    expect(first.nextCursor).toBe('1')
    const last = await source({ search: '', filters: [], sort: [], facet: null, page: 0, pageSize: 25, cursor: '2' })
    expect(last.rows).toHaveLength(14)
    expect(last.nextCursor).toBeNull()
  })
})

describe('DataExplorer', () => {
  const visibleCount = columns.filter((c) => !c.hidden).length

  it('renders one header per visible column and pages the sample rows', () => {
    const w = mount(DataExplorer, { props: { pageSize: 10 }, attachTo: document.body })
    const heads = w.findAll('th')
    expect(heads).toHaveLength(visibleCount)
    expect(heads.map((h) => h.attributes('aria-sort'))).toContain('descending')
    expect(w.findAll('tbody tr[data-row]')).toHaveLength(10)
    expect(w.text()).toContain('Showing 1–10 of 64')
    w.unmount()
  })

  it('adds leading columns for selection + expansion and reports selected keys', async () => {
    const w = mount(DataExplorer, {
      props: { selectable: true, expandable: true, pageSize: 5 },
      attachTo: document.body,
    })
    expect(w.findAll('th')).toHaveLength(visibleCount + 2)
    const box = w.find('tbody tr[data-row] [role="checkbox"]')
    await box.trigger('click')
    expect(w.emitted('update:selected')?.[0]?.[0]).toHaveLength(1)
    expect(w.text()).toContain('1 selected')
    w.unmount()
  })

  it('swaps the body for the filter-aware empty state when nothing matches', () => {
    const w = mount(DataExplorer, { props: { initialSearch: 'nothing-matches-this' }, attachTo: document.body })
    expect(w.text()).toContain('No rows match these filters')
    expect(w.text()).toContain('Reset filters')
    w.unmount()
  })

  it('renders the error banner with a Retry that emits `retry`', async () => {
    const w = mount(DataExplorer, { props: { error: 'Warehouse returned 503' }, attachTo: document.body })
    expect(w.find('[role="alert"]').text()).toContain('Warehouse returned 503')
    await w.find('[role="alert"] button').trigger('click')
    expect(w.emitted('retry')).toHaveLength(1)
    w.unmount()
  })

  it('loads the first page from an async source and shows its total', async () => {
    const source = createMockSource(createSampleRuns(NOW), columns, { latency: 0 })
    const w = mount(DataExplorer, { props: { source, pageSize: 10 }, attachTo: document.body })
    expect(w.find('[role="status"]').text()).toContain('Loading')
    await new Promise((r) => setTimeout(r, 5))
    await flushPromises()
    expect(w.findAll('tbody tr[data-row]')).toHaveLength(10)
    expect(w.text()).toContain('of 64')
    w.unmount()
  })

  it('shift-click selects a range, ⌘A selects the page and Escape clears', async () => {
    const w = mount(DataExplorer, { props: { selectable: true, pageSize: 10 }, attachTo: document.body })
    const cells = () => w.findAll('tbody tr[data-row] td:first-child')
    const boxes = () => w.findAll('tbody tr[data-row] [role="checkbox"]')
    await boxes()[0]!.trigger('click')
    cells()[5]!.element.dispatchEvent(new MouseEvent('click', { bubbles: true, shiftKey: true }))
    await boxes()[5]!.trigger('click', { shiftKey: true })
    expect(w.findAll('tr[aria-selected="true"]')).toHaveLength(6)
    const row = w.find('tbody tr[data-row]')
    await row.trigger('keydown', { key: 'a', metaKey: true })
    expect(w.findAll('tr[aria-selected="true"]')).toHaveLength(10)
    await row.trigger('keydown', { key: 'Escape' })
    expect(w.findAll('tr[aria-selected="true"]')).toHaveLength(0)
    w.unmount()
  })

  it('nests child rows under their parent with childrenKey and indents them', async () => {
    const parent = {
      id: 'p',
      name: 'Parent',
      kids: [
        { id: 'c1', name: 'Child 1' },
        { id: 'c2', name: 'Child 2' },
      ],
    }
    const w = mount(DataExplorer, {
      props: { rows: [parent], columns: [{ key: 'name', label: 'Name' }], childrenKey: 'kids', pagination: 'none' },
      attachTo: document.body,
    })
    expect(w.findAll('tbody tr[data-row]')).toHaveLength(1)
    await w.find('tbody tr[data-row] button[aria-expanded]').trigger('click')
    expect(w.findAll('tbody tr[data-row]')).toHaveLength(3)
    expect(w.findAll('tbody tr[aria-level="2"]')).toHaveLength(2)
    w.unmount()
  })

  it('groups rows under a header per distinct value', () => {
    const w = mount(DataExplorer, { props: { groupBy: 'ownerName', pagination: 'none' }, attachTo: document.body })
    const owners = new Set(createSampleRuns().map((r) => r.ownerName))
    expect(w.findAll('tbody button[aria-expanded]')).toHaveLength(owners.size)
    w.unmount()
  })

  it('allows overriding UI strings via the labels prop', () => {
    const w = mount(DataExplorer, {
      props: {
        labels: {
          searchAria: 'Rechercher des lignes',
          resetFilters: 'Réinitialiser',
        },
        initialSearch: 'nothing-matches-this',
      },
      attachTo: document.body,
    })
    expect(w.find('input').attributes('aria-label')).toBe('Rechercher des lignes')
    expect(w.text()).toContain('Réinitialiser')
    w.unmount()
  })

  it('reorders columns via header drag and drop', async () => {
    const w = mount(DataExplorer, {
      props: {
        columns: [
          { key: 'colA', label: 'Column A' },
          { key: 'colB', label: 'Column B' },
          { key: 'colC', label: 'Column C' },
        ],
        rows: [{ id: '1', colA: 'A1', colB: 'B1', colC: 'C1' }],
        pagination: 'none',
      },
      attachTo: document.body,
    })
    const getHeaders = () => w.findAll('thead tr:last-child th[draggable="true"]').map((th) => th.text().trim())
    expect(getHeaders()).toEqual(['Column A', 'Column B', 'Column C'])

    const heads = w.findAll('thead tr:last-child th[draggable="true"]')
    await heads[0]!.trigger('dragstart')
    await heads[2]!.trigger('drop')
    expect(getHeaders()).toEqual(['Column B', 'Column C', 'Column A'])
    w.unmount()
  })
})
