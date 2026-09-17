import Story from '../../components/story/Story'
import { TrademarkPatentPortfolio } from '@react-registry-blocks/trademark-patent-portfolio/TrademarkPatentPortfolio'

export default function TrademarkPatentPortfolioDemo() {
  return (
    <Story
      title="Intellectual Property & Patent Portfolio"
      description="USPTO and WIPO portfolio management tracker with patent grant status, trademark registrations, jurisdiction badges, maintenance fee timeline, and docket actions."
    >
      <TrademarkPatentPortfolio />
    </Story>
  )
}
