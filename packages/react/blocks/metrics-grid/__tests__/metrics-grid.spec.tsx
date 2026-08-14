import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../MetricsGrid'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['MetricsGrid'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('MetricsGrid', Component)
