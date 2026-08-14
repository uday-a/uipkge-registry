import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../StickyCtaReadingProgress'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['StickyCtaReadingProgress'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('StickyCtaReadingProgress', Component)
