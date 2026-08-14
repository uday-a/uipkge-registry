import Story from '../../components/story/Story'
import {
  BankAccountConnector,
  type ConnectPayload,
} from '@react-registry-blocks/bank-account-connector/BankAccountConnector'
import * as React from 'react'

export default function BankAccountConnectorDemo() {
  const [lastConnected, setLastConnected] = React.useState<string | null>(null)

  function handleConnect(payload: ConnectPayload) {
    setLastConnected(`${payload.bankName} - ${payload.accountName} (•••• ${payload.last4}) - ${payload.balance}`)
  }

  return (
    <>
      <Story
        title="Interactive bank connector"
        description="Plaid and Tink style bank linking modal. Features institution search, 6 popular banks grid, account selector, and an encrypted security footer."
      >
        <div className="space-y-4">
          <BankAccountConnector onConnect={handleConnect} />
          {lastConnected && (
            <div className="bg-muted/40 text-muted-foreground mx-auto max-w-lg rounded-xl border p-3 text-center text-xs">
              <span className="text-foreground font-medium">Last Connected Account:</span> {lastConnected}
            </div>
          )}
        </div>
      </Story>

      <Story
        title="Pre-selected Chase checking and savings"
        description="Starts on the account selection step showing checking, savings, and credit cards with live balances and badges."
      >
        <BankAccountConnector initialBankId="chase" onConnect={handleConnect} />
      </Story>

      <Story
        title="Pre-selected Bank of America"
        description="Connected institution banner with quick 'Change' trigger, account radio options, and AES-256 security assurance."
      >
        <BankAccountConnector initialBankId="bofa" onConnect={handleConnect} />
      </Story>

      <Story
        title="Pre-selected Wells Fargo"
        description="Direct account selection view for Wells Fargo accounts with tabular numeral balances."
      >
        <BankAccountConnector initialBankId="wellsfargo" onConnect={handleConnect} />
      </Story>
    </>
  )
}
