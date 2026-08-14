import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../Logos03'

const Component =
  (BlockModule as any).default || (BlockModule as any)['Logos03'] || (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('Logos03', Component)
