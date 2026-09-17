import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CustomerMetricsBand'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CustomerMetricsBand'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CustomerMetricsBand', Component)
