import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../Hero01'

const Component =
  (BlockModule as any).default || (BlockModule as any)['Hero01'] || (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('Hero01', Component)
