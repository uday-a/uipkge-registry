import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../LoyaltyRewardsTierHub'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['LoyaltyRewardsTierHub'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('LoyaltyRewardsTierHub', Component)
