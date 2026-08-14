import Story from '../../components/story/Story'
import { SavedCardsList } from '@react-registry-blocks/saved-cards-list/SavedCardsList'
import * as React from 'react'

type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown'

interface SavedCard {
  id: string
  brand: CardBrand
  last4: string
  expiry: string
  holder: string
}

interface AddPayload {
  number: string
  brand: CardBrand
  expiry: string
  name: string
}

export default function SavedCardsListDemo() {
  const [cards, setCards] = React.useState<SavedCard[]>([
    { id: 'c1', brand: 'visa', last4: '4242', expiry: '12/29', holder: 'Jane Doe' },
    { id: 'c2', brand: 'mastercard', last4: '4444', expiry: '08/27', holder: 'Jane Doe' },
    { id: 'c3', brand: 'amex', last4: '0005', expiry: '03/30', holder: 'Jane Doe' },
  ])
  const [defaultId, setDefaultId] = React.useState('c1')
  const [emptyCards, setEmptyCards] = React.useState<SavedCard[]>([])

  function onRemove(id: string) {
    setCards((prev) => {
      const next = prev.filter((c) => c.id !== id)
      if (defaultId === id) setDefaultId(next[0]?.id ?? '')
      return next
    })
  }

  function onAdd(payload: AddPayload) {
    setCards((prev) => [
      ...prev,
      {
        id: 'c' + Date.now(),
        brand: payload.brand,
        last4: payload.number.slice(-4),
        expiry: payload.expiry,
        holder: payload.name,
      },
    ])
  }

  return (
    <>
      <Story
        title="Three cards, default set"
        description="Mixed brands. The default card has a badge; non-default rows expose a 'Set default' action."
      >
        <SavedCardsList
          cards={cards}
          defaultId={defaultId}
          onRemove={onRemove}
          onAdd={onAdd}
          onSetDefault={(id) => setDefaultId(id)}
        />
      </Story>

      <Story title="Empty state" description="No saved cards yet — prominent 'Add your first card' call to action.">
        <SavedCardsList
          cards={emptyCards}
          onAdd={(p) =>
            setEmptyCards((prev) => [
              ...prev,
              { id: '1', brand: p.brand, last4: p.number.slice(-4), expiry: p.expiry, holder: p.name },
            ])
          }
        />
      </Story>

      <Story
        title="Add flow"
        description="Click 'Add card' to expand an inline PaymentForm (wallets hidden). On submit it collapses and pushes a new row."
      >
        <SavedCardsList
          cards={cards}
          defaultId={defaultId}
          onAdd={onAdd}
          onRemove={onRemove}
          onSetDefault={(id) => setDefaultId(id)}
        />
      </Story>
    </>
  )
}
