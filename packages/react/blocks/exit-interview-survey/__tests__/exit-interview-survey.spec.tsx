import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ExitInterviewSurvey'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ExitInterviewSurvey'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ExitInterviewSurvey', Component)
