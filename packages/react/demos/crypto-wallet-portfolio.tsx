import Story from '../../components/story/Story'
import { CryptoWalletPortfolio } from '@react-registry-blocks/crypto-wallet-portfolio/CryptoWalletPortfolio'

export default function CryptoWalletPortfolioDemo() {
  return (
    <Story
      title="Default"
      description="Coinbase and Phantom-style multi-asset crypto wallet and portfolio dashboard with treasury header, balance hero, asset allocation bar, holdings table, and quick swap widget."
    >
      <CryptoWalletPortfolio />
    </Story>
  )
}
