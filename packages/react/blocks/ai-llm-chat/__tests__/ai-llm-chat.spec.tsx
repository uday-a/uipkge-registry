import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../AiLlmChat'

const Component =
  (BlockModule as any).default || (BlockModule as any)['AiLlmChat'] || (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AiLlmChat', Component)
