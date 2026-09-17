import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../BillOfLadingViewer'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['BillOfLadingViewer'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('BillOfLadingViewer', Component)
