import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../Login01'

const Component =
  (BlockModule as any).default || (BlockModule as any)['Login01'] || (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('Login01', Component)
