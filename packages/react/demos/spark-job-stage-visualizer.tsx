import Story from '../../components/story/Story'
import { SparkJobStageVisualizer } from '@react-registry-blocks/spark-job-stage-visualizer/SparkJobStageVisualizer'

export default function SparkJobStageVisualizerDemo() {
  return (
    <Story
      title="Default"
      description="Databricks and Apache Spark distributed job execution DAG visualizer with stage performance metrics, task skew distribution quantiles, and executor JVM GC telemetry."
    >
      <SparkJobStageVisualizer />
    </Story>
  )
}
