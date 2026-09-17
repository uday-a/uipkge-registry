import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../RatingsReviewBadges'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['RatingsReviewBadges'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('RatingsReviewBadges', Component)
