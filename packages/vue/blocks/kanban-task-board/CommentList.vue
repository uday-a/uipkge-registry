<script setup lang="ts">
import { ref } from 'vue'
import { Send } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import UserAvatar from './UserAvatar.vue'
import type { CommentItem } from '@/composables/useKanban'

withDefaults(
  defineProps<{
    comments: CommentItem[]
    compact?: boolean
  }>(),
  {
    compact: false,
  },
)

const emit = defineEmits<{
  add: [text: string]
}>()

const newComment = ref('')

function submit() {
  const stripped = newComment.value.replace(/<[^>]*>/g, '').trim()
  if (!stripped) return
  emit('add', newComment.value)
  newComment.value = ''
}
</script>

<template>
  <div data-slot="kanban-board" v-if="comments.length" :class="compact ? 'space-y-3' : 'space-y-4'">
    <div v-for="comment in comments" :key="comment.id" :class="compact ? 'flex gap-2.5' : 'flex gap-3'">
      <UserAvatar :name="comment.author" :color="comment.authorColor" :size="compact ? 'xs' : 'sm'" />
      <div class="min-w-0 flex-1">
        <div class="flex items-baseline gap-2">
          <span :class="compact ? 'text-xs font-semibold' : 'text-sm font-semibold'">
            {{ compact ? comment.author.split(' ')[0] : comment.author }}
          </span>
          <span class="text-muted-foreground text-xs">
            {{ comment.time }}
          </span>
        </div>
        <div
          :class="[
            'rich-text-content prose prose-sm dark:prose-invert mt-0.5 max-w-none',
            compact ? 'text-muted-foreground text-xs leading-relaxed' : 'text-muted-foreground text-sm leading-relaxed',
          ]"
          v-html="comment.text"
        />
      </div>
    </div>
  </div>
  <p v-else :class="compact ? 'text-muted-foreground text-xs' : 'text-muted-foreground text-sm'">No comments yet.</p>

  <div :class="compact ? 'mt-3 flex gap-2' : 'mt-4 flex gap-3 border-t pt-4'">
    <div :class="compact ? 'mt-1' : 'mt-1.5'">
      <UserAvatar name="Admin User" color="bg-chart-1/15 text-chart-1" :size="compact ? 'xs' : 'sm'" />
    </div>
    <div class="min-w-0 flex-1 space-y-2">
      <RichTextEditor
        v-model:model-value="newComment"
        placeholder="Write a comment..."
        :min-height="compact ? '60px' : '80px'"
        :class="compact ? 'text-xs' : 'text-sm'"
      />
      <div class="flex justify-end">
        <Button
          size="sm"
          :class="compact ? 'h-7 gap-1 text-xs' : 'h-8 gap-1.5 text-xs'"
          :disabled="!newComment.replace(/<[^>]*>/g, '').trim()"
          @click="submit"
        >
          <Send class="size-3" />
          Comment
        </Button>
      </div>
    </div>
  </div>
</template>
