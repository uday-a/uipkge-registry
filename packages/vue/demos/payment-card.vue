<script setup lang="ts">
import { PaymentCard } from "@/components/ui/payment-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { onMounted, onUnmounted, ref } from "vue";

const typedNumber = ref("");
let typeTimer: ReturnType<typeof setInterval> | null = null;

const brands = [
  "4111 1111 1111 1111",
  "5454 5454 5454 5454",
  "3782 822463 10005",
  "6011 1111 1111 1117",
];
let brandIdx = 0;
let charIdx = 0;

function startTyping() {
  typeTimer = setInterval(() => {
    const target = brands[brandIdx];
    if (charIdx <= target.length) {
      typedNumber.value = target.slice(0, charIdx);
      charIdx++;
    } else {
      brandIdx = (brandIdx + 1) % brands.length;
      charIdx = 0;
      typedNumber.value = "";
    }
  }, 180);
}

onMounted(startTyping);
onUnmounted(() => {
  if (typeTimer) clearInterval(typeTimer);
});

// Live interactive example — format as the user types.
const liveNumber = ref("");
const liveName = ref("Jane Doe");
const liveExpiry = ref("12/29");
const liveCvc = ref("");
const liveCvcFocused = ref(false);

function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  // Amex uses 4-6-5; everything else 4-4-4-4. Detect as soon as we can.
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

function onNumberInput(v: string | number) {
  liveNumber.value = formatCardNumber(String(v ?? ""));
}

function onExpiryInput(v: string | number) {
  liveExpiry.value = formatExpiry(String(v ?? ""));
}

function onCvcInput(v: string | number) {
  const isAmex = /^3[47]/.test(liveNumber.value.replace(/\D/g, ""));
  liveCvc.value = String(v ?? "")
    .replace(/\D/g, "")
    .slice(0, isAmex ? 4 : 3);
}

// Click-to-flip story.
const flipOpen = ref(false);
</script>

<template>
  <Story
    title="Default"
    description="Front face with sample card data. Brand auto-detected from the number prefix."
  >
    <div class="flex justify-center py-4">
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
    <div class="flex justify-center py-4">
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
    <div class="flex flex-col items-center gap-3 py-4">
      <PaymentCard :number="typedNumber" name="Jane Doe" expiry="12/29" />
      <code class="text-muted-foreground text-xs">{{
        typedNumber || "(typing…)"
      }}</code>
    </div>
  </Story>

  <Story
    title="Live typing"
    description="Type a card number to see digits animate in and the logo switch. Focus the CVC field to flip the card to the back."
  >
    <div class="mx-auto flex w-full max-w-sm flex-col gap-4 py-4">
      <div class="flex justify-center">
        <PaymentCard
          :number="liveNumber"
          :name="liveName"
          :expiry="liveExpiry"
          :cvc="liveCvc"
          :flipped="liveCvcFocused"
        />
      </div>
      <div class="grid gap-1.5">
        <Label for="demo-cc-number">Card number</Label>
        <Input
          id="demo-cc-number"
          :model-value="liveNumber"
          inputmode="numeric"
          autocomplete="cc-number"
          placeholder="4242 4242 4242 4242"
          @update:model-value="onNumberInput"
        />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="grid gap-1.5">
          <Label for="demo-cc-name">Name</Label>
          <Input
            id="demo-cc-name"
            v-model="liveName"
            autocomplete="cc-name"
            placeholder="Jane Doe"
          />
        </div>
        <div class="grid gap-1.5">
          <Label for="demo-cc-expiry">Expiry</Label>
          <Input
            id="demo-cc-expiry"
            :model-value="liveExpiry"
            inputmode="numeric"
            autocomplete="cc-exp"
            placeholder="MM/YY"
            @update:model-value="onExpiryInput"
          />
        </div>
      </div>
      <div class="grid gap-1.5">
        <Label for="demo-cc-cvc">CVC</Label>
        <Input
          id="demo-cc-cvc"
          :model-value="liveCvc"
          inputmode="numeric"
          autocomplete="cc-csc"
          placeholder="123"
          @update:model-value="onCvcInput"
          @focus="liveCvcFocused = true"
          @blur="liveCvcFocused = false"
        />
      </div>
    </div>
  </Story>

  <Story
    title="Click to flip"
    description="Toggle the flipped prop — useful for checkout forms that reveal CVC on demand."
  >
    <div class="flex flex-col items-center gap-4 py-4">
      <PaymentCard
        number="5454 5454 5454 5454"
        name="Jane Doe"
        expiry="08/27"
        cvc="917"
        :flipped="flipOpen"
      />
      <Button variant="outline" size="sm" @click="flipOpen = !flipOpen">
        {{ flipOpen ? "Show front" : "Show back" }}
      </Button>
    </div>
  </Story>

  <Story
    title="Tilt + shimmer"
    description="Opt-in tilt follows the mouse via rAF; shimmer runs a 2.5s gradient sweep. Hover over the card."
  >
    <div class="flex justify-center py-6">
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
    <div class="flex justify-center py-4">
      <PaymentCard name="" expiry="" />
    </div>
  </Story>

  <Story
    title="Compact variant"
    description="Used inside lists and confirmation summaries — fixed 120px width, scaled-down typography."
  >
    <div class="flex flex-wrap items-center justify-center gap-3 py-4">
      <PaymentCard
        number="4242 4242 4242 4242"
        expiry="12/29"
        variant="compact"
        :flip="false"
      />
      <PaymentCard
        number="5454 5454 5454 5454"
        expiry="08/27"
        variant="compact"
        :flip="false"
      />
      <PaymentCard
        number="3782 822463 10005"
        expiry="03/30"
        variant="compact"
        :flip="false"
      />
      <PaymentCard
        number="6011 1111 1111 1117"
        expiry="11/28"
        variant="compact"
        :flip="false"
      />
    </div>
  </Story>

  <Story
    title="All brands"
    description="Force a specific brand via the brand prop. Each gets its own metallic face + wordmark."
  >
    <div class="grid grid-cols-1 gap-3 py-4 sm:grid-cols-2">
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

  <Story title="Sizes" description="Three fixed sizes: 280 / 340 / 400px wide.">
    <div class="flex flex-wrap items-end justify-center gap-4 py-4">
      <PaymentCard number="4242 4242 4242 4242" expiry="12/29" size="sm" />
      <PaymentCard number="4242 4242 4242 4242" expiry="12/29" size="md" />
      <PaymentCard number="4242 4242 4242 4242" expiry="12/29" size="lg" />
    </div>
  </Story>
</template>
