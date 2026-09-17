import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FormLayouts'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FormLayouts'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FormLayouts', Component)
