<script lang="ts">
  import {
    FileUpload,
    FileUploadContent,
    FileUploadItem,
    FileUploadItemName,
    FileUploadItemSize,
  } from '@svelte-registry/file-upload'
  import { CloudUpload, FileText } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  let images = $state<File[]>([])
  let docs = $state<File[]>([])
  let pdfs = $state<File[]>([])
  let customFiles = $state<File[]>([])

  function removeAt(list: File[], idx: number) {
    list.splice(idx, 1)
  }
</script>

{#if story === 'Default'}
  <FileUpload bind:files={images} class="max-w-md" accept="image/*">
    <p class="text-sm font-medium">Drag & drop files here</p>
    <p class="text-muted-foreground mt-1 text-xs">Or click to browse</p>
  </FileUpload>
{/if}

{#if story === 'Multiple files'}
  <FileUpload bind:files={docs} class="max-w-md" multiple>
    <p class="text-sm font-medium">Upload documents</p>
    <p class="text-muted-foreground mt-1 text-xs">PDF, DOC, or images — multiple allowed</p>
    {#snippet content()}
      {#if docs.length}
        <FileUploadContent>
          {#each docs as file, i (file.name + i)}
            <FileUploadItem {file} onremove={() => removeAt(docs, i)} />
          {/each}
        </FileUploadContent>
      {/if}
    {/snippet}
  </FileUpload>
{/if}

{#if story === 'Accept restriction'}
  <FileUpload bind:files={pdfs} class="max-w-md" accept=".pdf,.doc,.docx" multiple>
    <p class="text-sm font-medium">Upload contracts</p>
    <p class="text-muted-foreground mt-1 text-xs">Only PDF and Word files accepted</p>
    {#snippet content()}
      {#if pdfs.length}
        <FileUploadContent>
          {#each pdfs as file, i (file.name + i)}
            <div class="bg-muted/50 flex items-center gap-3 rounded-md border p-3">
              <FileText class="text-muted-foreground size-8 shrink-0" />
              <div class="min-w-0 flex-1">
                <FileUploadItemName>{file.name}</FileUploadItemName>
                <FileUploadItemSize>{(file.size / 1024).toFixed(1)} KB</FileUploadItemSize>
              </div>
            </div>
          {/each}
        </FileUploadContent>
      {/if}
    {/snippet}
  </FileUpload>
{/if}

{#if story === 'Disabled'}
  <FileUpload class="max-w-md" disabled>
    <p class="text-sm font-medium">Uploads are paused</p>
    <p class="text-muted-foreground mt-1 text-xs">Re-enable in your account settings</p>
  </FileUpload>
{/if}

{#if story === 'Custom content'}
  <FileUpload bind:files={customFiles} class="max-w-md" multiple>
    {#snippet icon()}
      <CloudUpload class="text-primary mb-2 size-10" />
    {/snippet}
    <p class="text-sm font-semibold">Drop your assets</p>
    <p class="text-muted-foreground mt-1 text-xs">PNG, JPG, or SVG up to 10 MB each</p>
    {#snippet content()}
      {#if customFiles.length}
        <FileUploadContent>
          {#each customFiles as file, i (file.name + i)}
            <FileUploadItem {file} onremove={() => removeAt(customFiles, i)} />
          {/each}
        </FileUploadContent>
      {/if}
    {/snippet}
  </FileUpload>
{/if}
