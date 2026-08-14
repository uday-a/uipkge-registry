import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../LlmEvalBenchmarkMatrix'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['LlmEvalBenchmarkMatrix'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('LlmEvalBenchmarkMatrix', Component)
