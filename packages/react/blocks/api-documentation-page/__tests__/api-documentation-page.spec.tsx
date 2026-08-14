import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ApiDocumentationPage'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ApiDocumentationPage'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ApiDocumentationPage', Component)
