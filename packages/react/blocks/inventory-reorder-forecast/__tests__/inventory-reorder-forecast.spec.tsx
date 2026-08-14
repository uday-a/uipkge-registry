import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../InventoryReorderForecast'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['InventoryReorderForecast'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('InventoryReorderForecast', Component)
