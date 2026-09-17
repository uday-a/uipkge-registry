import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../Contact01'

const Component =
  (BlockModule as any).default || (BlockModule as any)['Contact01'] || (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('Contact01', Component)
