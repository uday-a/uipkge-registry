import Story from '../../components/story/Story'
import { DataContractGovernance } from '@react-registry-blocks/data-contract-governance/DataContractGovernance'

export default function DataContractGovernanceDemo() {
  return (
    <>
      <Story
        title="Default"
        description="PayPal and OpenDataContract style Data Contracts specification editor, breaking change validator, and producer/consumer SLA agreements dashboard with YAML inspector, schema field explorer, live breaking change linter, and registered consumer status."
      >
        <DataContractGovernance />
      </Story>

      <Story
        title="Custom Domain Contract"
        description="Payments authorization stream data contract with custom producer service, Kafka destination topic, and Iceberg lakehouse target."
      >
        <DataContractGovernance
          contractTitle="payment_transactions_v2.contract.yaml"
          version="v2.4.1"
          ownerTeam="Payments Core Platform SRE"
          producerService="payments-gateway-prod"
          destinationTopic="events.payments.authorized"
          lakehouseTarget="s3://lakehouse-analytics/tables/payments/authorized_v2"
        />
      </Story>
    </>
  )
}
