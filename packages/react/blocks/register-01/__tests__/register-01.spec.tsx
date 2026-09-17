import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../Register01'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['Register01'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('Register01', Component)
