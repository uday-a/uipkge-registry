// Temporary SSR smoke render; deleted after the run.
import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { DataExplorer } from './DataExplorer'
import { createSampleRuns, type PipelineRun } from './data-explorer-data'

const cases: [string, Record<string, unknown>][] = [
  ['default', {}],
  ['selectable+expandable', { selectable: true, expandable: true }],
  ['virtual none 200', { virtual: true, pagination: 'none', rows: createSampleRuns(new Date(), 200) }],
  ['groupBy ownerName', { groupBy: 'ownerName' }],
  ['error x', { error: 'x' }],
  ['rows []', { rows: [] }],
  ['initialSearch zzz', { initialSearch: 'zzz' }],
  [
    'tree+groups',
    {
      childrenKey: 'tasks',
      pagination: 'none',
      rows: createSampleRuns(new Date(), 6).map((r) => ({
        ...r,
        tasks: [{ ...r, id: `${r.id}/x`, tasks: undefined }],
      })),
    },
  ],
  ['rowActions', { rowActions: () => [{ label: 'A', onSelect: () => {} }] }],
]
for (const [name, props] of cases) {
  const html = renderToString(React.createElement(DataExplorer<PipelineRun>, props as never))
  const rows = (html.match(/<tr[^>]*data-row=""/g) ?? []).length
  const ariaSort = (html.match(/aria-sort="/g) ?? []).length
  const alert = /role="alert"/.test(html)
  const emptyTitle = /Nothing here yet/.test(html)
  const noMatch = /No rows match these filters/.test(html)
  const groupHeaders = (html.match(/aria-expanded="(true|false)"[^>]*>[\s\S]*?<\/button><\/td>/g) ?? []).length
  console.log(
    `${name.padEnd(22)} rows=${String(rows).padStart(3)} aria-sort=${ariaSort} alert=${alert} empty=${emptyTitle} noMatch=${noMatch} bytes=${html.length}`,
  )
}
