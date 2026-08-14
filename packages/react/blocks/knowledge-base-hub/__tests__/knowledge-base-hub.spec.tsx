import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../KnowledgeBaseHub'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['KnowledgeBaseHub'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('KnowledgeBaseHub', Component)
