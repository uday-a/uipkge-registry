import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ContactUs'

const Component =
  (BlockModule as any).default || (BlockModule as any)['ContactUs'] || (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ContactUs', Component)
