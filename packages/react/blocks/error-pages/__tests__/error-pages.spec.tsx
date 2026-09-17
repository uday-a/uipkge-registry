import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ErrorPages'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ErrorPages'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ErrorPages', Component)
