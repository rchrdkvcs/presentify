// src/composables/useSlideManagement.ts
import { ref } from 'vue'
import { loadSlide, saveSlide } from '@/services/slideStorage'

export function useSlideManagement() {
  const currentSlide = ref({
    id: '',
    title: '',
    content: '',
    theme: 'default',
    lastEdited: null as Date | null,
  })

  const presentations = ref<Array<{ id: string; title: string; lastEdited: Date }>>([])

  const saveCurrentSlide = async () => {
    if (!currentSlide.value.title) {
      currentSlide.value.title = 'Untitled Presentation'
    }
    currentSlide.value.lastEdited = new Date()
    await saveSlide(currentSlide.value)
    loadPresentations()
  }

  const loadPresentation = async (id: string) => {
    const loaded = await loadSlide(id)
    if (loaded) {
      currentSlide.value = loaded
    }
  }

  const loadPresentations = async () => {
    presentations.value = await loadSlide() // Load all presentations metadata
  }

  const createNewPresentation = () => {
    currentSlide.value = {
      id: crypto.randomUUID(),
      title: '',
      content: '# New Presentation\n\n---\n\n## First Slide',
      theme: 'default',
      lastEdited: null,
    }
  }

  return {
    currentSlide,
    presentations,
    saveCurrentSlide,
    loadPresentation,
    loadPresentations,
    createNewPresentation,
  }
}
