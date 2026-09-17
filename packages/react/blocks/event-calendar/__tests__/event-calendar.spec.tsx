import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../EventCalendar'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['EventCalendar'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('EventCalendar', Component)
