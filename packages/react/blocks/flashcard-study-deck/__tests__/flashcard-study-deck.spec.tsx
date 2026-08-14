import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FlashcardStudyDeck'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FlashcardStudyDeck'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FlashcardStudyDeck', Component)
