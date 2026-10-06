<script lang="ts">
  import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from '@svelte-registry/breadcrumb'
  import { Home, Slash } from '@lucide/svelte'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Default'}
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem><BreadcrumbLink href="#">Components</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
{/if}

{#if story === 'With leading icon'}
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="#" class="flex items-center gap-1">
          <Home class="size-3.5" />
          <span class="sr-only">Home</span>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem><BreadcrumbLink href="#">Settings</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem><BreadcrumbPage>Account</BreadcrumbPage></BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
{/if}

{#if story === 'Custom separator'}
  <div class="space-y-3">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem><BreadcrumbLink href="#">Docs</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator><Slash class="text-muted-foreground/60 size-3.5 -rotate-12" /></BreadcrumbSeparator>
        <BreadcrumbItem><BreadcrumbLink href="#">Guides</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator><Slash class="text-muted-foreground/60 size-3.5 -rotate-12" /></BreadcrumbSeparator>
        <BreadcrumbItem><BreadcrumbPage>Routing</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem><BreadcrumbLink href="#">Library</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator>·</BreadcrumbSeparator>
        <BreadcrumbItem><BreadcrumbLink href="#">UI</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator>·</BreadcrumbSeparator>
        <BreadcrumbItem><BreadcrumbPage>Toggle</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </div>
{/if}

{#if story === 'Long path with ellipsis'}
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem><BreadcrumbLink href="#">Workspace</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem><BreadcrumbLink href="#">2026</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem><BreadcrumbPage>May</BreadcrumbPage></BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
{/if}

{#if story === 'Responsive truncation'}
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
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
      <BreadcrumbItem><BreadcrumbPage>Sales by region</BreadcrumbPage></BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
{/if}
