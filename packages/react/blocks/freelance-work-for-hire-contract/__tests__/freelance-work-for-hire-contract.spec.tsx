import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FreelanceWorkForHireContract'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FreelanceWorkForHireContract'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FreelanceWorkForHireContract', Component)
