import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../RagPipelineVisualizer'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['RagPipelineVisualizer'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('RagPipelineVisualizer', Component)
