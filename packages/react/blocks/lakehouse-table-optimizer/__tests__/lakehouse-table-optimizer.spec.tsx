import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../LakehouseTableOptimizer'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['LakehouseTableOptimizer'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('LakehouseTableOptimizer', Component)
