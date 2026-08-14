import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ComingSoon'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ComingSoon'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ComingSoon', Component)
