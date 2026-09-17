import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../TrademarkPatentPortfolio'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['TrademarkPatentPortfolio'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('TrademarkPatentPortfolio', Component)
