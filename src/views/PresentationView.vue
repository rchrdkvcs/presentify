<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PresentationComponent from '@/components/PresentationComponent.vue'
import { loadSlide } from '@/composables/slideStorage'

const route = useRoute()
const router = useRouter()
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

onMounted(async () => {
  if (!id.value) {
    router.push('/')
    return
  }

  isLoading.value = true
  try {
    const loaded = await loadSlide(id.value)
    if (loaded && !Array.isArray(loaded)) {
      presentation.value = loaded
    } else {
      error.value = 'Presentation not found'
      setTimeout(() => router.push('/'), 3000)
    }
  } catch (e) {
    error.value = 'Error loading presentation'
    console.error(e)
  } finally {
    isLoading.value = false
  }
})

function openSpeakerView() {
  window.open(`/present/${id.value}/speaker`, 'speaker-notes', 'width=1000,height=700')
}

function exitPresentation() {
  router.push('/')
}

// Handle keyboard shortcuts
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    // Escape to exit presentation
    if (e.key === 'Escape') {
      exitPresentation()
    }

    // 'S' to open speaker view
    if (e.key === 's' || e.key === 'S') {
      openSpeakerView()
    }
  }

  window.addEventListener('keydown', handleKeydown)

  return () => {
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <div class="presentation-view">
    <div v-if="isLoading" class="loading">Loading presentation...</div>

    <div v-else-if="error" class="error">
      {{ error }}
      <div>Redirecting to dashboard...</div>
    </div>

    <div v-else class="presentation-container">
      <PresentationComponent :markdownContent="presentation.content" :theme="presentation.theme" />

      <div class="controls">
        <button class="control-button" title="Speaker View" @click="openSpeakerView">Notes</button>
        <button class="control-button" title="Exit Presentation" @click="exitPresentation">
          Exit
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.presentation-view {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
}

.loading,
.error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
  gap: 10px;
}

.presentation-container {
  height: 100%;
}

.controls {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  opacity: 0.3;
  transition: opacity 0.3s;
}

.controls:hover {
  opacity: 1;
}

.control-button {
  padding: 8px 12px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
