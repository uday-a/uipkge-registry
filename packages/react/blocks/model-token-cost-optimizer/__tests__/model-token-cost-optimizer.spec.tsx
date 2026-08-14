import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ModelTokenCostOptimizer'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ModelTokenCostOptimizer'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ModelTokenCostOptimizer', Component)
