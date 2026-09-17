<script setup lang="ts">
import FineTuningJobMonitor from '@/components/blocks/fine-tuning-job-monitor/FineTuningJobMonitor.vue'
</script>

<template>
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
      job-id="#ft-job-2026-0914"
      base-model="Qwen 2.5 Coder 32B Instruct"
      fine-tuned-model-name="qwen-2.5-coder-32b-vue-expert-v1"
      status="Training in Progress · Epoch 4 of 5 · 82% Complete"
      :current-epoch="4"
      :total-epochs="5"
      :progress-percent="82"
      :current-step="410"
      :total-steps="500"
      :training-loss="0.324"
      :initial-loss="1.95"
      :validation-loss="0.342"
      learning-rate="8.2e-6"
      gpu-cluster="4× NVIDIA H100 80GB SXM5"
      :gpu-utilization="98"
      vram-usage="74.2 GB / 80 GB"
      :tokens-per-sec="4120"
      elapsed-time="5h 32m 10s"
      eta-remaining="1h 12m"
      training-dataset="vue_sfc_agentic_instructions_v2.jsonl"
      :training-examples="58000"
      :validation-examples="5800"
      total-tokens="210.4M tokens"
      :batch-size="64"
      :micro-batch-size="8"
      :grad-accum-steps="4"
      :context-length="8192"
      :lora-rank="128"
      :lora-alpha="256"
    />
  </Story>
</template>
