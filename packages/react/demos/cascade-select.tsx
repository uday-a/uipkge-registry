import { useState } from "react";
import Story from "../../components/story/Story";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@react-registry/card";
import { CascadeSelect } from "@react-registry/cascade-select";
import type { CascadeOption } from "@react-registry/cascade-select";

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

export default function CascadeSelectDemo() {
  const [regionValue, setRegionValue] = useState<string[] | null>(null);
  const [categoryValue, setCategoryValue] = useState<string[] | null>(null);
  const [preselectedValue, setPreselectedValue] = useState<string[] | null>([
    "zhejiang",
    "hangzhou",
    "xihu",
  ]);
  const [smValue, setSmValue] = useState<string[] | null>(null);
  const [lgValue, setLgValue] = useState<string[] | null>(null);
  const [shippingValue, setShippingValue] = useState<string[] | null>(null);

  return (
    <>
      <Story
        title="Region picker"
        description="Three-level cascade for province → city → district, as used in address forms."
      >
        <div className="max-w-md space-y-2">
          <CascadeSelect
            value={regionValue}
            onValueChange={setRegionValue}
            options={regionData}
            placeholder="Select a region..."
            className="w-full"
          />
          <p className="text-muted-foreground text-xs">
            Selected: {regionValue?.join(" / ") ?? "none"}
          </p>
        </div>
      </Story>

      <Story
        title="Product category"
        description="E-commerce category drill-down — department → sub-category → product type."
      >
        <div className="max-w-md space-y-2">
          <CascadeSelect
            value={categoryValue}
            onValueChange={setCategoryValue}
            options={categoryData}
            placeholder="Select category..."
            className="w-full"
          />
          <p className="text-muted-foreground text-xs">
            Selected: {categoryValue?.join(" / ") ?? "none"}
          </p>
        </div>
      </Story>

      <Story
        title="Size variants"
        description="Small, default, and large triggers for different form densities."
      >
        <div className="max-w-md space-y-3">
          <CascadeSelect
            value={smValue}
            onValueChange={setSmValue}
            options={regionData}
            size="sm"
            placeholder="Small..."
            className="w-full"
          />
          <CascadeSelect
            options={regionData}
            placeholder="Default..."
            className="w-full"
          />
          <CascadeSelect
            value={lgValue}
            onValueChange={setLgValue}
            options={regionData}
            size="lg"
            placeholder="Large..."
            className="w-full"
          />
        </div>
      </Story>

      <Story
        title="States & restrictions"
        description="Loading spinner, fully disabled control, and individual disabled options in one view."
      >
        <div className="max-w-md space-y-3">
          <CascadeSelect
            options={regionData}
            loading
            placeholder="Loading..."
            className="w-full"
          />
          <CascadeSelect
            options={regionData}
            disabled
            placeholder="Disabled"
            className="w-full"
          />
          <CascadeSelect
            options={restrictedData}
            placeholder="Restricted options..."
            className="w-full"
          />
        </div>
      </Story>

      <Story
        title="Custom separator"
        description="Display the selected path with a ' > ' separator instead of the default ' / '."
      >
        <div className="max-w-md space-y-2">
          <CascadeSelect
            value={preselectedValue}
            onValueChange={setPreselectedValue}
            options={regionData}
            clearable={false}
            separator=" > "
            placeholder="Select a region..."
            className="w-full"
          />
          <p className="text-muted-foreground text-xs">
            Path: {preselectedValue?.join(" > ")}
          </p>
        </div>
      </Story>

      <Story
        title="In context: Shipping address"
        description="Cascade inside a checkout card. Searchable so users can type to find their district quickly."
      >
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Shipping address</CardTitle>
            <CardDescription>
              Select your province, city, and district to calculate delivery.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CascadeSelect
              value={shippingValue}
              onValueChange={setShippingValue}
              options={regionData}
              searchable
              searchPlaceholder="Search districts..."
              placeholder="Select delivery region..."
              className="w-full"
            />
            {shippingValue ? (
              <p className="text-muted-foreground text-xs">
                Delivering to: {shippingValue.join(" / ")}
              </p>
            ) : (
              <p className="text-muted-foreground text-xs">
                No region selected yet.
              </p>
            )}
          </CardContent>
        </Card>
      </Story>
    </>
  );
}
