import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../SchemaDriftAlertBoard'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['SchemaDriftAlertBoard'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('SchemaDriftAlertBoard', Component)
