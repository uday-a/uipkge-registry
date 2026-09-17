import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FeatureBentoAiCopilot'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FeatureBentoAiCopilot'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FeatureBentoAiCopilot', Component)
