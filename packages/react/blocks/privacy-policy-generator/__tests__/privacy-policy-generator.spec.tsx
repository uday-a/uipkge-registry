import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PrivacyPolicyGenerator'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PrivacyPolicyGenerator'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PrivacyPolicyGenerator', Component)
