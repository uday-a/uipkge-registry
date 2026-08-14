import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../BankAccountConnector'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['BankAccountConnector'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('BankAccountConnector', Component)
