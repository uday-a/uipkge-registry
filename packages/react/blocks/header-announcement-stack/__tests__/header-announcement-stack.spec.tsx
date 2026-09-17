import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../HeaderAnnouncementStack'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['HeaderAnnouncementStack'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('HeaderAnnouncementStack', Component)
