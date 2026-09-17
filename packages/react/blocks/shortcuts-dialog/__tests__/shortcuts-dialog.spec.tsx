import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ShortcutsDialog'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ShortcutsDialog'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ShortcutsDialog', Component)
