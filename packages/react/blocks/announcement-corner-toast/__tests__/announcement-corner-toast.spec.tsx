import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../AnnouncementCornerToast'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['AnnouncementCornerToast'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AnnouncementCornerToast', Component)
