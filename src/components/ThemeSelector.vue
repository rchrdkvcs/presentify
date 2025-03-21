<!-- src/components/ThemeSelector.vue -->
<script lang="ts" setup>

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const themes = [
  { id: 'default', name: 'Default' },
  { id: 'black', name: 'Black' },
  { id: 'white', name: 'White' },
  { id: 'league', name: 'League' },
  { id: 'beige', name: 'Beige' },
  { id: 'sky', name: 'Sky' },
  { id: 'night', name: 'Night' },
  { id: 'serif', name: 'Serif' },
  { id: 'simple', name: 'Simple' },
  { id: 'solarized', name: 'Solarized' },
]

const updateTheme = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="theme-selector">
    <select :value="modelValue" @input="updateTheme(($event.target as HTMLSelectElement).value)">
      <option v-for="theme in themes" :key="theme.id" :value="theme.id">
        {{ theme.name }}
      </option>
    </select>
  </div>
</template>
