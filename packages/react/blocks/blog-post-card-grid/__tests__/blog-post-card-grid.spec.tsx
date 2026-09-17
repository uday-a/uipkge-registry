import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../BlogPostCardGrid'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['BlogPostCardGrid'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('BlogPostCardGrid', Component)
