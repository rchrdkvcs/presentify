<script lang="ts" setup>
import { RouterView } from 'vue-router'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/white.css'
</script>

<template>
  <main class="main-container">
    <RouterView />
  </main>
</template>

<style lang="css">
.main-container {
  height: 100vh;
  width: 100vw;
}
</style>
