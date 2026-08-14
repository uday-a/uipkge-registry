import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../DatabaseSchemaViewer'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['DatabaseSchemaViewer'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('DatabaseSchemaViewer', Component)
