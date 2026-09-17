import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../SettingsPage'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['SettingsPage'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('SettingsPage', Component)
