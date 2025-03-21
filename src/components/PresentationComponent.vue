<script lang="ts" setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import Reveal from 'reveal.js'
import RevealMarkdown from 'reveal.js/plugin/markdown/markdown.esm'
import RevealHighlight from 'reveal.js/plugin/highlight/highlight.esm'
import RevealNotes from 'reveal.js/plugin/notes/notes.esm'

type RevealInstance = InstanceType<typeof Reveal>

const props = defineProps<{
  markdownContent: string
}>()

const revealDiv = ref<HTMLElement | null>(null)
const deck = ref<RevealInstance | null>(null)

watch(
  () => props.markdownContent,
  async () => {
    if (props.markdownContent) {
      await nextTick()
      initializeReveal()
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (props.markdownContent) {
    initializeReveal()
  }
})

function initializeReveal(): void {
  if (deck.value) {
    try {
      deck.value.destroy()
    } catch (e) {
      console.error('Error destroying deck:', e)
    }
    deck.value = null
  }

  if (revealDiv.value) {
    const slidesDiv = revealDiv.value.querySelector('.slides')
    if (slidesDiv) {
      slidesDiv.innerHTML = `
        <section data-markdown>
          <script type="text/template">${props.markdownContent}<\/script>
        </section>
      `
    }
  }

  nextTick(() => {
    deck.value = new Reveal({
      plugins: [RevealMarkdown, RevealHighlight, RevealNotes],
    })

    if (deck.value) {
      deck.value.initialize({
        controls: true,
        progress: true,
        center: true,
        hash: true,
        transition: 'slide',
        slideNumber: true,
        showNotes: false,
        markdown: {
          separator: '^\r?\n---\r?\n$',
          verticalSeparator: '^\r?\n--\r?\n$',
          notesSeparator: '^Note:',
          smartypants: true,
        },
      })
    }
  })
}
</script>

<template>
  <div class="presentation-container">
    <div ref="revealDiv" class="reveal">
      <div class="slides"></div>
    </div>
  </div>
</template>

<style scoped>
.presentation-container {
  width: 100%;
  height: 100vh;
}

.reveal {
  height: 100%;
  width: 100%;
}
</style>
