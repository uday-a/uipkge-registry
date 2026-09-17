import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../Error404'

const Component =
  (BlockModule as any).default || (BlockModule as any)['Error404'] || (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('Error404', Component)
