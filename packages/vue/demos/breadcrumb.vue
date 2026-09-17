<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Home, Slash } from "lucide-vue-next";
</script>

<template>
  <Story
    title="Default"
    description="Links + a final non-link page entry. BreadcrumbSeparator auto-renders a chevron between items."
  >
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem
          ><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem
        >
        <BreadcrumbSeparator />
        <BreadcrumbItem
          ><BreadcrumbLink href="#">Components</BreadcrumbLink></BreadcrumbItem
        >
        <BreadcrumbSeparator />
        <BreadcrumbItem
          ><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem
        >
      </BreadcrumbList>
    </Breadcrumb>
  </Story>

  <Story
    title="With leading icon"
    description="Wrap a Lucide icon in BreadcrumbLink for an iconic Home root."
  >
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#" class="flex items-center gap-1">
            <Home class="size-3.5" />
            <span class="sr-only">Home</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem
          ><BreadcrumbLink href="#">Settings</BreadcrumbLink></BreadcrumbItem
        >
        <BreadcrumbSeparator />
        <BreadcrumbItem
          ><BreadcrumbPage>Account</BreadcrumbPage></BreadcrumbItem
        >
      </BreadcrumbList>
    </Breadcrumb>
  </Story>

  <Story
    title="Custom separator"
    description="Slot any node into BreadcrumbSeparator to override the default chevron — slash, dot, or anything else."
  >
    <div class="space-y-3">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem
            ><BreadcrumbLink href="#">Docs</BreadcrumbLink></BreadcrumbItem
          >
          <BreadcrumbSeparator
            ><Slash class="text-muted-foreground/60 size-3.5 -rotate-12"
          /></BreadcrumbSeparator>
          <BreadcrumbItem
            ><BreadcrumbLink href="#">Guides</BreadcrumbLink></BreadcrumbItem
          >
          <BreadcrumbSeparator
            ><Slash class="text-muted-foreground/60 size-3.5 -rotate-12"
          /></BreadcrumbSeparator>
          <BreadcrumbItem
            ><BreadcrumbPage>Routing</BreadcrumbPage></BreadcrumbItem
          >
        </BreadcrumbList>
      </Breadcrumb>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem
            ><BreadcrumbLink href="#">Library</BreadcrumbLink></BreadcrumbItem
          >
          <BreadcrumbSeparator>·</BreadcrumbSeparator>
          <BreadcrumbItem
            ><BreadcrumbLink href="#">UI</BreadcrumbLink></BreadcrumbItem
          >
          <BreadcrumbSeparator>·</BreadcrumbSeparator>
          <BreadcrumbItem
            ><BreadcrumbPage>Toggle</BreadcrumbPage></BreadcrumbItem
          >
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  </Story>

  <Story
    title="Long path with ellipsis"
    description="Use BreadcrumbEllipsis to collapse middle segments visually."
  >
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem
          ><BreadcrumbLink href="#">Workspace</BreadcrumbLink></BreadcrumbItem
        >
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem
          ><BreadcrumbLink href="#">2026</BreadcrumbLink></BreadcrumbItem
        >
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbPage>May</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </Story>

  <Story
    title="Ellipsis with dropdown"
    description="Wrap BreadcrumbEllipsis in a DropdownMenu to expose the collapsed segments on click."
  >
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem
          ><BreadcrumbLink href="#">Org</BreadcrumbLink></BreadcrumbItem
        >
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              class="hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <BreadcrumbEllipsis />
              <ChevronDown class="size-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Acme Inc</DropdownMenuItem>
              <DropdownMenuItem>Customers</DropdownMenuItem>
              <DropdownMenuItem>Engineering</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem
          ><BreadcrumbLink href="#">Tickets</BreadcrumbLink></BreadcrumbItem
        >
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbPage>#4218</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </Story>

  <Story
    title="Responsive truncation"
    description="Combine hidden / md:inline classes to drop interior segments on small screens — try resizing."
  >
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem
          ><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem
        >
        <BreadcrumbSeparator />
        <BreadcrumbItem class="hidden md:inline-flex">
          <BreadcrumbLink href="#">Reports</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator class="hidden md:inline-flex" />
        <BreadcrumbItem class="hidden md:inline-flex">
          <BreadcrumbLink href="#">Q1 2026</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator class="hidden md:inline-flex" />
        <BreadcrumbItem class="md:hidden">
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator class="md:hidden" />
        <BreadcrumbItem
          ><BreadcrumbPage>Sales by region</BreadcrumbPage></BreadcrumbItem
        >
      </BreadcrumbList>
    </Breadcrumb>
  </Story>
</template>
