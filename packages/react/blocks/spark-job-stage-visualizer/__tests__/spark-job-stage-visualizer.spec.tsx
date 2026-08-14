import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../SparkJobStageVisualizer'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['SparkJobStageVisualizer'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('SparkJobStageVisualizer', Component)
