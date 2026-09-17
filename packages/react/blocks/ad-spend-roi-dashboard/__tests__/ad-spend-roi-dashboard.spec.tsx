import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../AdSpendRoiDashboard'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['AdSpendRoiDashboard'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AdSpendRoiDashboard', Component)
