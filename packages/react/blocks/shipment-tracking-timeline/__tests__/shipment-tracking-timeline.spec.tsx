import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ShipmentTrackingTimeline'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ShipmentTrackingTimeline'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ShipmentTrackingTimeline', Component)
