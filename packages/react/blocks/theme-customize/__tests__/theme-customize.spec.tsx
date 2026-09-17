import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ThemeCustomize'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ThemeCustomize'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ThemeCustomize', Component)
