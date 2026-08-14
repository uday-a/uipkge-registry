import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../GlobalEdgeNetwork'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['GlobalEdgeNetwork'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('GlobalEdgeNetwork', Component)
