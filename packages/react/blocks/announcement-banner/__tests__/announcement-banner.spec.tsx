import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../AnnouncementBanner'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['AnnouncementBanner'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AnnouncementBanner', Component)
