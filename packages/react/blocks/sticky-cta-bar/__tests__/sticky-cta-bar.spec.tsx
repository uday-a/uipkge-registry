import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../StickyCtaBar'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['StickyCtaBar'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('StickyCtaBar', Component)
