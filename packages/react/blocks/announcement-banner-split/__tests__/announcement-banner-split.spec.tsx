import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../AnnouncementBannerSplit'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['AnnouncementBannerSplit'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AnnouncementBannerSplit', Component)
