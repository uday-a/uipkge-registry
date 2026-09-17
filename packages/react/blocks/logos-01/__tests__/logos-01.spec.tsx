import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../Logos01'

const Component =
  (BlockModule as any).default || (BlockModule as any)['Logos01'] || (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('Logos01', Component)
