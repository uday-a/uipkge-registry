import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../EmployeePulseSurveyResults'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['EmployeePulseSurveyResults'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('EmployeePulseSurveyResults', Component)
