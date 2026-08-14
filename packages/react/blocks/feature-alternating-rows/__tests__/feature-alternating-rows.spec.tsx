import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FeatureAlternatingRows'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FeatureAlternatingRows'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FeatureAlternatingRows', Component)
