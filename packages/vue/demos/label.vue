<template>
  <Story title="With input" description="Label paired with an Input via matching for/id attributes.">
    <div class="grid max-w-sm gap-2">
      <Label for="name">Name</Label>
      <Input id="name" placeholder="Jane Doe" />
    </div>
  </Story>

  <Story
    title="Required and invalid"
    description="Destructive-colored label with required asterisk paired with an aria-invalid input."
  >
    <div class="grid max-w-sm gap-2">
      <Label for="email" class="text-destructive">Email <span aria-hidden="true">*</span></Label>
      <Input id="email" type="email" aria-invalid="true" />
      <p class="text-destructive text-xs">Required field</p>
    </div>
  </Story>

  <Story title="Inline with checkbox" description="Muted label sitting next to a checkbox, linked via for/id.">
    <div class="flex max-w-sm items-center gap-2">
      <input id="agree" type="checkbox" class="accent-primary size-4" />
      <Label for="agree" class="text-muted-foreground">Inline label next to checkbox</Label>
    </div>
  </Story>
</template>
