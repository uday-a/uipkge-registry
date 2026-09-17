import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../SecurityDataFlow'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['SecurityDataFlow'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('SecurityDataFlow', Component)
