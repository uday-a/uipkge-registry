import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../WarehouseInventoryGrid'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['WarehouseInventoryGrid'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('WarehouseInventoryGrid', Component)
