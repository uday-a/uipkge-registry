import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../AccessRequestWorkflow'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['AccessRequestWorkflow'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AccessRequestWorkflow', Component)
