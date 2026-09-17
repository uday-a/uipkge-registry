import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CompensationBandBenchmarking'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CompensationBandBenchmarking'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CompensationBandBenchmarking', Component)
