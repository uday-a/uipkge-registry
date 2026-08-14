import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../HabitStreakTracker'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['HabitStreakTracker'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('HabitStreakTracker', Component)
