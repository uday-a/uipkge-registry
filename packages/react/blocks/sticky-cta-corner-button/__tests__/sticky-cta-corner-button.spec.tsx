import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../StickyCtaCornerButton'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['StickyCtaCornerButton'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('StickyCtaCornerButton', Component)
