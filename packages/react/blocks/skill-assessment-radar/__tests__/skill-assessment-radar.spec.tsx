import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../SkillAssessmentRadar'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['SkillAssessmentRadar'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('SkillAssessmentRadar', Component)
