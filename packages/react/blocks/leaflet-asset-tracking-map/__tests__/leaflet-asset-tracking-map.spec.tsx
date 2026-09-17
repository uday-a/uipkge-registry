import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../LeafletAssetTrackingMap'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['LeafletAssetTrackingMap'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('LeafletAssetTrackingMap', Component)
