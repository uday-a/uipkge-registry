import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../LeafletPropertyBoundaryMap'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['LeafletPropertyBoundaryMap'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('LeafletPropertyBoundaryMap', Component)
