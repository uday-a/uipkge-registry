import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CostBreakdown'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CostBreakdown'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CostBreakdown', Component)
