import Story from '../../components/story/Story'
import { StreamProcessingFlinkTopology } from '@react-registry-blocks/stream-processing-flink-topology/StreamProcessingFlinkTopology'

export default function StreamProcessingFlinkTopologyDemo() {
  return (
    <Story
      title="Default"
      description="Apache Flink & RisingWave stateful streaming graph: real-time DAG topology, window throughput, checkpointing duration, RocksDB state inspector, and backpressure heat monitor."
    >
      <StreamProcessingFlinkTopology />
    </Story>
  )
}
