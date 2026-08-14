import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../AnnouncementCountdownBar'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['AnnouncementCountdownBar'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AnnouncementCountdownBar', Component)
