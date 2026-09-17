<script setup lang="ts">
import { AdvanceSelect } from "@/components/ui/advance-select";
import { ref } from "vue";
import { Search, Star, MapPin, X } from "lucide-vue-next";
import { Badge } from "@/components/ui/badge";

// ── Basic ──
const basicValue = ref<string>();
const basicOptions = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "durian", label: "Durian" },
  { value: "elderberry", label: "Elderberry" },
];

// ── Searchable ──
const searchValue = ref<string>();

// ── Multiple ──
const multiValue = ref<string[]>([]);

// ── Tags ──
const tagsValue = ref<string[]>([]);

// ── Grouped ──
const groupedValue = ref<string>();
const groupedOptions = [
  { value: "beijing", label: "Beijing", group: "China" },
  { value: "shanghai", label: "Shanghai", group: "China" },
  { value: "tokyo", label: "Tokyo", group: "Japan" },
  { value: "osaka", label: "Osaka", group: "Japan" },
  { value: "seoul", label: "Seoul", group: "Korea" },
  { value: "busan", label: "Busan", group: "Korea" },
];

// ── Disabled options ──
const disabledValue = ref<string>();
const disabledOptions = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana", disabled: true },
  { value: "cherry", label: "Cherry" },
  { value: "durian", label: "Durian", disabled: true },
  { value: "elderberry", label: "Elderberry" },
];

// ── Loading ──
const loadingValue = ref<string>();

// ── Sizes ──
const smValue = ref<string>();
const lgValue = ref<string>();

// ── Status ──
const errorValue = ref<string>();
const warningValue = ref<string>();

// ── Max count ──
const maxCountValue = ref<string[]>([]);

// ── Max tag count ──
const maxTagValue = ref<string[]>(["apple", "banana", "cherry", "durian"]);

// ── Hide selected ──
const hideSelectedValue = ref<string[]>([]);

// ── Custom option render ──
const customOptValue = ref<string>();
const userOptions = [
  { value: "1", label: "Alice Chen", role: "Engineer", avatar: "AC" },
  { value: "2", label: "Bob Smith", role: "Designer", avatar: "BS" },
  { value: "3", label: "Carol Jones", role: "PM", avatar: "CJ" },
  { value: "4", label: "David Park", role: "Engineer", avatar: "DP" },
  { value: "5", label: "Eve Wilson", role: "Designer", avatar: "EW" },
];

// ── Custom tag render ──
const customTagValue = ref<string[]>(["apple", "banana"]);

// ── Virtual scroll ──
const virtualValue = ref<string>();
const virtualOptions = Array.from({ length: 10000 }, (_, i) => ({
  value: `item-${i}`,
  label: `Item ${i + 1}`,
}));

// ── Variants ──
const variantOutlined = ref<string>();
const variantFilled = ref<string>();
const variantBorderless = ref<string>();

// ── Token separators ──
const tokenValue = ref<string[]>([]);

// ── Not found ──
const notFoundValue = ref<string>();

// ── Auto clear search ──
const autoClearOn = ref<string[]>([]);
const autoClearOff = ref<string[]>([]);

// ── Custom field names ──
const customFieldValue = ref<string>();
const customFieldOptions = [
  { id: "1", name: "Alice", dept: "Engineering" },
  { id: "2", name: "Bob", dept: "Design" },
  { id: "3", name: "Carol", dept: "Product" },
];

// ── Remote search ──
const remoteValue = ref<string>();
const remoteLoading = ref(false);
const remoteOptions = ref<{ value: string; label: string }[]>([]);
let remoteTimeout: ReturnType<typeof setTimeout>;
function handleRemoteSearch(q: string) {
  remoteLoading.value = true;
  clearTimeout(remoteTimeout);
  remoteTimeout = setTimeout(() => {
    if (!q.trim()) {
      remoteOptions.value = [];
    } else {
      remoteOptions.value = Array.from({ length: 5 }, (_, i) => ({
        value: `${q}-${i}`,
        label: `${q} result ${i + 1}`,
      }));
    }
    remoteLoading.value = false;
  }, 600);
}

// ── Label in value ──
const labelValue = ref<{ value: string; label: string }>();
</script>

