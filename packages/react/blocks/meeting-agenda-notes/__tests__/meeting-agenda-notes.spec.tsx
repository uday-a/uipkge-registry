import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../MeetingAgendaNotes'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['MeetingAgendaNotes'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('MeetingAgendaNotes', Component)
