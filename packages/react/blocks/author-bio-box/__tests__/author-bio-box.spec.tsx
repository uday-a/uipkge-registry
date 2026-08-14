import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../AuthorBioBox'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['AuthorBioBox'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AuthorBioBox', Component)
