import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ResourcesFeaturedList'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ResourcesFeaturedList'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ResourcesFeaturedList', Component)
