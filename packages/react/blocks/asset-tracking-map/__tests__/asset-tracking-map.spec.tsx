import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../AssetTrackingMap'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['AssetTrackingMap'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AssetTrackingMap', Component)
