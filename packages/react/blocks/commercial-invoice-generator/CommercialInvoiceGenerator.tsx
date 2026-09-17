'use client'

import * as React from 'react'
import { Download, Plus, Printer, ShieldCheck, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface InvoiceItem {
  id: string
  description: string
  htsCode: string
  countryOfOrigin: string
  qty: number
  unitPrice: number
  weightKg: number
}

export interface CommercialInvoiceProps {
  invoiceNumber?: string
  incoterms?: string
  currency?: string
  className?: string
}

export function CommercialInvoiceGenerator({
  invoiceNumber = 'INV-EXP-2026-9042',
  incoterms = 'DAP (Delivered at Place)',
  currency = 'USD',
  className,
}: CommercialInvoiceProps) {
  const [isSigned, setIsSigned] = React.useState(false)
  const [freightCharges, setFreightCharges] = React.useState(450.0)
  const [insuranceCharges, setInsuranceCharges] = React.useState(85.0)

  const [items, setItems] = React.useState<InvoiceItem[]>([
    {
      id: 'inv-1',
      description: 'Precision CNC Machined Aluminum Actuator Housing',
      htsCode: '8479.90.94',
      countryOfOrigin: 'US',
      qty: 50,
      unitPrice: 185.0,
      weightKg: 24.5,
    },
    {
      id: 'inv-2',
      description: 'Brushless DC High-Torque Servo Motor 48V',
      htsCode: '8501.31.20',
      countryOfOrigin: 'DE',
      qty: 25,
      unitPrice: 320.0,
      weightKg: 31.0,
    },
    {
      id: 'inv-3',
      description: 'Industrial Polyurethane Seal Gasket Kit',
      htsCode: '3926.90.99',
      countryOfOrigin: 'JP',
      qty: 100,
      unitPrice: 14.5,
      weightKg: 4.2,
    },
  ])

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0)
  const totalWeightKg = items.reduce((sum, item) => sum + item.weightKg, 0)
  const grandTotal = subtotal + freightCharges + insuranceCharges

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        id: `inv-${Date.now()}`,
        description: 'General Industrial Hardware / Fasteners',
        htsCode: '7318.15.20',
        countryOfOrigin: 'US',
        qty: 10,
        unitPrice: 25.0,
        weightKg: 2.0,
      },
    ])
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function updateItem(id: string, updates: Partial<InvoiceItem>) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  return (
    <div data-slot="commercial-invoice-generator" className={`w-full space-y-6 ${className ?? ''}`}>
      {/* Top Action Card */}
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-foreground font-mono text-sm font-semibold">{invoiceNumber}</span>
              <Badge variant="outline">{incoterms}</Badge>
              <Badge variant={isSigned ? 'default' : 'secondary'}>
                {isSigned ? 'Customs Declared & Sealed' : 'Draft Declaration'}
              </Badge>
            </div>
            <CardTitle className="text-xl">International Commercial Customs Invoice</CardTitle>
            <CardDescription>
              Harmonized Tariff Schedule (HTS) compliance declaration for international customs clearance.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Printer className="size-3.5" />
              Print Form
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="size-3.5" />
              Export EDI / PDF
            </Button>
            {!isSigned ? (
              <Button variant="default" size="sm" className="gap-1.5" onClick={() => setIsSigned(true)}>
                <ShieldCheck className="size-3.5" />
                Sign Customs Declaration
              </Button>
            ) : (
              <Button variant="secondary" size="sm" className="gap-1.5" onClick={() => setIsSigned(false)}>
                Unlock Edit
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="border-border grid grid-cols-1 gap-6 border-t pt-4 sm:grid-cols-2">
          {/* Exporter / Shipper */}
          <div className="border-border space-y-1 rounded-lg border p-3">
            <div className="text-muted-foreground text-xs font-semibold">EXPORTER / SHIPPER (CONSIGNOR)</div>
            <div className="text-foreground text-sm font-medium">Global Aerospace Components Inc.</div>
            <div className="text-muted-foreground text-xs">9400 Aeronautics Way, Dock 4</div>
            <div className="text-muted-foreground text-xs">Seattle, WA 98108, United States</div>
            <div className="text-muted-foreground pt-1 font-mono text-xs">EORI / Tax ID: US-EIN-98441029</div>
          </div>

          {/* Importer / Consignee */}
          <div className="border-border space-y-1 rounded-lg border p-3">
            <div className="text-muted-foreground text-xs font-semibold">IMPORTER / BUYER (CONSIGNEE)</div>
            <div className="text-foreground text-sm font-medium">Nordic Robotics Systems AB</div>
            <div className="text-muted-foreground text-xs">Industrigatan 18, Byggnad B</div>
            <div className="text-muted-foreground text-xs">SE-417 56 Göteborg, Sweden</div>
            <div className="text-muted-foreground pt-1 font-mono text-xs">VAT / EORI: SE556012345601</div>
          </div>
        </CardContent>
      </Card>

      {/* Line Items Table */}
      <Card>
        <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Customs Line Item Breakdown</CardTitle>
            <CardDescription>
              Total Gross Net Weight: <span className="font-mono">{totalWeightKg.toFixed(1)} kg</span> · Currency:{' '}
              {currency}
            </CardDescription>
          </div>

          {!isSigned && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={addItem}>
              <Plus className="size-3.5" />
              Add Line Item
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Goods Description</TableHead>
                <TableHead>HTS / Tariff Code</TableHead>
                <TableHead>Origin (COO)</TableHead>
                <TableHead className="text-right">Net Wt (kg)</TableHead>
                <TableHead className="w-[90px] text-right">Qty</TableHead>
                <TableHead className="w-[120px] text-right">Unit Price</TableHead>
                <TableHead className="text-right">Customs Total</TableHead>
                {!isSigned && <TableHead className="w-[40px]"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  {/* Description */}
                  <TableCell>
                    {!isSigned ? (
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, { description: e.target.value })}
                        className="h-8 text-xs"
                      />
                    ) : (
                      <span className="text-foreground font-medium">{item.description}</span>
                    )}
                  </TableCell>

                  {/* HTS Code */}
                  <TableCell>
                    {!isSigned ? (
                      <Input
                        value={item.htsCode}
                        onChange={(e) => updateItem(item.id, { htsCode: e.target.value })}
                        className="h-8 w-28 font-mono text-xs"
                      />
                    ) : (
                      <span className="font-mono text-xs font-semibold">{item.htsCode}</span>
                    )}
                  </TableCell>

                  {/* Country of Origin */}
                  <TableCell>
                    {!isSigned ? (
                      <Input
                        value={item.countryOfOrigin}
                        onChange={(e) => updateItem(item.id, { countryOfOrigin: e.target.value })}
                        className="h-8 w-16 text-center font-mono text-xs uppercase"
                      />
                    ) : (
                      <span className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs font-medium">
                        {item.countryOfOrigin}
                      </span>
                    )}
                  </TableCell>

                  {/* Net Weight */}
                  <TableCell className="text-right">
                    {!isSigned ? (
                      <Input
                        type="number"
                        step="0.1"
                        value={item.weightKg}
                        onChange={(e) => updateItem(item.id, { weightKg: Number(e.target.value) })}
                        className="h-8 text-right font-mono text-xs"
                      />
                    ) : (
                      <span className="text-muted-foreground font-mono text-xs">{item.weightKg.toFixed(1)}</span>
                    )}
                  </TableCell>

                  {/* Qty */}
                  <TableCell className="text-right">
                    {!isSigned ? (
                      <Input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => updateItem(item.id, { qty: Number(e.target.value) })}
                        className="h-8 text-right font-mono text-xs"
                      />
                    ) : (
                      <span className="font-mono text-sm">{item.qty}</span>
                    )}
                  </TableCell>

                  {/* Unit Price */}
                  <TableCell className="text-right">
                    {!isSigned ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) })}
                        className="h-8 text-right font-mono text-xs"
                      />
                    ) : (
                      <span className="font-mono text-sm">${item.unitPrice.toFixed(2)}</span>
                    )}
                  </TableCell>

                  {/* Line Total */}
                  <TableCell className="text-foreground text-right font-mono text-sm font-semibold">
                    ${(item.qty * item.unitPrice).toFixed(2)}
                  </TableCell>

                  {/* Delete */}
                  {!isSigned && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive size-8"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        {/* Totals & Tariff Summary Footer */}
        <CardFooter className="border-border flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="text-muted-foreground space-y-1 text-xs sm:max-w-md">
            <p className="text-foreground font-medium">Exporter Declaration & Legal Certification:</p>
            <p>
              I hereby certify that the information on this invoice is true and correct and that the contents of this
              shipment are as stated above.
            </p>
          </div>

          <div className="w-full space-y-1.5 sm:w-72">
            <div className="text-muted-foreground flex justify-between text-xs">
              <span>FOB Line Subtotal:</span>
              <span className="text-foreground font-mono font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="text-muted-foreground flex justify-between text-xs">
              <span>International Freight (Air):</span>
              <span className="text-foreground font-mono font-medium">${freightCharges.toFixed(2)}</span>
            </div>
            <div className="text-muted-foreground flex justify-between text-xs">
              <span>Cargo Marine Insurance:</span>
              <span className="text-foreground font-mono font-medium">${insuranceCharges.toFixed(2)}</span>
            </div>
            <div className="border-border text-foreground flex justify-between border-t pt-2 text-sm font-semibold">
              <span>Declared CIF Value:</span>
              <span className="font-mono text-base font-bold">${grandTotal.toFixed(2)} USD</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
