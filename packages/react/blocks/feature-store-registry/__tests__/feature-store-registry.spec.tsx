import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FeatureStoreRegistry'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FeatureStoreRegistry'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FeatureStoreRegistry', Component)
