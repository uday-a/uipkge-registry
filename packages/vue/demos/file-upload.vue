<script setup lang="ts">
import { ref } from 'vue'
import {
  FileUpload,
  FileUploadContent,
  FileUploadItem,
  FileUploadItemName,
  FileUploadItemSize,
} from '@/components/ui/file-upload'
import { UploadCloud, FileText } from 'lucide-vue-next'

const images = ref<File[]>([])
const docs = ref<File[]>([])
const pdfs = ref<File[]>([])
const customFiles = ref<File[]>([])

function removeAt(list: File[], idx: number) {
  list.splice(idx, 1)
}
</script>

<template>
  <Story title="Default" description="Drop zone restricted to image files with click-to-browse fallback.">
    <FileUpload v-model="images" class="max-w-md" accept="image/*">
      <p class="text-sm font-medium">Drag & drop files here</p>
      <p class="text-muted-foreground mt-1 text-xs">Or click to browse</p>
    </FileUpload>
  </Story>

  <Story
    title="Multiple files"
    description="Multiple uploads with each file rendered using FileUploadItem and remove button."
  >
    <FileUpload v-model="docs" class="max-w-md" multiple>
      <p class="text-sm font-medium">Upload documents</p>
      <p class="text-muted-foreground mt-1 text-xs">PDF, DOC, or images — multiple allowed</p>
      <template #content>
        <FileUploadContent v-if="docs.length">
          <FileUploadItem
            v-for="(file, i) in docs"
            :key="file.name + i"
            :model-value="file"
            @remove="removeAt(docs, i)"
          />
        </FileUploadContent>
      </template>
    </FileUpload>
  </Story>

  <Story
    title="Accept restriction"
    description="The accept prop limits the picker and renders the rule under the prompt."
  >
    <FileUpload v-model="pdfs" class="max-w-md" accept=".pdf,.doc,.docx" multiple>
      <p class="text-sm font-medium">Upload contracts</p>
      <p class="text-muted-foreground mt-1 text-xs">Only PDF and Word files accepted</p>
      <template #content>
        <FileUploadContent v-if="pdfs.length">
          <div
            v-for="(file, i) in pdfs"
            :key="file.name + i"
            class="bg-muted/50 flex items-center gap-3 rounded-md border p-3"
          >
            <FileText class="text-muted-foreground size-8 shrink-0" />
            <div class="min-w-0 flex-1">
              <FileUploadItemName>{{ file.name }}</FileUploadItemName>
              <FileUploadItemSize>{{ (file.size / 1024).toFixed(1) }} KB</FileUploadItemSize>
            </div>
          </div>
        </FileUploadContent>
      </template>
    </FileUpload>
  </Story>

  <Story title="Disabled" description="Pointer events and click-to-browse are suppressed; the dropzone dims to 50%.">
    <FileUpload class="max-w-md" disabled>
      <p class="text-sm font-medium">Uploads are paused</p>
      <p class="text-muted-foreground mt-1 text-xs">Re-enable in your account settings</p>
    </FileUpload>
  </Story>

  <Story title="Custom content" description="Override the default icon and prompt slots for a branded dropzone.">
    <FileUpload v-model="customFiles" class="max-w-md" multiple>
      <template #icon>
        <UploadCloud class="text-primary mb-2 size-10" />
      </template>
      <p class="text-sm font-semibold">Drop your assets</p>
      <p class="text-muted-foreground mt-1 text-xs">PNG, JPG, or SVG up to 10 MB each</p>
      <template #content>
        <FileUploadContent v-if="customFiles.length">
          <FileUploadItem
            v-for="(file, i) in customFiles"
            :key="file.name + i"
            :model-value="file"
            @remove="removeAt(customFiles, i)"
          />
        </FileUploadContent>
      </template>
    </FileUpload>
  </Story>
</template>
