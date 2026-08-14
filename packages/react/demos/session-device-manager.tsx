import Story from '../../components/story/Story'
import {
  SessionDeviceManager,
  type SessionDevice,
} from '@react-registry-blocks/session-device-manager/SessionDeviceManager'

const customMobileCliSessions: SessionDevice[] = [
  {
    id: 'demo-01',
    name: 'iPhone 16 Pro Max',
    deviceType: 'mobile',
    os: 'iOS 18.1',
    browser: 'Safari Mobile 18.1',
    location: 'Austin, TX, United States',
    countryFlag: '🇺🇸',
    ip: '108.215.88.42',
    signedInAt: 'Today at 07:15 AM',
    lastActive: '5m ago',
    isMfa: true,
  },
  {
    id: 'demo-02',
    name: 'Deploy Pipeline Token',
    deviceType: 'terminal',
    os: 'Linux x86_64',
    browser: 'GitHub Actions / CLI v2.8',
    location: 'AWS us-west-2 (Oregon), United States',
    countryFlag: '🇺🇸',
    ip: '35.160.77.19',
    signedInAt: 'Aug 15, 2026',
    lastActive: '18m ago',
    isMfa: true,
    customBadge: {
      label: 'CI/CD Token',
      variant: 'secondary',
    },
  },
  {
    id: 'demo-03',
    name: 'Backup Syncer',
    deviceType: 'terminal',
    os: 'Alpine Linux',
    browser: 'Go SDK v1.23',
    location: 'Frankfurt, Germany',
    countryFlag: '🇩🇪',
    ip: '3.120.44.11',
    signedInAt: 'Aug 01, 2026',
    lastActive: '1h ago',
    isMfa: true,
    customBadge: {
      label: 'Service Token',
      variant: 'secondary',
    },
  },
]

export default function SessionDeviceManagerDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Complete active sessions and device management interface with current session hero card, suspicious login alert banner, and 4 active sessions."
      >
        <SessionDeviceManager />
      </Story>

      <Story
        title="No Suspicious Alerts"
        description="Standard state with verified sessions and no active security warnings."
      >
        <SessionDeviceManager initialShowSuspiciousAlert={false} />
      </Story>

      <Story
        title="Single Active Session"
        description="State when all other devices and CLI tokens have been revoked, displaying a clean verified empty state."
      >
        <SessionDeviceManager initialOtherSessions={[]} initialShowSuspiciousAlert={false} />
      </Story>

      <Story
        title="Mobile & Automation Tokens"
        description="Custom session list containing mobile devices and cloud automation pipeline tokens."
      >
        <SessionDeviceManager initialOtherSessions={customMobileCliSessions} initialShowSuspiciousAlert={false} />
      </Story>
    </>
  )
}
