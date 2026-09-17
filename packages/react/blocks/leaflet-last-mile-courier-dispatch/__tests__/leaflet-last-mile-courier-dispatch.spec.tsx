import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../LeafletLastMileCourierDispatch'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['LeafletLastMileCourierDispatch'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('LeafletLastMileCourierDispatch', Component)
