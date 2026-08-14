import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../WaitlistReferralPosition'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['WaitlistReferralPosition'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('WaitlistReferralPosition', Component)
