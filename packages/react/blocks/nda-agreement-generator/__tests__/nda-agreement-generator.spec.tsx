import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../NdaAgreementGenerator'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['NdaAgreementGenerator'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('NdaAgreementGenerator', Component)
