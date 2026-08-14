import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ComparisonTable'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ComparisonTable'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ComparisonTable', Component)
