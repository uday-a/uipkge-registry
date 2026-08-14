import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PomodoroFocusTimer'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PomodoroFocusTimer'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PomodoroFocusTimer', Component)
