import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CaseStudyFilterableList'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CaseStudyFilterableList'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CaseStudyFilterableList', Component)
