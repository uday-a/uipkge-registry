import Story from '../../components/story/Story'
import { OnboardingEquipmentProvisioning } from '@react-registry-blocks/onboarding-equipment-provisioning/OnboardingEquipmentProvisioning'

export default function OnboardingEquipmentProvisioningDemo() {
  return (
    <>
      <Story
        title='Default (MacBook Pro 16" M3 Max Spec)'
        description="Enterprise IT hardware, peripherals, and software license provisioning portal for new hires with standard macOS developer workstation, 5K display bundle, security keys, SaaS licenses, and FedEx delivery tracking."
      >
        <OnboardingEquipmentProvisioning />
      </Story>

      <Story
        title="ThinkPad Linux Workstation Preset"
        description="Pre-configured provisioning profile selecting the ThinkPad P1 Gen 6 Linux developer workstation with Intel i9 and Ubuntu 24.04 LTS."
      >
        <OnboardingEquipmentProvisioning initialWorkstation="thinkpad" />
      </Story>
    </>
  )
}
