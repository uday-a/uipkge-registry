import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../SecurityComplianceBadges'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['SecurityComplianceBadges'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('SecurityComplianceBadges', Component)
