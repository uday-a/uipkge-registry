import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ComparisonVsAlternatives'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ComparisonVsAlternatives'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ComparisonVsAlternatives', Component)
