import Story from '../../components/story/Story'
import { CurrencyConverterWidget } from '@react-registry-blocks/currency-converter-widget/CurrencyConverterWidget'

export default function CurrencyConverterWidgetDemo() {
  return (
    <>
      <Story
        title="Currency Converter & International Transfer"
        description="Wise and Revolut-style real-time multi-currency exchange calculator and transfer fee estimator with live mid-market rates, transparent fee breakdown rail, bank savings comparison, and quick-rate ticker."
      >
        <CurrencyConverterWidget />
      </Story>

      <Story
        title="Transatlantic Corridor (GBP to EUR)"
        description="Pre-configured currency corridor for British Pound to Euro transfers with real-time fee breakdown and bank savings estimate."
      >
        <CurrencyConverterWidget initialSendAmount={2500} initialFromCurrency="GBP" initialToCurrency="EUR" />
      </Story>

      <Story
        title="Asia-Pacific Corridor (USD to JPY)"
        description="High-volume international transfer from US Dollar to Japanese Yen with zero-decimal formatting and Zengin settlement speed."
      >
        <CurrencyConverterWidget initialSendAmount={5000} initialFromCurrency="USD" initialToCurrency="JPY" />
      </Story>
    </>
  )
}
