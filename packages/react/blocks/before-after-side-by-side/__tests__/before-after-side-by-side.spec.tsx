import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../BeforeAfterSideBySide'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['BeforeAfterSideBySide'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('BeforeAfterSideBySide', Component)
