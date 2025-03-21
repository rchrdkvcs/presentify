<script lang="ts" setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import Reveal from 'reveal.js'
import RevealMarkdown from 'reveal.js/plugin/markdown/markdown.esm'
import RevealHighlight from 'reveal.js/plugin/highlight/highlight.esm'
import RevealNotes from 'reveal.js/plugin/notes/notes.esm'
import RevealMath from 'reveal.js/plugin/math/math.esm'
import RevealZoom from 'reveal.js/plugin/zoom/zoom.esm'

// Commented out plugins that might not be available yet
// import RevealMermaid from 'reveal.js-mermaid-plugin'
// import RevealAdmonition from '@/plugins/reveal-admonition'

type RevealInstance = InstanceType<typeof Reveal>

const props = defineProps<{
  markdownContent: string
  theme?: string
}>()

const revealDiv = ref<HTMLElement | null>(null)
const deck = ref<RevealInstance | null>(null)

watch(
  [() => props.markdownContent, () => props.theme],
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

    // Apply theme
    const themeLink = document.getElementById('reveal-theme') as HTMLLinkElement
    if (themeLink) {
      themeLink.href = `theme/${props.theme || 'default'}.css`
    }
  }

  nextTick(() => {
    deck.value = new Reveal({
      plugins: [
        RevealMarkdown,
        RevealHighlight,
        RevealNotes,
        RevealMath,
        RevealZoom,
        // RevealMermaid,
        // RevealAdmonition
      ],
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
        // For mermaid integration
        // mermaid: {
        //   theme: 'default'
        // }
      })
    }
  })
}
</script>

<template>
  <div class="presentation-container">
    <div ref="revealDiv" class="reveal">
      <div class="slides">
        <!-- Content will be injected here by the script -->
      </div>
    </div>
  </div>
</template>

<style>
.presentation-container {
  height: 100%;
  width: 100%;
}

.reveal {
  height: 100%;
  width: 100%;
}
</style>
