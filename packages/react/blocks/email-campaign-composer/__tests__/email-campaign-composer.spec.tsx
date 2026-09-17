import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../EmailCampaignComposer'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['EmailCampaignComposer'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('EmailCampaignComposer', Component)
