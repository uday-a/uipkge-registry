import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PromptAbTestingComparator'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PromptAbTestingComparator'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PromptAbTestingComparator', Component)
