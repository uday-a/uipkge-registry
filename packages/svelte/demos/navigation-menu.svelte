<script lang="ts">
  import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
  } from '@svelte-registry/navigation-menu'

  let { story }: { story: string } = $props()

  const features = [
    { title: 'Analytics', href: '#analytics', description: 'Realtime dashboards for every team.' },
    { title: 'Automation', href: '#automation', description: 'Workflows that run themselves.' },
    { title: 'Security', href: '#security', description: 'SSO, audit logs, and granular roles.' },
  ]
</script>

{#if story === 'Default'}
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem value="features">
        <NavigationMenuTrigger>Features</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="grid w-[400px] gap-1 p-1">
            {#each features as f (f.title)}
              <li>
                <NavigationMenuLink href={f.href}>
                  <span class="text-sm font-medium">{f.title}</span>
                  <span class="text-muted-foreground text-xs">{f.description}</span>
                </NavigationMenuLink>
              </li>
            {/each}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem value="pricing">
        <NavigationMenuLink href="#pricing" class="px-4 py-2 text-sm font-medium">
          Pricing
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem value="docs">
        <NavigationMenuTrigger>Docs</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="grid w-[300px] gap-1 p-1">
            <li>
              <NavigationMenuLink href="#quickstart">
                <span class="text-sm font-medium">Quickstart</span>
                <span class="text-muted-foreground text-xs">Up and running in five minutes.</span>
              </NavigationMenuLink>
            </li>
            <li>
              <NavigationMenuLink href="#api">
                <span class="text-sm font-medium">API reference</span>
                <span class="text-muted-foreground text-xs">Every endpoint, documented.</span>
              </NavigationMenuLink>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
{/if}

{#if story === 'Three-column mega menu'}
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem value="products">
        <NavigationMenuTrigger>Products</NavigationMenuTrigger>
        <NavigationMenuContent>
          <div class="grid w-[520px] grid-cols-3 gap-1 p-1">
            {#each ['Platform', 'Developers', 'Enterprise'] as col (col)}
              <div class="rounded-md p-1">
                <p class="text-muted-foreground px-2 py-1.5 text-xs font-semibold tracking-wide uppercase">{col}</p>
                {#each ['Overview', 'Changelog', 'Roadmap'] as link (link)}
                  <NavigationMenuLink href="#{col}-{link}">
                    <span class="text-sm font-medium">{link}</span>
                  </NavigationMenuLink>
                {/each}
              </div>
            {/each}
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem value="company">
        <NavigationMenuTrigger>Company</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="grid w-[240px] gap-1 p-1">
            <li>
              <NavigationMenuLink href="#about"><span class="text-sm font-medium">About</span></NavigationMenuLink>
            </li>
            <li>
              <NavigationMenuLink href="#careers"><span class="text-sm font-medium">Careers</span></NavigationMenuLink>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
{/if}

{#if story === 'Per-item flyouts'}
  <NavigationMenu viewport={false}>
    <NavigationMenuList>
      <NavigationMenuItem value="features">
        <NavigationMenuTrigger>Features</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="grid w-[320px] gap-1">
            {#each features as f (f.title)}
              <li>
                <NavigationMenuLink href={f.href}>
                  <span class="text-sm font-medium">{f.title}</span>
                  <span class="text-muted-foreground text-xs">{f.description}</span>
                </NavigationMenuLink>
              </li>
            {/each}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem value="docs">
        <NavigationMenuLink href="#docs" class="px-4 py-2 text-sm font-medium">Docs</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
{/if}

{#if story === 'With indicator'}
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem value="features">
        <NavigationMenuTrigger>Features</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="grid w-[320px] gap-1 p-1">
            {#each features as f (f.title)}
              <li>
                <NavigationMenuLink href={f.href}>
                  <span class="text-sm font-medium">{f.title}</span>
                </NavigationMenuLink>
              </li>
            {/each}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem value="pricing">
        <NavigationMenuTrigger>Pricing</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="grid w-[240px] gap-1 p-1">
            <li>
              <NavigationMenuLink href="#plans"><span class="text-sm font-medium">Plans</span></NavigationMenuLink>
            </li>
            <li>
              <NavigationMenuLink href="#compare"><span class="text-sm font-medium">Compare</span></NavigationMenuLink>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
    <NavigationMenuIndicator />
  </NavigationMenu>
{/if}
