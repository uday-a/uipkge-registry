import Story from '../../components/story/Story'
import { SqlQueryNotebook } from '@react-registry-blocks/sql-query-notebook/SqlQueryNotebook'

export default function SqlQueryNotebookDemo() {
  return (
    <Story
      title="SQL Query Notebook"
      description="Hex, Deepnote, and Jupyter style SQL & Python analytical query notebook with documentation cells, executable Snowflake SQL editor with syntax coloring, live tabular results grid with data type badges, CSV export, and cohort chart visualization."
    >
      <SqlQueryNotebook />
    </Story>
  )
}
