import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../AiAgentOrchestrator'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['AiAgentOrchestrator'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AiAgentOrchestrator', Component)
