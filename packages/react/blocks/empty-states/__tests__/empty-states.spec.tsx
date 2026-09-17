import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../EmptyStates'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['EmptyStates'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('EmptyStates', Component)
