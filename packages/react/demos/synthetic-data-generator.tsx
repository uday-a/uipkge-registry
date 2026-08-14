import Story from '../../components/story/Story'
import { SyntheticDataGenerator } from '@react-registry-blocks/synthetic-data-generator/SyntheticDataGenerator'

export default function SyntheticDataGeneratorDemo() {
  return (
    <>
      <Story
        title="Synthetic Dataset Generator & Privacy Engine"
        description="Gretel and Tonic-style LLM and mathematical synthetic dataset synthesizer with differential privacy epsilon controls, custom schema field generator, K-anonymity policy switches, live tabular CSV preview, and streaming JSON Lines export."
      >
        <SyntheticDataGenerator />
      </Story>

      <Story
        title="Healthcare Clinical Records (EHR) with Strict Privacy"
        description="HIPAA-compliant patient cohort synthesizer configured with strict differential privacy (ε = 0.5) and biomarker distribution curves."
      >
        <SyntheticDataGenerator initialTemplate="healthcare-ehr" initialRowCount={5000} initialEpsilon={0.5} />
      </Story>

      <Story
        title="Fintech Fraud Detection & Risk Scoring"
        description="High-volume synthetic credit card transactions for fraud ML classifiers with skewed anomaly distributions and tokenized PANs."
      >
        <SyntheticDataGenerator initialTemplate="fintech-fraud" initialRowCount={10000} initialEpsilon={2.0} />
      </Story>
    </>
  )
}
