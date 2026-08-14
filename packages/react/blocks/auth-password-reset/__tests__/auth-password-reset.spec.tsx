import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../AuthPasswordReset'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['AuthPasswordReset'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AuthPasswordReset', Component)
