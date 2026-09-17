import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../Testimonials01'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['Testimonials01'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('Testimonials01', Component)
