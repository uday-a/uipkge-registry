import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../AuthSignUp'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['AuthSignUp'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AuthSignUp', Component)
