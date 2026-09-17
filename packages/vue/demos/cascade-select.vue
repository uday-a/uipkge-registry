<script setup lang="ts">
import { ref } from "vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CascadeSelect } from "@/components/ui/cascade-select";
import type { CascadeOption } from "@/components/ui/cascade-select";

const regionValue = ref<string[] | null>(null);
const categoryValue = ref<string[] | null>(null);
const preselectedValue = ref<string[]>(["zhejiang", "hangzhou", "xihu"]);
const smValue = ref<string[] | null>(null);
const lgValue = ref<string[] | null>(null);
const shippingValue = ref<string[] | null>(null);

const regionData: CascadeOption[] = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          { value: "xihu", label: "West Lake" },
          { value: "binjiang", label: "Binjiang" },
        ],
      },
      {
        value: "ningbo",
        label: "Ningbo",
        children: [
          { value: "haishu", label: "Haishu" },
          { value: "jiangbei", label: "Jiangbei" },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          { value: "xuanwu", label: "Xuanwu" },
          { value: "gulou", label: "Gulou" },
        ],
      },
      {
        value: "suzhou",
        label: "Suzhou",
        children: [
          { value: "gusu", label: "Gusu" },
          { value: "wuzhong", label: "Wuzhong" },
        ],
      },
    ],
  },
  {
    value: "guangdong",
    label: "Guangdong",
    children: [
      {
        value: "guangzhou",
        label: "Guangzhou",
        children: [
          { value: "tianhe", label: "Tianhe" },
          { value: "yuexiu", label: "Yuexiu" },
        ],
      },
      {
        value: "shenzhen",
        label: "Shenzhen",
        children: [
          { value: "nanshan", label: "Nanshan" },
          { value: "futian", label: "Futian" },
        ],
      },
    ],
  },
];

const categoryData: CascadeOption[] = [
  {
    value: "electronics",
    label: "Electronics",
    children: [
      {
        value: "phones",
        label: "Phones",
        children: [
          { value: "iphone", label: "iPhone" },
          { value: "android", label: "Android" },
        ],
      },
      {
        value: "laptops",
        label: "Laptops",
        children: [
          { value: "macbook", label: "MacBook" },
          { value: "windows", label: "Windows" },
        ],
      },
    ],
  },
  {
    value: "clothing",
    label: "Clothing",
    children: [
      {
        value: "mens",
        label: "Men's",
        children: [
          { value: "shirts", label: "Shirts" },
          { value: "pants", label: "Pants" },
        ],
      },
      {
        value: "womens",
        label: "Women's",
        children: [
          { value: "dresses", label: "Dresses" },
          { value: "tops", label: "Tops" },
        ],
      },
    ],
  },
];

const restrictedData: CascadeOption[] = [
  {
    value: "level1",
    label: "Level 1",
    children: [
      { value: "l1-a", label: "Option A", disabled: true },
      { value: "l1-b", label: "Option B" },
    ],
  },
];
</script>

<template>
  <Story
    title="Region picker"
    description="Three-level cascade for province → city → district, as used in address forms."
  >
    <div class="max-w-md space-y-2">
      <CascadeSelect
        v-model="regionValue"
        :options="regionData"
        placeholder="Select a region..."
        class="w-full"
      />
      <p class="text-muted-foreground text-xs">
        Selected: {{ regionValue?.join(" / ") ?? "none" }}
      </p>
    </div>
  </Story>

  <Story
    title="Product category"
    description="E-commerce category drill-down — department → sub-category → product type."
  >
    <div class="max-w-md space-y-2">
      <CascadeSelect
        v-model="categoryValue"
        :options="categoryData"
        placeholder="Select category..."
        class="w-full"
      />
      <p class="text-muted-foreground text-xs">
        Selected: {{ categoryValue?.join(" / ") ?? "none" }}
      </p>
    </div>
  </Story>

  <Story
    title="Size variants"
    description="Small, default, and large triggers for different form densities."
  >
    <div class="max-w-md space-y-3">
      <CascadeSelect
        v-model="smValue"
        :options="regionData"
        size="sm"
        placeholder="Small..."
        class="w-full"
      />
      <CascadeSelect
        :options="regionData"
        placeholder="Default..."
        class="w-full"
      />
      <CascadeSelect
        v-model="lgValue"
        :options="regionData"
        size="lg"
        placeholder="Large..."
        class="w-full"
      />
    </div>
  </Story>

  <Story
    title="States & restrictions"
    description="Loading spinner, fully disabled control, and individual disabled options in one view."
  >
    <div class="max-w-md space-y-3">
      <CascadeSelect
        :options="regionData"
        loading
        placeholder="Loading..."
        class="w-full"
      />
      <CascadeSelect
        :options="regionData"
        disabled
        placeholder="Disabled"
        class="w-full"
      />
      <CascadeSelect
        :options="restrictedData"
        placeholder="Restricted options..."
        class="w-full"
      />
    </div>
  </Story>

  <Story
    title="Custom separator"
    description="Display the selected path with a ' > ' separator instead of the default ' / '."
  >
    <div class="max-w-md space-y-2">
      <CascadeSelect
        v-model="preselectedValue"
        :options="regionData"
        :clearable="false"
        separator=" > "
        placeholder="Select a region..."
        class="w-full"
      />
      <p class="text-muted-foreground text-xs">
        Path: {{ preselectedValue.join(" > ") }}
      </p>
    </div>
  </Story>

  <Story
    title="In context: Shipping address"
    description="Cascade inside a checkout card. Searchable so users can type to find their district quickly."
  >
    <Card class="max-w-md">
      <CardHeader>
        <CardTitle>Shipping address</CardTitle>
        <CardDescription
          >Select your province, city, and district to calculate
          delivery.</CardDescription
        >
      </CardHeader>
      <CardContent class="space-y-4">
        <CascadeSelect
          v-model="shippingValue"
          :options="regionData"
          searchable
          search-placeholder="Search districts..."
          placeholder="Select delivery region..."
          class="w-full"
        />
        <p v-if="shippingValue" class="text-muted-foreground text-xs">
          Delivering to: {{ shippingValue.join(" / ") }}
        </p>
        <p v-else class="text-muted-foreground text-xs">
          No region selected yet.
        </p>
      </CardContent>
    </Card>
  </Story>
</template>
