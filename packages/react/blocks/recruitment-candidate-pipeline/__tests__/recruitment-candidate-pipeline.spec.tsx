import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../RecruitmentCandidatePipeline'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['RecruitmentCandidatePipeline'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('RecruitmentCandidatePipeline', Component)
