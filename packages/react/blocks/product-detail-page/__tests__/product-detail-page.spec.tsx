import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ProductDetailPage'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ProductDetailPage'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ProductDetailPage', Component)
