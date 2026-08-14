import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../IsochroneReachabilityMap'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['IsochroneReachabilityMap'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('IsochroneReachabilityMap', Component)
