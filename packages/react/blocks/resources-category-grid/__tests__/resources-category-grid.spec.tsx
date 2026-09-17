import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ResourcesCategoryGrid'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ResourcesCategoryGrid'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ResourcesCategoryGrid', Component)
