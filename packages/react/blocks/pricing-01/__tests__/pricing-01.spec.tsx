import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../Pricing01'

const Component =
  (BlockModule as any).default || (BlockModule as any)['Pricing01'] || (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('Pricing01', Component)
