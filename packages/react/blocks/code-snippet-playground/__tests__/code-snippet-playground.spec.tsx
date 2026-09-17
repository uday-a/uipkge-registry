import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CodeSnippetPlayground'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['buttonVariants'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('buttonVariants', Component)
