import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../SubscriptionChurnAnalytics'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['SubscriptionChurnAnalytics'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('SubscriptionChurnAnalytics', Component)
