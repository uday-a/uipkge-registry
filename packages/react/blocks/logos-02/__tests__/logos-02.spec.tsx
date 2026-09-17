import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../Logos02'

const Component =
  (BlockModule as any).default || (BlockModule as any)['Logos02'] || (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('Logos02', Component)
