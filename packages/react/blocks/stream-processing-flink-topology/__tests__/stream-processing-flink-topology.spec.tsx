import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../StreamProcessingFlinkTopology'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['StreamProcessingFlinkTopology'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('StreamProcessingFlinkTopology', Component)
