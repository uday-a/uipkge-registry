import Story from '../../components/story/Story'
import { RecordDetailPage } from '@react-registry-blocks/record-detail-page/RecordDetailPage'

export default function RecordDetailPageDemo() {
  return (
    <Story
      title="Default"
      description="Record detail page with breadcrumb header, summary card, Details / Activity tabs, and a meta + recent-orders side panel."
    >
      <RecordDetailPage />
    </Story>
  )
}
