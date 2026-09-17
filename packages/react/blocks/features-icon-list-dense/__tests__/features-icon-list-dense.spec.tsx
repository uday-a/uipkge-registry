import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FeaturesIconListDense'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FeaturesIconListDense'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FeaturesIconListDense', Component)
