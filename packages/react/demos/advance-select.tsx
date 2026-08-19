import { useRef, useState } from "react";
import Story from "../../components/story/Story";
import { AdvanceSelect } from "@react-registry/advance-select";
import { Badge } from "@react-registry/badge";
import { MapPin, Search, Star, X } from "lucide-react";

const basicOptions = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "durian", label: "Durian" },
  { value: "elderberry", label: "Elderberry" },
];

const groupedOptions = [
  { value: "beijing", label: "Beijing", group: "China" },
  { value: "shanghai", label: "Shanghai", group: "China" },
  { value: "tokyo", label: "Tokyo", group: "Japan" },
  { value: "osaka", label: "Osaka", group: "Japan" },
  { value: "seoul", label: "Seoul", group: "Korea" },
  { value: "busan", label: "Busan", group: "Korea" },
];

const disabledOptions = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana", disabled: true },
  { value: "cherry", label: "Cherry" },
  { value: "durian", label: "Durian", disabled: true },
  { value: "elderberry", label: "Elderberry" },
];

const userOptions = [
  { value: "1", label: "Alice Chen", role: "Engineer", avatar: "AC" },
  { value: "2", label: "Bob Smith", role: "Designer", avatar: "BS" },
  { value: "3", label: "Carol Jones", role: "PM", avatar: "CJ" },
  { value: "4", label: "David Park", role: "Engineer", avatar: "DP" },
  { value: "5", label: "Eve Wilson", role: "Designer", avatar: "EW" },
];

const customFieldOptions = [
  { id: "1", name: "Alice", dept: "Engineering" },
  { id: "2", name: "Bob", dept: "Design" },
  { id: "3", name: "Carol", dept: "Product" },
];

const virtualOptions = Array.from({ length: 10000 }, (_, i) => ({
  value: `item-${i}`,
  label: `Item ${i + 1}`,
}));

