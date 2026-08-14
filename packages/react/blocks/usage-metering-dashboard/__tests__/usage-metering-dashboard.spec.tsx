import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../UsageMeteringDashboard'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['UsageMeteringDashboard'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('UsageMeteringDashboard', Component)
