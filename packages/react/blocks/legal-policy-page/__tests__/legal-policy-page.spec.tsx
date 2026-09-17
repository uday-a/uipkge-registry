import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../LegalPolicyPage'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['LegalPolicyPage'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('LegalPolicyPage', Component)
