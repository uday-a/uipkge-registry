import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../AiCrmPipelineDashboard'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['AiCrmPipelineDashboard'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AiCrmPipelineDashboard', Component)
