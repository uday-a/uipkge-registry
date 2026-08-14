import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../Error500'

const Component =
  (BlockModule as any).default || (BlockModule as any)['Error500'] || (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('Error500', Component)
