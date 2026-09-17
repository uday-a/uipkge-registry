import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FeaturesChecklistSplit'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FeaturesChecklistSplit'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FeaturesChecklistSplit', Component)
