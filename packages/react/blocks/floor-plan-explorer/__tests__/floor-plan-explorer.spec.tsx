import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FloorPlanExplorer'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FloorPlanExplorer'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FloorPlanExplorer', Component)
