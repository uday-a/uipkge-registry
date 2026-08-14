import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../UseCasesRoleCards'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['UseCasesRoleCards'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('UseCasesRoleCards', Component)
