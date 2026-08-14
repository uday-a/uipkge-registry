import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../DataQualityMetrics'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['DataQualityMetrics'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('DataQualityMetrics', Component)
