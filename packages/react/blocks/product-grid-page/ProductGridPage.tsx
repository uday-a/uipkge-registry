'use client'

import * as React from 'react'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  RotateCcw,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'

interface ProductColor {
  id: string
  name: string
  class: string
  colorCode: string
}

interface Product {
  id: string
  name: string
  brand: string
  category: string
  categoryId: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  badge?: {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  image: string
  colors: ProductColor[]
  createdAt: number
  featuredRank: number
}

interface CategoryOption {
  id: string
  label: string
}

interface BrandOption {
  id: string
  label: string
}

interface ColorOption {
  id: string
  label: string
  class: string
}

export interface ProductGridPageProps extends React.HTMLAttributes<HTMLDivElement> {}

const CATEGORIES: CategoryOption[] = [
  { id: 'sneakers', label: 'Sneakers' },
  { id: 'running', label: 'Running' },
  { id: 'boots', label: 'Boots' },
  { id: 'loafers', label: 'Loafers' },
]

const BRANDS: BrandOption[] = [
  { id: 'Nike', label: 'Nike' },
  { id: 'Adidas', label: 'Adidas' },
  { id: 'New Balance', label: 'New Balance' },
  { id: 'Salomon', label: 'Salomon' },
]

const COLORS: ColorOption[] = [
  { id: 'black', label: 'Black', class: 'bg-zinc-950 dark:bg-zinc-900 border-zinc-800' },
  { id: 'white', label: 'White', class: 'bg-zinc-100 dark:bg-zinc-200 border-zinc-300' },
  { id: 'sage', label: 'Sage', class: 'bg-emerald-800 border-emerald-700' },
  { id: 'navy', label: 'Navy', class: 'bg-slate-900 border-slate-800' },
  { id: 'amber', label: 'Amber', class: 'bg-amber-600 border-amber-500' },
]

const RATING_OPTIONS = [
  { value: 4.8, label: '4.8 stars & above' },
  { value: 4.5, label: '4.5 stars & above' },
  { value: 4.0, label: '4.0 stars & above' },
]

const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'XT-6 GORE-TEX Trail Running Shoe',
    brand: 'Salomon',
    category: 'Running',
    categoryId: 'running',
    price: 220,
    originalPrice: 245,
    rating: 4.9,
    reviewCount: 128,
    badge: { label: 'Best Seller', variant: 'default' },
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80',
    colors: [
      { id: 'c1', name: 'Black', class: 'bg-zinc-950 dark:bg-zinc-900', colorCode: 'black' },
      { id: 'c2', name: 'Sage', class: 'bg-emerald-800', colorCode: 'sage' },
      { id: 'c3', name: 'Navy', class: 'bg-slate-900', colorCode: 'navy' },
    ],
    createdAt: 1708000000000,
    featuredRank: 1,
  },
  {
    id: 'prod-2',
    name: 'Air Max Pulse Premium',
    brand: 'Nike',
    category: 'Sneakers',
    categoryId: 'sneakers',
    price: 150,
    originalPrice: 180,
    rating: 4.8,
    reviewCount: 94,
    badge: { label: '-20% OFF', variant: 'destructive' },
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=700&auto=format&fit=crop&q=80',
    colors: [
      { id: 'c4', name: 'White', class: 'bg-zinc-100 dark:bg-zinc-200 border border-zinc-300', colorCode: 'white' },
      { id: 'c5', name: 'Black', class: 'bg-zinc-950 dark:bg-zinc-900', colorCode: 'black' },
      { id: 'c6', name: 'Amber', class: 'bg-amber-600', colorCode: 'amber' },
    ],
    createdAt: 1708500000000,
    featuredRank: 2,
  },
  {
    id: 'prod-3',
    name: '990v6 Made in USA Core Sneaker',
    brand: 'New Balance',
    category: 'Sneakers',
    categoryId: 'sneakers',
    price: 200,
    rating: 4.9,
    reviewCount: 215,
    badge: { label: 'New', variant: 'secondary' },
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=700&auto=format&fit=crop&q=80',
    colors: [
      { id: 'c7', name: 'Sage', class: 'bg-emerald-800', colorCode: 'sage' },
      { id: 'c8', name: 'White', class: 'bg-zinc-100 dark:bg-zinc-200 border border-zinc-300', colorCode: 'white' },
      { id: 'c9', name: 'Navy', class: 'bg-slate-900', colorCode: 'navy' },
    ],
    createdAt: 1709000000000,
    featuredRank: 3,
  },
  {
    id: 'prod-4',
    name: 'Ultraboost Light Performance Runner',
    brand: 'Adidas',
    category: 'Running',
    categoryId: 'running',
    price: 190,
    originalPrice: 210,
    rating: 4.7,
    reviewCount: 86,
    image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=700&auto=format&fit=crop&q=80',
    colors: [
      { id: 'c10', name: 'Black', class: 'bg-zinc-950 dark:bg-zinc-900', colorCode: 'black' },
      { id: 'c11', name: 'White', class: 'bg-zinc-100 dark:bg-zinc-200 border border-zinc-300', colorCode: 'white' },
    ],
    createdAt: 1707000000000,
    featuredRank: 4,
  },
  {
    id: 'prod-5',
    name: 'Tor Ultra Hi Waterproof Boot',
    brand: 'Salomon',
    category: 'Boots',
    categoryId: 'boots',
    price: 260,
    rating: 4.8,
    reviewCount: 62,
    badge: { label: 'Trending', variant: 'outline' },
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=700&auto=format&fit=crop&q=80',
    colors: [
      { id: 'c12', name: 'Black', class: 'bg-zinc-950 dark:bg-zinc-900', colorCode: 'black' },
      { id: 'c13', name: 'Amber', class: 'bg-amber-600', colorCode: 'amber' },
    ],
    createdAt: 1708800000000,
    featuredRank: 5,
  },
  {
    id: 'prod-6',
    name: 'Penny Lug Leather Loafer',
    brand: 'Adidas',
    category: 'Loafers',
    categoryId: 'loafers',
    price: 160,
    originalPrice: 190,
    rating: 4.5,
    reviewCount: 41,
    badge: { label: 'Sale', variant: 'destructive' },
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=700&auto=format&fit=crop&q=80',
    colors: [
      { id: 'c14', name: 'Black', class: 'bg-zinc-950 dark:bg-zinc-900', colorCode: 'black' },
      { id: 'c15', name: 'Navy', class: 'bg-slate-900', colorCode: 'navy' },
    ],
    createdAt: 1706000000000,
    featuredRank: 6,
  },
  {
    id: 'prod-7',
    name: 'Fresh Foam X Trail 574 v2',
    brand: 'New Balance',
    category: 'Running',
    categoryId: 'running',
    price: 135,
    originalPrice: 155,
    rating: 4.6,
    reviewCount: 78,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=700&auto=format&fit=crop&q=80',
    colors: [
      { id: 'c16', name: 'Sage', class: 'bg-emerald-800', colorCode: 'sage' },
      { id: 'c17', name: 'Amber', class: 'bg-amber-600', colorCode: 'amber' },
      { id: 'c18', name: 'White', class: 'bg-zinc-100 dark:bg-zinc-200 border border-zinc-300', colorCode: 'white' },
    ],
    createdAt: 1707500000000,
    featuredRank: 7,
  },
  {
    id: 'prod-8',
    name: 'Tech Fleece Runner Low Boot',
    brand: 'Nike',
    category: 'Boots',
    categoryId: 'boots',
    price: 185,
    rating: 4.7,
    reviewCount: 53,
    badge: { label: 'New', variant: 'secondary' },
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=700&auto=format&fit=crop&q=80',
    colors: [
      { id: 'c19', name: 'Black', class: 'bg-zinc-950 dark:bg-zinc-900', colorCode: 'black' },
      { id: 'c20', name: 'Navy', class: 'bg-slate-900', colorCode: 'navy' },
      { id: 'c21', name: 'Sage', class: 'bg-emerald-800', colorCode: 'sage' },
    ],
    createdAt: 1708900000000,
    featuredRank: 8,
  },
]

