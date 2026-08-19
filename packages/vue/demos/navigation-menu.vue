<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Boxes,
  FileText,
  LifeBuoy,
  Rocket,
  Sparkles,
  Workflow,
} from "lucide-vue-next";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
</script>

<template>
  <Story
    title="Default"
    description="Top-level nav with two triggers, each opening a panel of grouped link items."
  >
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid w-72 gap-2 p-4">
              <li>
                <a href="#" class="hover:bg-muted block rounded-md p-2 text-sm"
                  >Introduction</a
                >
              </li>
              <li>
                <a href="#" class="hover:bg-muted block rounded-md p-2 text-sm"
                  >Installation</a
                >
              </li>
              <li>
                <a href="#" class="hover:bg-muted block rounded-md p-2 text-sm"
                  >Typography</a
                >
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid w-72 gap-2 p-4">
              <li>
                <a href="#" class="hover:bg-muted block rounded-md p-2 text-sm"
                  >Button</a
                >
              </li>
              <li>
                <a href="#" class="hover:bg-muted block rounded-md p-2 text-sm"
                  >Card</a
                >
              </li>
              <li>
                <a href="#" class="hover:bg-muted block rounded-md p-2 text-sm"
                  >Dialog</a
                >
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </Story>

  <Story
    title="Three-column mega menu"
    description="Wide content panel split into columns with icons and descriptions for richer navigation."
  >
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Platform</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div class="grid w-[640px] grid-cols-3 gap-3 p-4">
              <a
                href="#"
                class="hover:bg-muted flex flex-col gap-1 rounded-md p-3"
              >
                <div class="flex items-center gap-2 text-sm font-medium">
                  <Sparkles class="size-4" aria-hidden="true" /> Highlights
                </div>
                <p class="text-muted-foreground text-xs">
                  What's new this month.
                </p>
              </a>
              <a
                href="#"
                class="hover:bg-muted flex flex-col gap-1 rounded-md p-3"
              >
                <div class="flex items-center gap-2 text-sm font-medium">
                  <Boxes class="size-4" aria-hidden="true" /> Components
                </div>
                <p class="text-muted-foreground text-xs">
                  Browse the full registry.
                </p>
              </a>
              <a
                href="#"
                class="hover:bg-muted flex flex-col gap-1 rounded-md p-3"
              >
                <div class="flex items-center gap-2 text-sm font-medium">
                  <Workflow class="size-4" aria-hidden="true" /> Blocks
                </div>
                <p class="text-muted-foreground text-xs">Composed sections.</p>
              </a>
              <a
                href="#"
                class="hover:bg-muted flex flex-col gap-1 rounded-md p-3"
              >
                <div class="flex items-center gap-2 text-sm font-medium">
                  <Rocket class="size-4" aria-hidden="true" /> Quickstart
                </div>
                <p class="text-muted-foreground text-xs">Ship in 5 minutes.</p>
              </a>
              <a
                href="#"
                class="hover:bg-muted flex flex-col gap-1 rounded-md p-3"
              >
                <div class="flex items-center gap-2 text-sm font-medium">
                  <FileText class="size-4" aria-hidden="true" /> Guides
                </div>
                <p class="text-muted-foreground text-xs">
                  Long-form tutorials.
                </p>
              </a>
              <a
                href="#"
                class="hover:bg-muted flex flex-col gap-1 rounded-md p-3"
              >
                <div class="flex items-center gap-2 text-sm font-medium">
                  <LifeBuoy class="size-4" aria-hidden="true" /> Support
                </div>
                <p class="text-muted-foreground text-xs">Open an issue.</p>
              </a>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </Story>

  <Story
    title="Standalone link"
    description="NavigationMenuLink renders a single trigger-styled anchor with no popover content."
  >
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" :class="navigationMenuTriggerStyle()">
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" :class="navigationMenuTriggerStyle()">
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" :class="navigationMenuTriggerStyle()">
            Changelog
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </Story>

  <Story
    title="With indicator"
    description="NavigationMenuIndicator renders an animated arrow that follows the active trigger."
  >
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid w-72 gap-2 p-4">
              <li>
                <a href="#" class="hover:bg-muted block rounded-md p-2 text-sm"
                  >Tutorials</a
                >
              </li>
              <li>
                <a href="#" class="hover:bg-muted block rounded-md p-2 text-sm"
                  >Examples</a
                >
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Community</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid w-72 gap-2 p-4">
              <li>
                <a href="#" class="hover:bg-muted block rounded-md p-2 text-sm"
                  >Discord</a
                >
              </li>
              <li>
                <a href="#" class="hover:bg-muted block rounded-md p-2 text-sm"
                  >GitHub</a
                >
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuIndicator />
      </NavigationMenuList>
    </NavigationMenu>
  </Story>

  <Story
    title="Plain link nav"
    description="Header nav using only NavigationMenuLink — no triggers, no popovers, just styled links."
  >
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" :class="navigationMenuTriggerStyle()"
            >Home</NavigationMenuLink
          >
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" :class="navigationMenuTriggerStyle()"
            >Features</NavigationMenuLink
          >
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" :class="navigationMenuTriggerStyle()"
            >Pricing</NavigationMenuLink
          >
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" :class="navigationMenuTriggerStyle()"
            >About</NavigationMenuLink
          >
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" :class="navigationMenuTriggerStyle()"
            >Contact</NavigationMenuLink
          >
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </Story>
</template>
