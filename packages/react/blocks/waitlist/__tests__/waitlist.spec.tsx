import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../Waitlist'

const Component =
  (BlockModule as any).default || (BlockModule as any)['Waitlist'] || (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('Waitlist', Component)
