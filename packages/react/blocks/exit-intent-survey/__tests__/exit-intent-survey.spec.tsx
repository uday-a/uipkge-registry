import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ExitIntentSurvey'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ExitIntentSurvey'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ExitIntentSurvey', Component)