<template>
  <!-- 1. Basic -->
  <Story title="Basic" description="Simple single select dropdown.">
    <AdvanceSelect
      v-model="basicValue"
      :options="basicOptions"
      placeholder="Pick a fruit"
      class="w-64"
    />
  </Story>

  <!-- 2. Searchable -->
  <Story
    title="Searchable"
    description="Single select with built-in search filtering."
  >
    <AdvanceSelect
      v-model="searchValue"
      :options="basicOptions"
      show-search
      placeholder="Search fruits..."
      class="w-64"
    />
  </Story>

  <!-- 3. Multiple -->
  <Story title="Multiple" description="Select multiple items with tag chips.">
    <AdvanceSelect
      v-model="multiValue"
      mode="multiple"
      :options="basicOptions"
      placeholder="Pick fruits"
      class="w-80"
    />
  </Story>

  <!-- 4. Tags mode -->
  <Story
    title="Tags"
    description="Create custom tags not in the predefined list."
  >
    <AdvanceSelect
      v-model="tagsValue"
      mode="tags"
      :options="basicOptions"
      placeholder="Type and press enter"
      class="w-80"
    />
  </Story>

  <!-- 5. Grouped options -->
  <Story title="Grouped" description="Options organized by country groups.">
    <AdvanceSelect
      v-model="groupedValue"
      :options="groupedOptions"
      placeholder="Pick a city"
      class="w-64"
    />
  </Story>

  <!-- 6. Disabled options -->
  <Story title="Disabled options" description="Some items are non-selectable.">
    <AdvanceSelect
      v-model="disabledValue"
      :options="disabledOptions"
      placeholder="Pick a fruit"
      class="w-64"
    />
  </Story>

  <!-- 7. Loading -->
  <Story
    title="Loading"
    description="Shows a spinner in the trigger while loading."
  >
    <AdvanceSelect
      v-model="loadingValue"
      :options="[]"
      loading
      placeholder="Loading..."
      class="w-64"
    />
  </Story>

  <!-- 8. Size small -->
  <Story title="Size: small" description="Compact trigger for dense layouts.">
    <AdvanceSelect
      v-model="smValue"
      :options="basicOptions"
      size="sm"
      placeholder="Small select"
      class="w-64"
    />
  </Story>

  <!-- 9. Size large -->
  <Story
    title="Size: large"
    description="Taller trigger for touch-friendly interfaces."
  >
    <AdvanceSelect
      v-model="lgValue"
      :options="basicOptions"
      size="lg"
      placeholder="Large select"
      class="w-64"
    />
  </Story>

  <!-- 10. Status error -->
  <Story title="Status: error" description="Red border for validation errors.">
    <AdvanceSelect
      v-model="errorValue"
      :options="basicOptions"
      status="error"
      placeholder="Error state"
      class="w-64"
    />
  </Story>

  <!-- 11. Status warning -->
  <Story title="Status: warning" description="Amber border for warnings.">
    <AdvanceSelect
      v-model="warningValue"
      :options="basicOptions"
      status="warning"
      placeholder="Warning state"
      class="w-64"
    />
  </Story>

  <!-- 12. Clearable -->
  <Story title="Clearable" description="Click the X to clear the selection.">
    <AdvanceSelect
      v-model="basicValue"
      :options="basicOptions"
      allow-clear
      placeholder="Pick a fruit"
      class="w-64"
    />
  </Story>

  <!-- 13. Max count -->
  <Story title="Max count" description="Limit selection to 3 items.">
    <AdvanceSelect
      v-model="maxCountValue"
      mode="multiple"
      :options="basicOptions"
      :max-count="3"
      placeholder="Max 3 fruits"
      class="w-80"
    />
  </Story>

  <!-- 14. Max tag count -->
  <Story
    title="Max tag count"
    description="Show only 2 tags, rest collapsed to +N."
  >
    <AdvanceSelect
      v-model="maxTagValue"
      mode="multiple"
      :options="basicOptions"
      :max-tag-count="2"
      placeholder="Pick fruits"
      class="w-80"
    />
  </Story>

  <!-- 15. Hide selected -->
  <Story
    title="Hide selected"
    description="Selected items are hidden from the dropdown list."
  >
    <AdvanceSelect
      v-model="hideSelectedValue"
      mode="multiple"
      :options="basicOptions"
      hide-selected
      placeholder="Pick fruits"
      class="w-80"
    />
  </Story>

  <!-- 16. Custom option render -->
  <Story
    title="Custom option render"
    description="Render rich content in dropdown items with avatars."
  >
    <AdvanceSelect
      v-model="customOptValue"
      :options="userOptions"
      show-search
      placeholder="Pick a user"
      class="w-80"
    >
      <template #option="{ option }">
        <div class="flex items-center gap-2">
          <div
            class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-full text-xs font-bold"
          >
            {{ option.avatar }}
          </div>
          <div class="flex flex-col">
            <span class="text-sm">{{ option.label }}</span>
            <span class="text-muted-foreground text-xs">{{ option.role }}</span>
          </div>
        </div>
      </template>
    </AdvanceSelect>
  </Story>

  <!-- 17. Custom tag render -->
  <Story
    title="Custom tag render"
    description="Custom badge styling for selected tags."
  >
    <AdvanceSelect
      v-model="customTagValue"
      mode="multiple"
      :options="basicOptions"
      class="w-80"
    >
      <template #tag="{ label, closable, onClose }">
        <Badge variant="outline" class="h-6 gap-1 pr-1 pl-2 text-xs">
          <Star class="size-3 text-amber-500" />
          <span>{{ label }}</span>
          <span
            v-if="closable"
            role="button"
            tabindex="0"
            class="hover:bg-muted-foreground/20 inline-flex cursor-pointer items-center rounded-full p-0.5 transition-colors"
            :aria-label="`Remove ${label}`"
            @click="onClose"
            @keydown.enter.prevent="onClose"
            @keydown.space.prevent="onClose"
          >
            <X class="size-3" />
          </span>
        </Badge>
      </template>
    </AdvanceSelect>
  </Story>

  <!-- 18. Virtual scroll -->
  <Story
    title="Virtual scroll"
    description="10,000 items with CSS content-visibility optimization."
  >
    <AdvanceSelect
      v-model="virtualValue"
      :options="virtualOptions"
      show-search
      placeholder="Search 10,000 items..."
      class="w-80"
    />
  </Story>

  <!-- 19. Variants -->
  <Story
    title="Variants"
    description="Outlined (default), filled, and borderless styles."
  >
    <div class="flex w-64 flex-col gap-3">
      <AdvanceSelect
        v-model="variantOutlined"
        :options="basicOptions"
        variant="outlined"
        placeholder="Outlined"
      />
      <AdvanceSelect
        v-model="variantFilled"
        :options="basicOptions"
        variant="filled"
        placeholder="Filled"
      />
      <AdvanceSelect
        v-model="variantBorderless"
        :options="basicOptions"
        variant="borderless"
        placeholder="Borderless"
      />
    </div>
  </Story>

  <!-- 20. Token separators -->
  <Story
    title="Token separators"
    description="Type 'apple,banana' or press Enter to create multiple tags at once."
  >
    <AdvanceSelect
      v-model="tokenValue"
      mode="tags"
      :options="basicOptions"
      :token-separators="[',', ' ']"
      placeholder="Type and separate with comma or space"
      class="w-96"
    />
  </Story>

  <!-- 21. Not found content -->
  <Story
    title="Not found"
    description="Custom empty state when search yields no results."
  >
    <AdvanceSelect
      v-model="notFoundValue"
      :options="basicOptions"
      show-search
      not-found-content="No fruits match your search. Try 'mango'."
      placeholder="Search..."
      class="w-64"
    />
  </Story>

  <!-- 22. Auto clear search -->
  <Story
    title="Auto clear search"
    description="Control whether search text clears after selection."
  >
    <div class="flex w-80 flex-col gap-3">
      <AdvanceSelect
        v-model="autoClearOn"
        mode="multiple"
        :options="basicOptions"
        show-search
        placeholder="Auto clears (default)"
      />
      <AdvanceSelect
        v-model="autoClearOff"
        mode="multiple"
        :options="basicOptions"
        show-search
        :auto-clear-search-value="false"
        placeholder="Keeps search text"
      />
    </div>
  </Story>

  <!-- 23. Custom field names -->
  <Story
    title="Custom field names"
    description="Map option object keys to label/value/group."
  >
    <AdvanceSelect
      v-model="customFieldValue"
      :options="customFieldOptions"
      :field-names="{ label: 'name', value: 'id', group: 'dept' }"
      placeholder="Pick an employee"
      class="w-64"
    />
  </Story>

  <!-- 24. Remote search -->
  <Story
    title="Remote search"
    description="Simulated async fetch with debounce and loading state."
  >
    <AdvanceSelect
      v-model="remoteValue"
      :options="remoteOptions"
      show-search
      :loading="remoteLoading"
      placeholder="Type to search..."
      class="w-80"
      @search="handleRemoteSearch"
    />
  </Story>

  <!-- 25. Label in value -->
  <Story
    title="Label in value"
    description="Value stores both id and label as an object."
  >
    <div class="w-80 space-y-2">
      <AdvanceSelect
        v-model="labelValue"
        :options="basicOptions"
        placeholder="Pick a fruit"
        class="w-64"
      />
      <p class="text-muted-foreground text-xs">
        Selected: {{ labelValue ? JSON.stringify(labelValue) : "none" }}
      </p>
    </div>
  </Story>

  <!-- 26. Prefix / suffix icons -->
  <Story
    title="Prefix & suffix icons"
    description="Custom icons inside the trigger."
  >
    <AdvanceSelect
      v-model="basicValue"
      :options="basicOptions"
      placeholder="Pick a fruit"
      class="w-64"
    >
      <template #prefix>
        <Search class="text-muted-foreground size-4" />
      </template>
      <template #suffixIcon>
        <MapPin class="text-muted-foreground size-4" />
      </template>
    </AdvanceSelect>
  </Story>

  <!-- 27. Full featured -->
  <Story
    title="Full featured"
    description="Multiple mode + search + max count + clearable + custom option render all together."
  >
    <AdvanceSelect
      v-model="multiValue"
      mode="multiple"
      :options="userOptions"
      show-search
      :max-count="5"
      allow-clear
      placeholder="Pick team members"
      class="w-96"
    >
      <template #option="{ option }">
        <div class="flex items-center gap-2">
          <div
            class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-full text-xs font-bold"
          >
            {{ option.avatar }}
          </div>
          <div class="flex flex-col">
            <span class="text-sm">{{ option.label }}</span>
            <span class="text-muted-foreground text-xs">{{ option.role }}</span>
          </div>
        </div>
      </template>
    </AdvanceSelect>
  </Story>
</template>
