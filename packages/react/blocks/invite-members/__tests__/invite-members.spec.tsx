import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../InviteMembers'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['InviteMembers'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('InviteMembers', Component)
