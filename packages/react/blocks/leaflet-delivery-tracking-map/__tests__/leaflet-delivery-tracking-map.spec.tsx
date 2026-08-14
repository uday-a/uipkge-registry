import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../LeafletDeliveryTrackingMap'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['LeafletDeliveryTrackingMap'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('LeafletDeliveryTrackingMap', Component)
