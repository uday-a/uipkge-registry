import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../InvoiceCreatorWizard'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['InvoiceCreatorWizard'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('InvoiceCreatorWizard', Component)
