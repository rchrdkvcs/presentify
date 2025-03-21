<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { deleteSlide, loadSlide } from '@/composables/slideStorage'

interface Presentation {
  id: string
  title: string
  lastEdited: Date
}

const router = useRouter()
const presentations = ref<Presentation[]>([])
const isLoading = ref(true)

onMounted(async () => {
  await fetchPresentations()
})

async function fetchPresentations() {
  isLoading.value = true
  try {
    const data = (await loadSlide()) as Presentation[]
    presentations.value = data.sort(
      (a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime(),
    )
  } catch (error) {
    console.error('Failed to load presentations:', error)
  } finally {
    isLoading.value = false
  }
}

function createNewPresentation() {
  router.push('/editor')
}

function editPresentation(id: string) {
  router.push(`/editor/${id}`)
}

function viewPresentation(id: string) {
  router.push(`/present/${id}`)
}

async function removePresentation(id: string) {
  if (confirm('Are you sure you want to delete this presentation?')) {
    await deleteSlide(id)
    await fetchPresentations()
  }
}

function formatDate(date: Date) {
  return new Date(date).toLocaleString()
}
</script>

<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>My Presentations</h1>
      <button class="create-btn" @click="createNewPresentation">Create New Presentation</button>
    </header>

    <div v-if="isLoading" class="loading">Loading presentations...</div>

    <div v-else-if="presentations.length === 0" class="empty-state">
      <div class="empty-content">
        <h3>No presentations yet</h3>
        <p>Create your first presentation to get started</p>
        <button class="create-btn" @click="createNewPresentation">Create New Presentation</button>
      </div>
    </div>

    <div v-else class="presentations-grid">
      <div v-for="presentation in presentations" :key="presentation.id" class="presentation-card">
        <h3 class="card-title">{{ presentation.title || 'Untitled Presentation' }}</h3>
        <div class="card-meta">Last edited: {{ formatDate(presentation.lastEdited) }}</div>
        <div class="card-actions">
          <button title="Edit" @click="editPresentation(presentation.id)">Edit</button>
          <button title="Present" @click="viewPresentation(presentation.id)">Present</button>
          <button class="delete-btn" title="Delete" @click="removePresentation(presentation.id)">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.create-btn {
  padding: 10px 20px;
  background-color: #4a8bfc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.presentations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.presentation-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.presentation-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.card-title {
  margin-top: 0;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-meta {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.card-actions button {
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #f8f8f8;
  cursor: pointer;
  transition: background-color 0.2s;
}

.card-actions button:hover {
  background-color: #eee;
}

.delete-btn {
  margin-left: auto;
  color: #ff4d4f;
}

.loading,
.empty-state {
  text-align: center;
  padding: 50px;
  color: #666;
}

.empty-content {
  background-color: #f9f9f9;
  padding: 40px;
  border-radius: 8px;
}
</style>
