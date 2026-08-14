import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../Login02'

const Component =
  (BlockModule as any).default || (BlockModule as any)['Login02'] || (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('Login02', Component)
