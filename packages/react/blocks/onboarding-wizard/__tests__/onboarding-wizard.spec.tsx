import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../OnboardingWizard'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['OnboardingWizard'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('OnboardingWizard', Component)
