import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../Cta01'

const Component =
  (BlockModule as any).default || (BlockModule as any)['Cta01'] || (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('Cta01', Component)
