import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../SecurityTrustCenterGrid'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['SecurityTrustCenterGrid'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('SecurityTrustCenterGrid', Component)
