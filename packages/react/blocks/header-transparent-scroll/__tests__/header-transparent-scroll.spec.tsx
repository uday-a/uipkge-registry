import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../HeaderTransparentScroll'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['HeaderTransparentScroll'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('HeaderTransparentScroll', Component)
