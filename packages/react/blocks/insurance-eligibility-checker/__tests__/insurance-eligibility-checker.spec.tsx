import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../InsuranceEligibilityChecker'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['InsuranceEligibilityChecker'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('InsuranceEligibilityChecker', Component)
