import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../KafkaStreamMonitor'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['KafkaStreamMonitor'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('KafkaStreamMonitor', Component)
