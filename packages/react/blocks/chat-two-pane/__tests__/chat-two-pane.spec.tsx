import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ChatTwoPane'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ChatTwoPane'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ChatTwoPane', Component)
