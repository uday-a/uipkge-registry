import { useEffect, useRef, useState } from "react";
import Story from "../../components/story/Story";
import { PaymentCard } from "@react-registry/payment-card";
import { Button } from "@react-registry/button";
import { Input } from "@react-registry/input";
import { Label } from "@react-registry/label";

const brands = [
  "4111 1111 1111 1111",
  "5454 5454 5454 5454",
  "3782 822463 10005",
  "6011 1111 1111 1117",
];

function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  if (/^3[47]/.test(digits)) {
    return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)]
      .filter(Boolean)
      .join(" ");
  }
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiry(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

export default function PaymentCardDemo() {
  const [typedNumber, setTypedNumber] = useState("");
  const brandIdx = useRef(0);
  const charIdx = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      const target = brands[brandIdx.current];
      if (charIdx.current <= target.length) {
        setTypedNumber(target.slice(0, charIdx.current));
        charIdx.current++;
      } else {
        brandIdx.current = (brandIdx.current + 1) % brands.length;
        charIdx.current = 0;
        setTypedNumber("");
      }
    }, 180);
    return () => clearInterval(id);
  }, []);

  // Live interactive example.
  const [liveNumber, setLiveNumber] = useState("");
  const [liveName, setLiveName] = useState("Jane Doe");
  const [liveExpiry, setLiveExpiry] = useState("12/29");
  const [liveCvc, setLiveCvc] = useState("");
  const [liveCvcFocused, setLiveCvcFocused] = useState(false);
  const [flipOpen, setFlipOpen] = useState(false);

  const isAmex = /^3[47]/.test(liveNumber.replace(/\D/g, ""));

  return (
    <>
      <Story
        title="Default"
        description="Front face with sample card data. Brand auto-detected from the number prefix."
      >
        <div className="flex justify-center py-4">
          <PaymentCard
            number="4242 4242 4242 4242"
            name="Jane Doe"
            expiry="12/29"
          />
        </div>
      </Story>

      <Story
        title="Flipped"
        description="Back face with CVC. The 700ms 3D rotateY transition is springy and smooth."
      >
        <div className="flex justify-center py-4">
          <PaymentCard
            number="4242 4242 4242 4242"
            name="Jane Doe"
            expiry="12/29"
            cvc="123"
            flipped
          />
        </div>
      </Story>

      <Story
        title="Brand auto-detect"
        description="Number is typed automatically. Each new digit pops onto the card and the brand wordmark flips in when it changes."
      >
        <div className="flex flex-col items-center gap-3 py-4">
          <PaymentCard number={typedNumber} name="Jane Doe" expiry="12/29" />
          <code className="text-muted-foreground text-xs">
            {typedNumber || "(typing…)"}
          </code>
        </div>
      </Story>

      <Story
        title="Live typing"
        description="Type a card number to see digits animate in and the logo switch. Focus the CVC field to flip the card to the back."
      >
        <div className="mx-auto flex w-full max-w-sm flex-col gap-4 py-4">
          <div className="flex justify-center">
            <PaymentCard
              number={liveNumber}
              name={liveName}
              expiry={liveExpiry}
              cvc={liveCvc}
              flipped={liveCvcFocused}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="demo-cc-number">Card number</Label>
            <Input
              id="demo-cc-number"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              value={liveNumber}
              onChange={(e) => setLiveNumber(formatCardNumber(e.target.value))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="demo-cc-name">Name</Label>
              <Input
                id="demo-cc-name"
                autoComplete="cc-name"
                placeholder="Jane Doe"
                value={liveName}
                onChange={(e) => setLiveName(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="demo-cc-expiry">Expiry</Label>
              <Input
                id="demo-cc-expiry"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                value={liveExpiry}
                onChange={(e) => setLiveExpiry(formatExpiry(e.target.value))}
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="demo-cc-cvc">CVC</Label>
            <Input
              id="demo-cc-cvc"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              value={liveCvc}
              onChange={(e) =>
                setLiveCvc(
                  e.target.value.replace(/\D/g, "").slice(0, isAmex ? 4 : 3),
                )
              }
              onFocus={() => setLiveCvcFocused(true)}
              onBlur={() => setLiveCvcFocused(false)}
            />
          </div>
        </div>
      </Story>

      <Story
        title="Click to flip"
        description="Toggle the flipped prop — useful for checkout forms that reveal CVC on demand."
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <PaymentCard
            number="5454 5454 5454 5454"
            name="Jane Doe"
            expiry="08/27"
            cvc="917"
            flipped={flipOpen}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFlipOpen((v) => !v)}
          >
            {flipOpen ? "Show front" : "Show back"}
          </Button>
        </div>
      </Story>

      <Story
        title="Tilt + shimmer"
        description="Opt-in tilt follows the mouse via rAF; shimmer runs a 2.5s gradient sweep. Hover over the card."
      >
        <div className="flex justify-center py-6">
          <PaymentCard
            number="5454 5454 5454 5454"
            name="Jane Doe"
            expiry="08/27"
            tilt
            shimmer
          />
        </div>
      </Story>

      <Story
        title="Empty / placeholder"
        description="No number yet — masked bullets and a generic CARD mark until the first digits land."
      >
        <div className="flex justify-center py-4">
          <PaymentCard name="" expiry="" />
        </div>
      </Story>

      <Story
        title="Compact variant"
        description="Used inside lists and confirmation summaries — fixed 120px width, scaled-down typography."
      >
        <div className="flex flex-wrap items-center justify-center gap-3 py-4">
          <PaymentCard
            number="4242 4242 4242 4242"
            expiry="12/29"
            variant="compact"
            flip={false}
          />
          <PaymentCard
            number="5454 5454 5454 5454"
            expiry="08/27"
            variant="compact"
            flip={false}
          />
          <PaymentCard
            number="3782 822463 10005"
            expiry="03/30"
            variant="compact"
            flip={false}
          />
          <PaymentCard
            number="6011 1111 1111 1117"
            expiry="11/28"
            variant="compact"
            flip={false}
          />
        </div>
      </Story>

      <Story
        title="All brands"
        description="Force a specific brand via the brand prop. Each gets its own metallic face + wordmark."
      >
        <div className="grid grid-cols-1 gap-3 py-4 sm:grid-cols-2">
          <PaymentCard
            number="4111 1111 1111 1111"
            name="Jane Doe"
            expiry="12/29"
            brand="visa"
          />
          <PaymentCard
            number="5555 5555 5555 4444"
            name="Jane Doe"
            expiry="08/27"
            brand="mastercard"
          />
          <PaymentCard
            number="3782 822463 10005"
            name="Jane Doe"
            expiry="03/30"
            brand="amex"
          />
          <PaymentCard
            number="6011 1111 1111 1117"
            name="Jane Doe"
            expiry="11/28"
            brand="discover"
          />
        </div>
      </Story>

      <Story
        title="Sizes"
        description="Three fixed sizes: 280 / 340 / 400px wide."
      >
        <div className="flex flex-wrap items-end justify-center gap-4 py-4">
          <PaymentCard number="4242 4242 4242 4242" expiry="12/29" size="sm" />
          <PaymentCard number="4242 4242 4242 4242" expiry="12/29" size="md" />
          <PaymentCard number="4242 4242 4242 4242" expiry="12/29" size="lg" />
        </div>
      </Story>
    </>
  );
}
