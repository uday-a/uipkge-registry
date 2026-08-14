import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../EnterpriseWorkspaceSwitcher'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['EnterpriseWorkspaceSwitcher'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('EnterpriseWorkspaceSwitcher', Component)
