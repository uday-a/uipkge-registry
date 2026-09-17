import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FileManager'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FileManager'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FileManager', Component)