export default function AdvanceSelectDemo() {
  const [basicValue, setBasicValue] = useState<unknown>();
  const [searchValue, setSearchValue] = useState<unknown>();
  const [multiValue, setMultiValue] = useState<unknown[]>([]);
  const [tagsValue, setTagsValue] = useState<unknown[]>([]);
  const [groupedValue, setGroupedValue] = useState<unknown>();
  const [disabledValue, setDisabledValue] = useState<unknown>();
  const [loadingValue, setLoadingValue] = useState<unknown>();
  const [smValue, setSmValue] = useState<unknown>();
  const [lgValue, setLgValue] = useState<unknown>();
  const [errorValue, setErrorValue] = useState<unknown>();
  const [warningValue, setWarningValue] = useState<unknown>();
  const [clearableValue, setClearableValue] = useState<unknown>();
  const [maxCountValue, setMaxCountValue] = useState<unknown[]>([]);
  const [maxTagValue, setMaxTagValue] = useState<unknown[]>([
    "apple",
    "banana",
    "cherry",
    "durian",
  ]);
  const [hideSelectedValue, setHideSelectedValue] = useState<unknown[]>([]);
  const [customOptValue, setCustomOptValue] = useState<unknown>();
  const [customTagValue, setCustomTagValue] = useState<unknown[]>([
    "apple",
    "banana",
  ]);
  const [virtualValue, setVirtualValue] = useState<unknown>();
  const [variantOutlined, setVariantOutlined] = useState<unknown>();
  const [variantFilled, setVariantFilled] = useState<unknown>();
  const [variantBorderless, setVariantBorderless] = useState<unknown>();
  const [tokenValue, setTokenValue] = useState<unknown[]>([]);
  const [notFoundValue, setNotFoundValue] = useState<unknown>();
  const [autoClearOn, setAutoClearOn] = useState<unknown[]>([]);
  const [autoClearOff, setAutoClearOff] = useState<unknown[]>([]);
  const [customFieldValue, setCustomFieldValue] = useState<unknown>();
  const [prefixValue, setPrefixValue] = useState<unknown>();
  const [fullValue, setFullValue] = useState<unknown[]>([]);

  // Remote search — simulated async fetch with debounce + loading state.
  const [remoteValue, setRemoteValue] = useState<unknown>();
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [remoteOptions, setRemoteOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const remoteTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  function handleRemoteSearch(q: string) {
    setRemoteLoading(true);
    clearTimeout(remoteTimeout.current);
    remoteTimeout.current = setTimeout(() => {
      if (!q.trim()) {
        setRemoteOptions([]);
      } else {
        setRemoteOptions(
          Array.from({ length: 5 }, (_, i) => ({
            value: `${q}-${i}`,
            label: `${q} result ${i + 1}`,
          })),
        );
      }
      setRemoteLoading(false);
    }, 600);
  }

  // Label in value — capture both the value and its option.
  const [labelValue, setLabelValue] = useState<
    { value: unknown; label: string } | undefined
  >();

  return (
    <>
      {/* 1. Basic */}
      <Story title="Basic" description="Simple single select dropdown.">
        <AdvanceSelect
          value={basicValue}
          onValueChange={(v) => setBasicValue(v)}
          options={basicOptions}
          placeholder="Pick a fruit"
          className="w-64"
        />
      </Story>

      {/* 2. Searchable */}
      <Story
        title="Searchable"
        description="Single select with built-in search filtering."
      >
        <AdvanceSelect
          value={searchValue}
          onValueChange={(v) => setSearchValue(v)}
          options={basicOptions}
          showSearch
          placeholder="Search fruits..."
          className="w-64"
        />
      </Story>

      {/* 3. Multiple */}
      <Story
        title="Multiple"
        description="Select multiple items with tag chips."
      >
        <AdvanceSelect
          value={multiValue}
          onValueChange={(v) => setMultiValue(v as unknown[])}
          mode="multiple"
          options={basicOptions}
          placeholder="Pick fruits"
          className="w-80"
        />
      </Story>

      {/* 4. Tags mode */}
      <Story
        title="Tags"
        description="Create custom tags not in the predefined list."
      >
        <AdvanceSelect
          value={tagsValue}
          onValueChange={(v) => setTagsValue(v as unknown[])}
          mode="tags"
          options={basicOptions}
          placeholder="Type and press enter"
          className="w-80"
        />
      </Story>

      {/* 5. Grouped options */}
      <Story title="Grouped" description="Options organized by country groups.">
        <AdvanceSelect
          value={groupedValue}
          onValueChange={(v) => setGroupedValue(v)}
          options={groupedOptions}
          placeholder="Pick a city"
          className="w-64"
        />
      </Story>

      {/* 6. Disabled options */}
      <Story
        title="Disabled options"
        description="Some items are non-selectable."
      >
        <AdvanceSelect
          value={disabledValue}
          onValueChange={(v) => setDisabledValue(v)}
          options={disabledOptions}
          placeholder="Pick a fruit"
          className="w-64"
        />
      </Story>

      {/* 7. Loading */}
      <Story
        title="Loading"
        description="Shows a spinner in the trigger while loading."
      >
        <AdvanceSelect
          value={loadingValue}
          onValueChange={(v) => setLoadingValue(v)}
          options={[]}
          loading
          placeholder="Loading..."
          className="w-64"
        />
      </Story>

      {/* 8. Size small */}
      <Story
        title="Size: small"
        description="Compact trigger for dense layouts."
      >
        <AdvanceSelect
          value={smValue}
          onValueChange={(v) => setSmValue(v)}
          options={basicOptions}
          size="sm"
          placeholder="Small select"
          className="w-64"
        />
      </Story>

      {/* 9. Size large */}
      <Story
        title="Size: large"
        description="Taller trigger for touch-friendly interfaces."
      >
        <AdvanceSelect
          value={lgValue}
          onValueChange={(v) => setLgValue(v)}
          options={basicOptions}
          size="lg"
          placeholder="Large select"
          className="w-64"
        />
      </Story>

      {/* 10. Status error */}
      <Story
        title="Status: error"
        description="Red border for validation errors."
      >
        <AdvanceSelect
          value={errorValue}
          onValueChange={(v) => setErrorValue(v)}
          options={basicOptions}
          status="error"
          placeholder="Error state"
          className="w-64"
        />
      </Story>

      {/* 11. Status warning */}
      <Story title="Status: warning" description="Amber border for warnings.">
        <AdvanceSelect
          value={warningValue}
          onValueChange={(v) => setWarningValue(v)}
          options={basicOptions}
          status="warning"
          placeholder="Warning state"
          className="w-64"
        />
      </Story>

      {/* 12. Clearable */}
      <Story
        title="Clearable"
        description="Click the X to clear the selection."
      >
        <AdvanceSelect
          value={clearableValue}
          onValueChange={(v) => setClearableValue(v)}
          options={basicOptions}
          allowClear
          placeholder="Pick a fruit"
          className="w-64"
        />
      </Story>

      {/* 13. Max count */}
      <Story title="Max count" description="Limit selection to 3 items.">
        <AdvanceSelect
          value={maxCountValue}
          onValueChange={(v) => setMaxCountValue(v as unknown[])}
          mode="multiple"
          options={basicOptions}
          maxCount={3}
          placeholder="Max 3 fruits"
          className="w-80"
        />
      </Story>

      {/* 14. Max tag count */}
      <Story
        title="Max tag count"
        description="Show only 2 tags, rest collapsed to +N."
      >
        <AdvanceSelect
          value={maxTagValue}
          onValueChange={(v) => setMaxTagValue(v as unknown[])}
          mode="multiple"
          options={basicOptions}
          maxTagCount={2}
          placeholder="Pick fruits"
          className="w-80"
        />
      </Story>

      {/* 15. Hide selected */}
      <Story
        title="Hide selected"
        description="Selected items are hidden from the dropdown list."
      >
        <AdvanceSelect
          value={hideSelectedValue}
          onValueChange={(v) => setHideSelectedValue(v as unknown[])}
          mode="multiple"
          options={basicOptions}
          hideSelected
          placeholder="Pick fruits"
          className="w-80"
        />
      </Story>

      {/* 16. Custom option render */}
      <Story
        title="Custom option render"
        description="Render rich content in dropdown items with avatars."
      >
        <AdvanceSelect
          value={customOptValue}
          onValueChange={(v) => setCustomOptValue(v)}
          options={userOptions}
          showSearch
          placeholder="Pick a user"
          className="w-80"
          renderOption={({ option }) => (
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-full text-xs font-bold">
                {option.avatar}
              </div>
              <div className="flex flex-col">
                <span className="text-sm">{option.label}</span>
                <span className="text-muted-foreground text-xs">
                  {option.role}
                </span>
              </div>
            </div>
          )}
        />
      </Story>

      {/* 17. Custom tag render */}
      <Story
        title="Custom tag render"
        description="Custom badge styling for selected tags."
      >
        <AdvanceSelect
          value={customTagValue}
          onValueChange={(v) => setCustomTagValue(v as unknown[])}
          mode="multiple"
          options={basicOptions}
          className="w-80"
          renderTag={({ label, closable, onClose }) => (
            <Badge variant="outline" className="h-6 gap-1 pr-1 pl-2 text-xs">
              <Star className="size-3 text-amber-500" />
              <span>{label}</span>
              {closable && (
                <span
                  role="button"
                  tabIndex={0}
                  className="hover:bg-muted-foreground/20 inline-flex cursor-pointer items-center rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${label}`}
                  onClick={onClose}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onClose();
                    }
                  }}
                >
                  <X className="size-3" />
                </span>
              )}
            </Badge>
          )}
        />
      </Story>

      {/* 18. Virtual scroll */}
      <Story
        title="Virtual scroll"
        description="10,000 items with CSS content-visibility optimization."
      >
        <AdvanceSelect
          value={virtualValue}
          onValueChange={(v) => setVirtualValue(v)}
          options={virtualOptions}
          showSearch
          placeholder="Search 10,000 items..."
          className="w-80"
        />
      </Story>

      {/* 19. Variants */}
      <Story
        title="Variants"
        description="Outlined (default), filled, and borderless styles."
      >
        <div className="flex w-64 flex-col gap-3">
          <AdvanceSelect
            value={variantOutlined}
            onValueChange={(v) => setVariantOutlined(v)}
            options={basicOptions}
            variant="outlined"
            placeholder="Outlined"
          />
          <AdvanceSelect
            value={variantFilled}
            onValueChange={(v) => setVariantFilled(v)}
            options={basicOptions}
            variant="filled"
            placeholder="Filled"
          />
          <AdvanceSelect
            value={variantBorderless}
            onValueChange={(v) => setVariantBorderless(v)}
            options={basicOptions}
            variant="borderless"
            placeholder="Borderless"
          />
        </div>
      </Story>

      {/* 20. Token separators */}
      <Story
        title="Token separators"
        description="Type 'apple,banana' or press Enter to create multiple tags at once."
      >
        <AdvanceSelect
          value={tokenValue}
          onValueChange={(v) => setTokenValue(v as unknown[])}
          mode="tags"
          options={basicOptions}
          tokenSeparators={[",", " "]}
          placeholder="Type and separate with comma or space"
          className="w-96"
        />
      </Story>

      {/* 21. Not found content */}
      <Story
        title="Not found"
        description="Custom empty state when search yields no results."
      >
        <AdvanceSelect
          value={notFoundValue}
          onValueChange={(v) => setNotFoundValue(v)}
          options={basicOptions}
          showSearch
          notFoundContent="No fruits match your search. Try 'mango'."
          placeholder="Search..."
          className="w-64"
        />
      </Story>

      {/* 22. Auto clear search */}
      <Story
        title="Auto clear search"
        description="Control whether search text clears after selection."
      >
        <div className="flex w-80 flex-col gap-3">
          <AdvanceSelect
            value={autoClearOn}
            onValueChange={(v) => setAutoClearOn(v as unknown[])}
            mode="multiple"
            options={basicOptions}
            showSearch
            placeholder="Auto clears (default)"
          />
          <AdvanceSelect
            value={autoClearOff}
            onValueChange={(v) => setAutoClearOff(v as unknown[])}
            mode="multiple"
            options={basicOptions}
            showSearch
            autoClearSearchValue={false}
            placeholder="Keeps search text"
          />
        </div>
      </Story>

      {/* 23. Custom field names */}
      <Story
        title="Custom field names"
        description="Map option object keys to label/value/group."
      >
        <AdvanceSelect
          value={customFieldValue}
          onValueChange={(v) => setCustomFieldValue(v)}
          options={customFieldOptions}
          fieldNames={{ label: "name", value: "id", group: "dept" }}
          placeholder="Pick an employee"
          className="w-64"
        />
      </Story>

      {/* 24. Remote search */}
      <Story
        title="Remote search"
        description="Simulated async fetch with debounce and loading state."
      >
        <AdvanceSelect
          value={remoteValue}
          onValueChange={(v) => setRemoteValue(v)}
          options={remoteOptions}
          showSearch
          loading={remoteLoading}
          onSearchChange={handleRemoteSearch}
          placeholder="Type to search..."
          className="w-80"
        />
      </Story>

      {/* 25. Label in value */}
      <Story
        title="Label in value"
        description="Value stores both id and label as an object."
      >
        <div className="w-80 space-y-2">
          <AdvanceSelect
            value={labelValue?.value}
            onValueChange={(v, option) =>
              setLabelValue(
                v == null
                  ? undefined
                  : { value: v, label: (option as { label: string }).label },
              )
            }
            options={basicOptions}
            placeholder="Pick a fruit"
            className="w-64"
          />
          <p className="text-muted-foreground text-xs">
            Selected: {labelValue ? JSON.stringify(labelValue) : "none"}
          </p>
        </div>
      </Story>

      {/* 26. Prefix / suffix icons */}
      <Story
        title="Prefix & suffix icons"
        description="Custom icons inside the trigger."
      >
        <AdvanceSelect
          value={prefixValue}
          onValueChange={(v) => setPrefixValue(v)}
          options={basicOptions}
          placeholder="Pick a fruit"
          className="w-64"
          prefix={<Search className="text-muted-foreground size-4" />}
          suffixIcon={<MapPin className="text-muted-foreground size-4" />}
        />
      </Story>

      {/* 27. Full featured */}
      <Story
        title="Full featured"
        description="Multiple mode + search + max count + clearable + custom option render all together."
      >
        <AdvanceSelect
          value={fullValue}
          onValueChange={(v) => setFullValue(v as unknown[])}
          mode="multiple"
          options={userOptions}
          showSearch
          maxCount={5}
          allowClear
          placeholder="Pick team members"
          className="w-96"
          renderOption={({ option }) => (
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-full text-xs font-bold">
                {option.avatar}
              </div>
              <div className="flex flex-col">
                <span className="text-sm">{option.label}</span>
                <span className="text-muted-foreground text-xs">
                  {option.role}
                </span>
              </div>
            </div>
          )}
        />
      </Story>
    </>
  );
}
