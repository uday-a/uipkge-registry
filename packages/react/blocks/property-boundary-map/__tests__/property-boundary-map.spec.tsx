import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PropertyBoundaryMap'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PropertyBoundaryMap'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PropertyBoundaryMap', Component)
