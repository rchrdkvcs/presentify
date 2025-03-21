<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import PresentationComponent from '@/components/PresentationComponent.vue'
import { loadSlide } from '@/composables/slideStorage'

const route = useRoute()
const id = ref(route.params.id as string)

const presentation = ref({
  id: '',
  title: '',
  content: '',
  theme: 'default',
  lastEdited: null as Date | null,
})

const isLoading = ref(true)
const error = ref('')
const elapsedTime = ref(0)
const timerInterval = ref<number | null>(null)
const notes = ref<string[]>([])

const formattedTime = computed(() => {
  const minutes = Math.floor(elapsedTime.value / 60)
  const seconds = elapsedTime.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

onMounted(async () => {
  if (!id.value) {
    error.value = 'Invalid presentation ID'
    return
  }

  isLoading.value = true
  try {
    const loaded = await loadSlide(id.value)
    if (loaded && !Array.isArray(loaded)) {
      presentation.value = loaded
      extractNotes(presentation.value.content)
      startTimer()
    } else {
      error.value = 'Presentation not found'
    }
  } catch (e) {
    error.value = 'Error loading presentation'
    console.error(e)
  } finally {
    isLoading.value = false
  }
})

function extractNotes(content: string) {
  // Extract notes from the markdown content
  // Look for "Note:" sections
  const noteRegex = /^Note:(.*)$/gm
  const matches = content.matchAll(noteRegex)

  for (const match of matches) {
    if (match[1]) {
      notes.value.push(match[1].trim())
    }
  }
}

function startTimer() {
  elapsedTime.value = 0
  timerInterval.value = window.setInterval(() => {
    elapsedTime.value++
  }, 1000)
}

function resetTimer() {
  elapsedTime.value = 0
}

// Clean up timer on component unmount
onMounted(() => {
  return () => {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
    }
  }
})
</script>

<template>
  <div class="speaker-view">
    <div v-if="isLoading" class="loading">Loading speaker view...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="speaker-container">
      <header class="speaker-header">
        <h1>{{ presentation.title || 'Untitled Presentation' }}</h1>
        <div class="timer-controls">
          <div class="timer">{{ formattedTime }}</div>
          <button class="timer-button" @click="resetTimer">Reset</button>
        </div>
      </header>

      <div class="speaker-content">
        <div class="current-slide">
          <h3>Current Slide</h3>
          <div class="slide-preview">
            <PresentationComponent
              :markdownContent="presentation.content"
              :theme="presentation.theme"
            />
          </div>
        </div>

        <div class="speaker-notes">
          <h3>Speaker Notes</h3>
          <div v-if="notes.length === 0" class="no-notes">
            No speaker notes available for this slide.
          </div>
          <div v-else class="notes-content">
            <div v-for="(note, index) in notes" :key="index" class="note-item">
              {{ note }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.speaker-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
}

.loading,
.error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
}

.speaker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #ddd;
  background-color: #fff;
}

.speaker-header h1 {
  margin: 0;
  font-size: 20px;
}

.timer-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.timer {
  font-size: 24px;
  font-family: monospace;
  background-color: #333;
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
}

.timer-button {
  padding: 5px 10px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.speaker-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.current-slide,
.speaker-notes {
  flex: 1;
  padding: 15px;
  overflow: auto;
}

.current-slide {
  border-right: 1px solid #ddd;
}

.slide-preview {
  height: 300px;
  overflow: hidden;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
}

.speaker-notes {
  background-color: #fff;
}

.no-notes {
  color: #999;
  font-style: italic;
  padding: 20px;
}

.note-item {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-left: 3px solid #4a8bfc;
  border-radius: 3px;
}
</style>
