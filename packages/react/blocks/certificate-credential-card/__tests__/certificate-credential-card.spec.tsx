import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CertificateCredentialCard'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CertificateCredentialCard'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CertificateCredentialCard', Component)
