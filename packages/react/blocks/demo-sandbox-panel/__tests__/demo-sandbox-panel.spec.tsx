import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../DemoSandboxPanel'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['DemoSandboxPanel'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('DemoSandboxPanel', Component)
