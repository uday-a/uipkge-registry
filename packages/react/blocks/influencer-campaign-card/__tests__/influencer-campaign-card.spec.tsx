import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../InfluencerCampaignCard'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['InfluencerCampaignCard'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('InfluencerCampaignCard', Component)
