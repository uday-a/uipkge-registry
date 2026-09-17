import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../DeliveryTrackingMap'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['DeliveryTrackingMap'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('DeliveryTrackingMap', Component)
