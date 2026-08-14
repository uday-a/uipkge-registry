import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CourseCurriculumOutline'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CourseCurriculumOutline'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CourseCurriculumOutline', Component)
