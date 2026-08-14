import Story from '../../components/story/Story'
import { ColdChainTempMonitor } from '@react-registry-blocks/cold-chain-temp-monitor/ColdChainTempMonitor'

export default function ColdChainTempMonitorDemo() {
  return (
    <>
      <Story
        title="Ultra-Cold Vaccine Consignment"
        description="Refrigerated pharmaceutical IoT temperature logger and excursion monitoring dashboard with live thermal gradient curves, multi-probe telemetry logs, and critical excursion alert protocol."
      >
        <ColdChainTempMonitor />
      </Story>

      <Story
        title="Deep Cryogenic mRNA Consignment"
        description="Deep freeze clinical shipment with -70°C dry ice thermal hold and extreme ambient differential monitoring."
      >
        <ColdChainTempMonitor
          shipmentId="#CC-8810"
          shipmentTitle="mRNA Therapeutics Cryo-Consignment #CC-8810"
          tempClass="Deep Cryo-Freeze · Target: -70°C ± 5°C"
          beaconId="CryoTag #CT-9011 · BLE 5.3 + Iridium Sat"
          currentInternalTemp={-72.4}
          currentAmbientTemp={26.5}
          currentHumidity={12}
          batteryPercent={98}
          batteryDays={240}
        />
      </Story>
    </>
  )
}
