import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CareersJobBoard'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CareersJobBoard'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CareersJobBoard', Component)
