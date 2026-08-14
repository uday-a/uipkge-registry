import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../LeafletDisasterResponseMap'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['LeafletDisasterResponseMap'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('LeafletDisasterResponseMap', Component)
