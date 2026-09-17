import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../data-explorer-icons'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['AlertCircle'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AlertCircle', Component)
