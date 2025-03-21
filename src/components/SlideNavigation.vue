<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { setupSlideRoutes } from '@/router'
import type { SlideModule } from '@/composables/slideLoader'

const slides = ref<SlideModule[]>([])

onMounted(async () => {
  slides.value = await setupSlideRoutes()
})
</script>

<template>
  <div class="slide-navigation">
    <h2>Available Presentations</h2>
    <ul>
      <li v-for="slide in slides" :key="slide.path">
        <router-link :to="slide.path">{{ slide.title }}</router-link>
      </li>
    </ul>
  </div>
</template>
