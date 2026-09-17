import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CaseStudyMetricComparison'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CaseStudyMetricComparison'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CaseStudyMetricComparison', Component)
