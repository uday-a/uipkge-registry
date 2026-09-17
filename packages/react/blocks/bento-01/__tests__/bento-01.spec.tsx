import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../Bento01'

const Component =
  (BlockModule as any).default || (BlockModule as any)['Bento01'] || (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('Bento01', Component)
