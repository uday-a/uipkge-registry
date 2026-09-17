import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../SessionDeviceManager'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['SessionDeviceManager'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('SessionDeviceManager', Component)
