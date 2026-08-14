import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../OnboardingEquipmentProvisioning'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['OnboardingEquipmentProvisioning'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('OnboardingEquipmentProvisioning', Component)
