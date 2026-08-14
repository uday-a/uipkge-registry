import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../GiftCardBalanceChecker'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['GiftCardBalanceChecker'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('GiftCardBalanceChecker', Component)
