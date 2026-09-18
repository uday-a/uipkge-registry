import { useRef, useState } from 'react'
import Story from '../../components/story/Story'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@react-registry/card'
import { Button } from '@react-registry/button'
import { SignaturePad, type SignaturePadRef } from '@react-registry/signature-pad'
import { Check, Download, Eraser, PenLine } from 'lucide-react'

export default function SignaturePadDemo() {
  const [signature, setSignature] = useState<string | null>(null)
  const padRef = useRef<SignaturePadRef | null>(null)
  const [penColor, setPenColor] = useState('#1d4ed8')
  const [penThickness, setPenThickness] = useState(3)
  const [bgColor, setBgColor] = useState('#ffffff')

  return (
    <>
      <Story
        title="Default pad"
        description="Standard signature capture with a built-in clear button and live point count."
      >
        <div className="max-w-md space-y-2">
          <SignaturePad modelValue={signature} onModelChange={setSignature} className="w-full" />
          <p className="text-muted-foreground text-xs">{signature ? 'Signature captured' : 'No signature yet'}</p>
        </div>
      </Story>

      <Story
        title="Styled ink"
        description="Blue pen with a thicker stroke on a tinted background — common for legal documents."
      >
        <div className="max-w-md space-y-2">
          <SignaturePad
            modelValue={signature}
            onModelChange={setSignature}
            penColor="#1d4ed8"
            penThickness={3}
            backgroundColor="#f8fafc"
            className="w-full"
          />
          <p className="text-muted-foreground text-xs">Blue ink, thickness 3, light slate background.</p>
        </div>
      </Story>

      <Story
        title="Live config"
        description="Adjust pen color, thickness, and background at runtime to preview different styles."
      >
        <div className="max-w-md space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <label className="flex items-center gap-2">
              Pen
              <input
                value={penColor}
                onChange={(e) => setPenColor(e.target.value)}
                type="color"
                className="size-7 cursor-pointer rounded border"
              />
            </label>
            <label className="flex items-center gap-2">
              BG
              <input
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                type="color"
                className="size-7 cursor-pointer rounded border"
              />
            </label>
            <label className="flex items-center gap-2">
              Thickness
              <input
                value={penThickness}
                onChange={(e) => setPenThickness(Number(e.target.value))}
                type="range"
                min={1}
                max={6}
                className="w-28"
              />
              <span className="text-muted-foreground tabular-nums">{penThickness}</span>
            </label>
          </div>
          <SignaturePad
            modelValue={signature}
            onModelChange={setSignature}
            penColor={penColor}
            penThickness={penThickness}
            backgroundColor={bgColor}
            className="w-full"
          />
          {signature ? (
            <p className="flex items-center gap-1 text-xs text-emerald-600">
              <Check className="size-3.5" /> Captured
            </p>
          ) : null}
        </div>
      </Story>

      <Story
        title="Programmatic control"
        description="Use a template ref to clear and export without the built-in button. Shows isEmpty and pointCount."
      >
        <div className="max-w-md space-y-3">
          <SignaturePad
            ref={padRef}
            modelValue={signature}
            onModelChange={setSignature}
            showClearButton={false}
            className="w-full"
          />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => padRef.current?.clear()}>
              <Eraser className="size-4" />
              Clear
            </Button>
            <Button size="sm" onClick={() => padRef.current?.exportSignature()}>
              <Download className="size-4" />
              Export
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">
            Empty: {padRef.current?.isEmpty ? 'yes' : 'no'} · Points: {padRef.current?.pointCount ?? 0}
          </p>
        </div>
      </Story>

      <Story
        title="States"
        description="Disabled blocks all interaction; readonly shows existing ink but prevents edits."
      >
        <div className="max-w-md space-y-3">
          <SignaturePad modelValue={signature} onModelChange={setSignature} disabled className="w-full" />
          <SignaturePad modelValue={signature} onModelChange={setSignature} readonly className="w-full" />
        </div>
      </Story>

      <Story
        title="In context: Contract signing"
        description="A realistic agreement card with terms text, a signature pad, and a custom actions slot for submit."
      >
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Sign your agreement</CardTitle>
            <CardDescription>By signing below, you accept the terms of service and privacy policy.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm leading-relaxed">
              This agreement is effective upon signing. Your signature below confirms that you have read and understood
              all terms outlined in the contract.
            </p>
            <SignaturePad
              modelValue={signature}
              onModelChange={setSignature}
              showClearButton={false}
              className="w-full"
              actions={({ clear, empty }) => (
                <div className="flex items-center justify-between pt-2">
                  <Button size="sm" variant="ghost" disabled={empty} onClick={clear}>
                    <PenLine className="size-4" />
                    Reset
                  </Button>
                  <Button size="sm" disabled={empty}>
                    <Check className="size-4" />
                    Submit signature
                  </Button>
                </div>
              )}
            />
          </CardContent>
        </Card>
      </Story>
    </>
  )
}
