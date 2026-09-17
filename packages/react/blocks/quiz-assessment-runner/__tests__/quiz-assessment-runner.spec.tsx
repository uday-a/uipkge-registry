import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../QuizAssessmentRunner'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['buttonVariants'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('buttonVariants', Component)
