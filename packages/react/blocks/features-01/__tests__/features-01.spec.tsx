import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../Features01'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['Features01'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('Features01', Component)