export function ProductGridPage({ className, ...props }: ProductGridPageProps) {
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([])
  const [priceRange, setPriceRange] = React.useState<number[]>([50, 300])
  const [selectedColors, setSelectedColors] = React.useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = React.useState<string[]>([])
  const [minRating, setMinRating] = React.useState<number>(0)
  const [sortBy, setSortBy] = React.useState<string>('featured')
  const [wishlistIds, setWishlistIds] = React.useState<Set<string>>(new Set(['prod-1', 'prod-5']))
  const [addedToCartIds, setAddedToCartIds] = React.useState<Set<string>>(new Set())
  const [activeProductColors, setActiveProductColors] = React.useState<Record<string, string>>({})
  const [page, setPage] = React.useState<number>(1)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState<boolean>(false)

  const totalPages = 3

  const toggleCategory = (id: string, checked: boolean) => {
    setSelectedCategories((prev) => (checked ? [...prev, id] : prev.filter((item) => item !== id)))
    setPage(1)
  }

  const toggleBrand = (id: string, checked: boolean) => {
    setSelectedBrands((prev) => (checked ? [...prev, id] : prev.filter((item) => item !== id)))
    setPage(1)
  }

  const toggleColor = (id: string) => {
    setSelectedColors((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
    setPage(1)
  }

  const setRating = (val: number) => {
    setMinRating((prev) => (prev === val ? 0 : val))
    setPage(1)
  }

  const toggleWishlist = (id: string) => {
    setWishlistIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const addToCart = (id: string) => {
    setAddedToCartIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
    setTimeout(() => {
      setAddedToCartIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 1600)
  }

  const selectProductColor = (productId: string, colorCode: string) => {
    setActiveProductColors((prev) => ({
      ...prev,
      [productId]: colorCode,
    }))
  }

  const resetFilters = () => {
    setSelectedCategories([])
    setPriceRange([50, 300])
    setSelectedColors([])
    setSelectedBrands([])
    setMinRating(0)
    setPage(1)
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedColors.length > 0 ||
    minRating > 0 ||
    priceRange[0] > 50 ||
    priceRange[1] < 300

  const activeFilterCount =
    selectedCategories.length +
    selectedBrands.length +
    selectedColors.length +
    (minRating > 0 ? 1 : 0) +
    (priceRange[0] > 50 || priceRange[1] < 300 ? 1 : 0)

  const getCategoryCount = (catId: string) => PRODUCTS.filter((p) => p.categoryId === catId).length
  const getBrandCount = (brand: string) => PRODUCTS.filter((p) => p.brand === brand).length

  const filteredProducts = React.useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.categoryId)) {
        return false
      }
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false
      }
      if (selectedColors.length > 0) {
        const hasMatchingColor = product.colors.some((c) => selectedColors.includes(c.colorCode))
        if (!hasMatchingColor) return false
      }
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false
      }
      if (minRating > 0 && product.rating < minRating) {
        return false
      }
      return true
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'rating-desc') return b.rating - a.rating
      if (sortBy === 'newest') return b.createdAt - a.createdAt
      return a.featuredRank - b.featuredRank
    })
  }, [selectedCategories, priceRange, selectedColors, selectedBrands, minRating, sortBy])

  const renderFilterControls = (isMobile: boolean) => (
    <div className="space-y-6">
      {/* Categories */}
      <div className="space-y-3">
        <h3 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Category</h3>
        <div className="space-y-2.5">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between">
              <label
                htmlFor={`${isMobile ? 'mobile-' : ''}cat-${cat.id}`}
                className="text-foreground flex cursor-pointer items-center gap-2 text-sm"
              >
                <Checkbox
                  id={`${isMobile ? 'mobile-' : ''}cat-${cat.id}`}
                  checked={selectedCategories.includes(cat.id)}
                  onCheckedChange={(checked) => toggleCategory(cat.id, checked === true)}
                />
                <span>{cat.label}</span>
              </label>
              <span className="text-muted-foreground text-xs tabular-nums">{getCategoryCount(cat.id)}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Price Range</h3>
          <span className="text-foreground text-xs font-medium tabular-nums">
            ${priceRange[0]} – ${priceRange[1]}
          </span>
        </div>
        <Slider
          value={priceRange}
          onValueChange={(val) => setPriceRange(val)}
          min={50}
          max={300}
          step={5}
          range
          className="py-2"
        />
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>$50</span>
          <span>$300</span>
        </div>
      </div>

      <Separator />

      {/* Colors */}
      <div className="space-y-3">
        <h3 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Color</h3>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color.id}
              type="button"
              title={color.label}
              className={cn(
                'focus-visible:ring-ring relative flex size-7 items-center justify-center rounded-full border transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:outline-none',
                color.class,
                selectedColors.includes(color.id)
                  ? 'ring-primary ring-offset-background ring-2 ring-offset-2'
                  : 'border-border',
              )}
              onClick={() => toggleColor(color.id)}
            >
              {selectedColors.includes(color.id) && (
                <Check className={cn('size-3.5', color.id === 'white' ? 'text-zinc-950' : 'text-white')} />
              )}
              <span className="sr-only">{color.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brands */}
      <div className="space-y-3">
        <h3 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Brand</h3>
        <div className="space-y-2.5">
          {BRANDS.map((b) => (
            <div key={b.id} className="flex items-center justify-between">
              <label
                htmlFor={`${isMobile ? 'mobile-' : ''}brand-${b.id}`}
                className="text-foreground flex cursor-pointer items-center gap-2 text-sm"
              >
                <Checkbox
                  id={`${isMobile ? 'mobile-' : ''}brand-${b.id}`}
                  checked={selectedBrands.includes(b.id)}
                  onCheckedChange={(checked) => toggleBrand(b.id, checked === true)}
                />
                <span>{b.label}</span>
              </label>
              <span className="text-muted-foreground text-xs tabular-nums">{getBrandCount(b.id)}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div className="space-y-3">
        <h3 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Customer Rating</h3>
        <div className="space-y-1.5">
          {RATING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={cn(
                'hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs transition-colors',
                minRating === opt.value ? 'bg-muted text-foreground font-medium' : 'text-muted-foreground',
              )}
              onClick={() => setRating(opt.value)}
            >
              <div className="flex items-center gap-1.5">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <span>{opt.label}</span>
              </div>
              {minRating === opt.value && <Check className="text-primary size-3.5" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div data-slot="product-grid-page" className={cn('w-full space-y-8', className)} {...props}>
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="inline-flex min-h-6 items-center">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="inline-flex min-h-6 items-center">
              Shop
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Footwear</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header & Toolbar */}
      <div className="border-border flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">All Footwear</h1>
            <Badge variant="secondary" className="font-normal tabular-nums">
              {filteredProducts.length} items
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Engineered for performance, trail endurance, and everyday urban utility.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Filter Drawer */}
          <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 md:hidden">
                <SlidersHorizontal className="size-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs overflow-y-auto p-6">
              <SheetHeader className="text-left">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-base font-semibold">Filters</SheetTitle>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground h-auto p-0 text-xs font-normal"
                      onClick={resetFilters}
                    >
                      Reset all
                    </Button>
                  )}
                </div>
                <SheetDescription className="text-xs">
                  Narrow down footwear by category, price, and specs.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">{renderFilterControls(true)}</div>
            </SheetContent>
          </Sheet>

          {/* Sort Select */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground hidden text-xs sm:inline-block">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-9 w-44 text-xs sm:text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating-desc">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 2-Column Main Layout */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr]">
        {/* Left Desktop Sidebar */}
        <aside className="hidden space-y-6 md:block" aria-label="Product filters">
          <div className="flex items-center justify-between">
            <h2 className="text-foreground text-sm font-semibold tracking-tight">Filters</h2>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground h-auto p-0 text-xs font-normal"
                onClick={resetFilters}
              >
                Reset all
              </Button>
            )}
          </div>

          <Separator />
          {renderFilterControls(false)}
        </aside>

        {/* Right Product Grid Area */}
        <section className="min-w-0 space-y-6">
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {selectedCategories.map((catId) => (
                <Badge key={catId} variant="secondary" className="gap-1.5 py-1 text-xs">
                  <span>Category: {CATEGORIES.find((c) => c.id === catId)?.label}</span>
                  <button
                    type="button"
                    className="hover:text-foreground text-muted-foreground focus-visible:outline-none"
                    aria-label="Remove category filter"
                    onClick={() => toggleCategory(catId, false)}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}

              {selectedBrands.map((brand) => (
                <Badge key={brand} variant="secondary" className="gap-1.5 py-1 text-xs">
                  <span>Brand: {brand}</span>
                  <button
                    type="button"
                    className="hover:text-foreground text-muted-foreground focus-visible:outline-none"
                    aria-label="Remove brand filter"
                    onClick={() => toggleBrand(brand, false)}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}

              {selectedColors.map((colorId) => (
                <Badge key={colorId} variant="secondary" className="gap-1.5 py-1 text-xs">
                  <span>Color: {COLORS.find((c) => c.id === colorId)?.label}</span>
                  <button
                    type="button"
                    className="hover:text-foreground text-muted-foreground focus-visible:outline-none"
                    aria-label="Remove color filter"
                    onClick={() => toggleColor(colorId)}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}

              {minRating > 0 && (
                <Badge variant="secondary" className="gap-1.5 py-1 text-xs">
                  <span>Rating: {minRating}+ Stars</span>
                  <button
                    type="button"
                    className="hover:text-foreground text-muted-foreground focus-visible:outline-none"
                    aria-label="Remove rating filter"
                    onClick={() => setMinRating(0)}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              )}

              {(priceRange[0] > 50 || priceRange[1] < 300) && (
                <Badge variant="secondary" className="gap-1.5 py-1 text-xs">
                  <span>
                    Price: ${priceRange[0]} - ${priceRange[1]}
                  </span>
                  <button
                    type="button"
                    className="hover:text-foreground text-muted-foreground focus-visible:outline-none"
                    aria-label="Reset price filter"
                    onClick={() => setPriceRange([50, 300])}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              )}

              <Button
                variant="link"
                size="sm"
                className="text-muted-foreground hover:text-foreground h-auto px-1 text-xs"
                onClick={resetFilters}
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
              <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
                <RotateCcw className="size-6" />
              </div>
              <h3 className="text-foreground mt-4 text-base font-semibold">No matching footwear found</h3>
              <p className="text-muted-foreground mt-1 max-w-sm text-xs sm:text-sm">
                Try adjusting your price range, clearing selected colors, or resetting your filters to see more results.
              </p>
              <Button variant="outline" size="sm" className="mt-4 gap-2" onClick={resetFilters}>
                <RotateCcw className="size-3.5" />
                <span>Reset filters</span>
              </Button>
            </div>
          ) : (
            /* 3-Column Product Grid */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group border-border bg-card hover:border-border/80 relative flex flex-col overflow-hidden rounded-xl border p-3 shadow-xs transition-all duration-200 hover:shadow-md"
                >
                  {/* Image Aspect Square Container */}
                  <div className="bg-muted/40 relative aspect-square w-full overflow-hidden rounded-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Top Left Badge */}
                    {product.badge && (
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <Badge variant={product.badge.variant} className="text-xs shadow-xs">
                          {product.badge.label}
                        </Badge>
                      </div>
                    )}

                    {/* Top Right Wishlist Heart */}
                    <button
                      type="button"
                      aria-label="Toggle wishlist"
                      className={cn(
                        'bg-background/80 hover:bg-background text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute top-2.5 right-2.5 z-10 flex size-8 items-center justify-center rounded-full shadow-xs backdrop-blur-xs transition-colors focus-visible:ring-2 focus-visible:outline-none',
                        wishlistIds.has(product.id) && 'text-red-500 hover:text-red-600',
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleWishlist(product.id)
                      }}
                    >
                      <Heart
                        className={cn(
                          'size-4 transition-transform active:scale-90',
                          wishlistIds.has(product.id) && 'fill-current',
                        )}
                      />
                    </button>

                    {/* Quick Add Button (Visible on hover & focus) */}
                    <div className="absolute inset-x-2.5 bottom-2.5 z-10 opacity-100 sm:translate-y-2 sm:opacity-0 sm:transition-all sm:duration-200 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                      <Button
                        size="sm"
                        className="w-full gap-1.5 text-xs font-medium shadow-sm"
                        variant="default"
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart(product.id)
                        }}
                      >
                        {addedToCartIds.has(product.id) ? (
                          <>
                            <Check className="size-3.5" />
                            <span>Added to Cart</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="size-3.5" />
                            <span>Quick Add</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="mt-3 flex flex-1 flex-col justify-between space-y-2">
                    <div>
                      {/* Color swatches preview */}
                      <div className="flex items-center gap-1.5">
                        {product.colors.map((color) => (
                          <button
                            key={color.id}
                            type="button"
                            title={color.name}
                            className={cn(
                              'size-6 rounded-full transition-transform hover:scale-125 focus-visible:outline-none',
                              color.class,
                              activeProductColors[product.id] === color.colorCode
                                ? 'ring-1.5 ring-primary ring-offset-background ring-offset-1'
                                : '',
                            )}
                            onClick={(e) => {
                              e.stopPropagation()
                              selectProductColor(product.id, color.colorCode)
                            }}
                          >
                            <span className="sr-only">{color.name}</span>
                          </button>
                        ))}
                        <span className="text-muted-foreground ml-1 text-xs">
                          {product.colors.length} {product.colors.length === 1 ? 'color' : 'colors'}
                        </span>
                      </div>

                      {/* Brand & Category */}
                      <div className="text-muted-foreground mt-2 flex items-center justify-between text-xs">
                        <span>
                          {product.brand} · {product.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                          <span className="text-foreground font-medium">{product.rating}</span>
                          <span className="text-muted-foreground">({product.reviewCount})</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3
                        className="text-foreground group-hover:text-primary mt-1 line-clamp-1 cursor-pointer text-sm font-medium transition-colors"
                        title={product.name}
                      >
                        {product.name}
                      </h3>
                    </div>

                    {/* Price Row */}
                    <div className="flex min-w-0 flex-wrap items-baseline gap-2 pt-1">
                      <span className="text-foreground text-base font-semibold">${product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="text-muted-foreground text-xs line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                      {product.originalPrice && (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          Save ${(product.originalPrice - product.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Footer */}
          {filteredProducts.length > 0 && (
            <nav className="border-border flex items-center justify-between border-t pt-6" aria-label="Pagination">
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-xs"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="size-4" />
                <span>Previous</span>
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <Button
                    key={n}
                    variant={n === page ? 'outline' : 'ghost'}
                    size="sm"
                    className="size-8 p-0 text-xs tabular-nums"
                    aria-current={n === page ? 'page' : undefined}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-xs"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <span>Next</span>
                <ChevronRight className="size-4" />
              </Button>
            </nav>
          )}
        </section>
      </div>
    </div>
  )
}
