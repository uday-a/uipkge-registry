import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../LeaseAgreementSign'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['LeaseAgreementSign'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('LeaseAgreementSign', Component)
