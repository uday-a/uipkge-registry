import Story from '../../components/story/Story'
import { SchemaDriftAlertBoard } from '@react-registry-blocks/schema-drift-alert-board/SchemaDriftAlertBoard'

export default function SchemaDriftAlertBoardDemo() {
  return (
    <Story
      title="Default"
      description="Automated data warehouse schema drift and structural anomaly detector with downstream blast radius impact analysis, interactive multi-tier lineage graph, schema mutation contract diffs, and remediation workflows."
    >
      <SchemaDriftAlertBoard />
    </Story>
  )
}
