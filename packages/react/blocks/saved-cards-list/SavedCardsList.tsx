'use client'

import * as React from 'react'
import { CheckCircle2, Plus, Trash2 } from 'lucide-react'
import { PaymentCard } from '@/components/ui/payment-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PaymentForm } from '@/components/blocks/PaymentForm'

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
  name: string
  expiry: string
  cvc: string
  brand: CardBrand
}

export interface SavedCardsListProps {
  cards: SavedCard[]
  defaultId?: string
  onAdd?: (payload: AddPayload) => void
  onRemove?: (id: string) => void
  onSetDefault?: (id: string) => void
}

function brandLabel(b: CardBrand) {
  return { visa: 'Visa', mastercard: 'Mastercard', amex: 'Amex', discover: 'Discover', unknown: 'Card' }[b]
}

function maskedNumberFromLast4(last4: string, brand: CardBrand): string {
  if (brand === 'amex') return `•••• •••••• •${last4}`
  return `•••• •••• •••• ${last4}`
}

export function SavedCardsList({ cards, defaultId, onAdd, onRemove, onSetDefault }: SavedCardsListProps) {
  const [showAdd, setShowAdd] = React.useState(false)
  const [removeTarget, setRemoveTarget] = React.useState<SavedCard | null>(null)

  const confirmOpen = !!removeTarget

  function confirmRemove() {
    if (!removeTarget) return
    onRemove?.(removeTarget.id)
    setRemoveTarget(null)
  }

  return (
    <div
      data-slot="saved-cards-list"
      className="bg-card text-card-foreground mx-auto w-full max-w-2xl rounded-xl border shadow-sm"
    >
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <h3 className="text-base font-semibold">Saved cards</h3>
          <p className="text-muted-foreground text-xs">Manage the cards used for billing.</p>
        </div>
        <Button size="sm" onClick={() => setShowAdd((v) => !v)}>
          <Plus className="size-4" /> Add card
        </Button>
      </div>

      {/* Add form (collapses inline) */}
      {showAdd ? (
        <div className="bg-muted/30 max-h-[1000px] overflow-hidden border-b p-4 opacity-100 transition-all duration-300 ease-out">
          <PaymentForm
            amount={0}
            showWallets={false}
            onSubmit={async (p) => {
              onAdd?.(p as AddPayload)
              setShowAdd(false)
            }}
          />
        </div>
      ) : null}

      {/* Empty state */}
      {cards.length === 0 && !showAdd ? (
        <div className="px-6 py-14 text-center">
          <div className="bg-muted text-muted-foreground mx-auto grid size-12 place-items-center rounded-full">
            <Plus className="size-5" />
          </div>
          <h4 className="mt-3 text-sm font-medium">No cards saved</h4>
          <p className="text-muted-foreground text-xs">Add a card to use it for future payments.</p>
          <Button size="sm" className="mt-4" onClick={() => setShowAdd(true)}>
            Add your first card
          </Button>
        </div>
      ) : (
        /* List */
        <ul className="divide-border divide-y">
          {cards.map((card) => (
            <li key={card.id} className="hover:bg-muted/30 flex items-center gap-4 px-5 py-4 transition-colors">
              <PaymentCard
                number={maskedNumberFromLast4(card.last4, card.brand)}
                name={card.holder}
                expiry={card.expiry}
                brand={card.brand}
                variant="compact"
                flip={false}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">
                    {brandLabel(card.brand)} ending {card.last4}
                  </p>
                  {card.id === defaultId ? (
                    <Badge variant="secondary">
                      <CheckCircle2 className="size-3" /> Default
                    </Badge>
                  ) : null}
                </div>
                <p className="text-muted-foreground text-xs">
                  Expires {card.expiry} · {card.holder}
                </p>
              </div>
              <div className="flex gap-1">
                {card.id !== defaultId ? (
                  <Button variant="ghost" size="sm" onClick={() => onSetDefault?.(card.id)}>
                    Set default
                  </Button>
                ) : null}
                <Button variant="ghost" size="icon-sm" aria-label="Remove card" onClick={() => setRemoveTarget(card)}>
                  <Trash2 className="text-muted-foreground size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Remove confirmation */}
      <Dialog open={confirmOpen} onOpenChange={(open) => !open && setRemoveTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove this card?</DialogTitle>
            <DialogDescription>
              {removeTarget && brandLabel(removeTarget.brand)} ending {removeTarget?.last4} will no longer be available
              for payments.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRemove}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
