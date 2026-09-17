import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../StorePickupCurbside'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['StorePickupCurbside'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('StorePickupCurbside', Component)
