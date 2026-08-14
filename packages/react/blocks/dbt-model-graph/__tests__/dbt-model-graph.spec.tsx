import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../DbtModelGraph'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['DbtModelGraph'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('DbtModelGraph', Component)
