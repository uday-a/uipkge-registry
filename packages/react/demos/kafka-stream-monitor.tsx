import Story from '../../components/story/Story'
import { KafkaStreamMonitor } from '@react-registry-blocks/kafka-stream-monitor/KafkaStreamMonitor'

export default function KafkaStreamMonitorDemo() {
  return (
    <Story
      title="Default"
      description="Apache Kafka & Redpanda topic stream telemetry dashboard with partition offset monitor, consumer group lag tracking, and real-time message payload inspector."
    >
      <KafkaStreamMonitor />
    </Story>
  )
}
