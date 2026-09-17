import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CodeInstallCommand'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CodeInstallCommand'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CodeInstallCommand', Component)
