import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../TimeTrackerTimesheet'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['TimeTrackerTimesheet'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('TimeTrackerTimesheet', Component)
