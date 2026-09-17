import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../TeamSection'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['TeamSection'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('TeamSection', Component)
