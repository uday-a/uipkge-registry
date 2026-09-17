import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../AiSaasCommandCenter'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['AiSaasCommandCenter'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AiSaasCommandCenter', Component)
