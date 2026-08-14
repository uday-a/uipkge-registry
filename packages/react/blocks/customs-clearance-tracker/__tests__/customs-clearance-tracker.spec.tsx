import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CustomsClearanceTracker'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CustomsClearanceTracker'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CustomsClearanceTracker', Component)
