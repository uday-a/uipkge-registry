import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ApiKeys'

const Component =
  (BlockModule as any).default || (BlockModule as any)['ApiKeys'] || (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ApiKeys', Component)
