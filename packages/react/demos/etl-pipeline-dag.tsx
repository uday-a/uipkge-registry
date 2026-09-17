import Story from '../../components/story/Story'
import { EtlPipelineDag } from '@react-registry-blocks/etl-pipeline-dag/EtlPipelineDag'

export default function EtlPipelineDagDemo() {
  return (
    <Story
      title="Default"
      description="Airflow/Dagster style directed acyclic graph (DAG) pipeline visualizer with node run statuses, pipeline health metrics, and interactive stdout log inspector."
    >
      <EtlPipelineDag />
    </Story>
  )
}
