import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../Faq01'

const Component =
  (BlockModule as any).default || (BlockModule as any)['Faq01'] || (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('Faq01', Component)
