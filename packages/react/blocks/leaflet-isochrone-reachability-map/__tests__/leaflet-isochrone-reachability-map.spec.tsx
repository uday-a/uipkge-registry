import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../LeafletIsochroneReachabilityMap'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['LeafletIsochroneReachabilityMap'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('LeafletIsochroneReachabilityMap', Component)
