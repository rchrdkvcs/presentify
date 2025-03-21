<!-- src/components/MarkdownEditor.vue -->
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import CodeMirror from 'codemirror'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/edit/closebrackets'

const props = defineProps<{
  modelValue: string
  plugins?: string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorRef = ref<HTMLTextAreaElement | null>(null)
const editor = ref<CodeMirror.Editor | null>(null)

onMounted(() => {
  if (editorRef.value) {
    editor.value = CodeMirror.fromTextArea(editorRef.value, {
      mode: 'markdown',
      lineNumbers: true,
      lineWrapping: true,
      theme: 'material',
      autoCloseBrackets: true,
    })

    editor.value.setValue(props.modelValue)
    editor.value.on('change', () => {
      if (editor.value) {
        emit('update:modelValue', editor.value.getValue())
      }
    })
  }
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (editor.value && editor.value.getValue() !== newValue) {
      editor.value.setValue(newValue)
    }
  },
)
</script>

<template>
  <div class="markdown-editor">
    <textarea ref="editorRef"></textarea>
  </div>
</template>

<style>
.markdown-editor {
  height: 100%;
}

.markdown-editor .CodeMirror {
  height: 100%;
  font-family: 'Source Code Pro', monospace;
  font-size: 14px;
}
</style>
