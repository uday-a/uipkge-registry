import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../AssignmentSubmissionDropzone'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['AssignmentSubmissionDropzone'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AssignmentSubmissionDropzone', Component)
