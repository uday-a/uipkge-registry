import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../Changelog'

const Component =
  (BlockModule as any).default || (BlockModule as any)['Changelog'] || (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('Changelog', Component)
