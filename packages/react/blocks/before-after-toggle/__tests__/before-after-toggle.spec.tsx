import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../BeforeAfterToggle'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['BeforeAfterToggle'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('BeforeAfterToggle', Component)
