import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../AnnouncementRotatingStrip'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['AnnouncementRotatingStrip'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AnnouncementRotatingStrip', Component)
