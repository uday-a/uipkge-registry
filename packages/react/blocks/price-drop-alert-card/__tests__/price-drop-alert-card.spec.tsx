import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PriceDropAlertCard'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PriceDropAlertCard'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PriceDropAlertCard', Component)
