import Story from '../../components/story/Story'
import { FineTuningJobMonitor } from '@react-registry-blocks/fine-tuning-job-monitor/FineTuningJobMonitor'

export default function FineTuningJobMonitorDemo() {
  return (
    <>
      <Story
        title="Llama 3.3 70B Instruct Tuning (In Progress)"
        description="LLM fine-tuning job telemetry dashboard featuring live dual-series loss convergence curves, GPU compute cluster metrics, hyperparameters manifest, and LoRA checkpoint weight exporter."
      >
        <FineTuningJobMonitor />
      </Story>

      <Story
        title="Qwen 2.5 Coder 32B Specialization"
        description="Code generation LLM fine-tuning job on a synthetic instruction dataset with 16k context window and DeepSpeed ZeRO-3."
      >
        <FineTuningJobMonitor
          jobId="#ft-job-2026-0914"
          baseModel="Qwen 2.5 Coder 32B Instruct"
          fineTunedModelName="qwen-2.5-coder-32b-vue-expert-v1"
          status="Training in Progress · Epoch 4 of 5 · 82% Complete"
          currentEpoch={4}
          totalEpochs={5}
          progressPercent={82}
          currentStep={410}
          totalSteps={500}
          trainingLoss={0.324}
          initialLoss={1.95}
          validationLoss={0.342}
          learningRate="8.2e-6"
          gpuCluster="4× NVIDIA H100 80GB SXM5"
          gpuUtilization={98}
          vramUsage="74.2 GB / 80 GB"
          tokensPerSec={4120}
          elapsedTime="5h 32m 10s"
          etaRemaining="1h 12m"
          trainingDataset="vue_sfc_agentic_instructions_v2.jsonl"
          trainingExamples={58000}
          validationExamples={5800}
          totalTokens="210.4M tokens"
          batchSize={64}
          microBatchSize={8}
          gradAccumSteps={4}
          contextLength={8192}
          loraRank={128}
          loraAlpha={256}
        />
      </Story>
    </>
  )
}
