import Story from '../../components/story/Story'
import { GuardrailsSafetyScanner } from '@react-registry-blocks/guardrails-safety-scanner/GuardrailsSafetyScanner'

export default function GuardrailsSafetyScannerDemo() {
  return (
    <Story
      title="Default"
      description="NVIDIA NeMo Guardrails and LlamaGuard style input/output safety scanner with real-time prompt injection detection, PII redactor, telemetry metrics, and configurable safety policy enforcement table."
    >
      <GuardrailsSafetyScanner />
    </Story>
  )
}
