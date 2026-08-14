import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../NotificationCenter'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['NotificationCenter'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('NotificationCenter', Component)
