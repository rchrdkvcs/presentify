<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import PresentationComponent from '@/components/PresentationComponent.vue'

const markdownContent = ref('')
const route = useRoute()

onMounted(async () => {
  try {
    const slug = route.params.slug as string
    const module = await import(`@/slides/${slug}.md?raw`)
    markdownContent.value = module.default
  } catch (error) {
    console.error('Error loading markdown:', error)
  }
})
</script>

<template>
  <PresentationComponent :markdown-content="markdownContent" />
</template>
