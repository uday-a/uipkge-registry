import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CustomerReviews'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CustomerReviews'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CustomerReviews', Component)
