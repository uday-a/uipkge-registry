import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FeatureFullBleedRows'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FeatureFullBleedRows'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FeatureFullBleedRows', Component)
