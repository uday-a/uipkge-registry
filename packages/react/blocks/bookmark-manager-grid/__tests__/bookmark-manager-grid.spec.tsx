import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../BookmarkManagerGrid'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['BookmarkManagerGrid'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('BookmarkManagerGrid', Component)
