import Story from '../../components/story/Story'
import { DataTablePage } from '@react-registry-blocks/data-table-page/DataTablePage'

export default function DataTablePageDemo() {
  return (
    <Story
      title="Data table page"
      description="Admin members page: search and status filters that actually filter, selectable rows with bulk actions, per-row menus, and pagination."
    >
      <DataTablePage />
    </Story>
  )
}
