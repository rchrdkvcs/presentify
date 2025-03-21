<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PresentationComponent from '@/components/PresentationComponent.vue'
import ThemeSelector from '@/components/ThemeSelector.vue'
import { loadSlide, saveSlide } from '@/composables/slideStorage'

const route = useRoute()
const router = useRouter()
const id = ref((route.params.id as string) || '')

const presentation = ref({
  id: '',
  title: 'Untitled Presentation',
  content: '# New Presentation\n\n---\n\n## First Slide',
  theme: 'default',
  lastEdited: null as Date | null,
})

const isSaving = ref(false)
const autoSaveTimer = ref<number | null>(null)
const showPreview = ref(true)

onMounted(async () => {
  if (id.value) {
    const loaded = await loadSlide(id.value)
    if (loaded && !Array.isArray(loaded)) {
      presentation.value = loaded
    } else {
      createNewPresentation()
    }
  } else {
    createNewPresentation()
  }
})

function createNewPresentation() {
  presentation.value = {
    id: crypto.randomUUID(),
    title: 'Untitled Presentation',
    content: '# New Presentation\n\n---\n\n## First Slide',
    theme: 'default',
    lastEdited: null,
  }
  id.value = presentation.value.id
  router.replace(`/editor/${id.value}`)
}

async function savePresentation() {
  isSaving.value = true
  try {
    await saveSlide(presentation.value)
  } catch (error) {
    console.error('Failed to save presentation:', error)
  } finally {
    isSaving.value = false
  }
}

watch(
  () => [presentation.value.content, presentation.value.title, presentation.value.theme],
  () => {
    if (autoSaveTimer.value) {
      clearTimeout(autoSaveTimer.value)
    }
    autoSaveTimer.value = window.setTimeout(savePresentation, 2000)
  },
  { deep: true },
)

function togglePreview() {
  showPreview.value = !showPreview.value
}

function presentSlides() {
  savePresentation()
  router.push(`/present/${id.value}`)
}
</script>

<template>
  <div class="editor-view">
    <header class="editor-header">
      <div class="editor-title">
        <input
          v-model="presentation.title"
          class="title-input"
          placeholder="Untitled Presentation"
          type="text"
        />
      </div>
      <div class="editor-controls">
        <ThemeSelector v-model="presentation.theme" />
        <button class="control-btn" @click="togglePreview">
          {{ showPreview ? 'Hide Preview' : 'Show Preview' }}
        </button>
        <button :disabled="isSaving" class="control-btn" @click="savePresentation">
          {{ isSaving ? 'Saving...' : 'Save' }}
        </button>
        <button class="present-btn" @click="presentSlides">Present</button>
      </div>
    </header>

    <div :class="{ 'show-preview': showPreview }" class="editor-container">
      <div class="markdown-editor">
        <textarea
          v-model="presentation.content"
          class="markdown-textarea"
          placeholder="Enter your markdown content here..."
        ></textarea>
      </div>

      <div v-if="showPreview" class="preview-pane">
        <PresentationComponent
          :markdownContent="presentation.content"
          :theme="presentation.theme"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #eee;
  background-color: #f8f8f8;
}

.title-input {
  font-size: 18px;
  padding: 5px;
  border: 1px solid transparent;
  border-radius: 4px;
  width: 300px;
}

.title-input:focus {
  border-color: #ddd;
  outline: none;
}

.editor-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.control-btn {
  padding: 8px 12px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.present-btn {
  padding: 8px 15px;
  background-color: #4a8bfc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.editor-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.markdown-editor {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

.markdown-textarea {
  width: 100%;
  height: 100%;
  padding: 20px;
  border: none;
  resize: none;
  font-family: 'Source Code Pro', monospace;
  font-size: 14px;
  line-height: 1.6;
}

.preview-pane {
  flex: 1;
  border-left: 1px solid #eee;
  overflow: hidden;
  background-color: #fff;
}

.editor-container:not(.show-preview) .markdown-editor {
  flex: 1;
}

.editor-container.show-preview .markdown-editor {
  flex: 0.5;
}
</style>
