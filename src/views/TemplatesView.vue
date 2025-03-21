<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { saveSlide } from '@/composables/slideStorage'

const router = useRouter()

interface Template {
  id: string
  title: string
  description: string
  preview: string
  content: string
  theme: string
}

const templates = ref<Template[]>([
  {
    id: 'basic',
    title: 'Basic Presentation',
    description: 'A simple, clean presentation template to get you started.',
    preview: '/templates/basic.png',
    content: `# Basic Presentation
## Your Name

---

## Slide 1
- First point
- Second point
- Third point

---

## Slide 2
> A great quote goes here

---

## Thank You
Contact: your.email@example.com`,
    theme: 'white',
  },
  {
    id: 'business',
    title: 'Business Proposal',
    description: 'Perfect for pitching your business ideas.',
    preview: '/templates/business.png',
    content: `# Business Proposal
## Company Name

---

## The Problem
- What problem are you solving?
- Who has this problem?
- Why is it important?

---

## Our Solution
1. How we solve it
2. Our unique approach
3. Value proposition

---

## Market Analysis
- Market size: $X billion
- Growth rate: X% annually
- Target customers: [Description]

---

## Business Model
- How we make money
- Pricing strategy
- Customer acquisition

---

## The Team
- [Name], [Role]
- [Name], [Role]
- [Name], [Role]

---

## Next Steps
- Milestones
- Funding needs
- Timeline

---

## Thank You
Contact: email@company.com`,
    theme: 'black',
  },
  {
    id: 'academic',
    title: 'Academic Presentation',
    description: 'Designed for research presentations and lectures.',
    preview: '/templates/academic.png',
    content: `# Research Presentation
## Author Name
### Institution

---

## Introduction
- Background
- Research question
- Significance of the study

---

## Literature Review
- Previous studies
- Theoretical framework
- Research gap

---

## Methodology
- Research design
- Data collection
- Analysis techniques

---

## Results
- Finding 1
- Finding 2
- Finding 3

Note: Remember to explain statistical significance

---

## Discussion
- Interpretation of results
- Comparison with previous studies
- Limitations

---

## Conclusion
- Summary of findings
- Implications
- Future research

---

## References
1. Author, A. (Year). Title. Journal.
2. Author, B. (Year). Title. Journal.

---

## Questions?
Thank you for your attention`,
    theme: 'serif',
  },
])

async function useTemplate(template: Template) {
  const newPresentation = {
    id: crypto.randomUUID(),
    title: `${template.title} Copy`,
    content: template.content,
    theme: template.theme,
    lastEdited: null as Date | null,
  }

  await saveSlide(newPresentation)
  router.push(`/editor/${newPresentation.id}`)
}

function previewTemplate(template: Template) {
  // Just show a preview - could be a modal or a detail view
  console.log('Preview template:', template.title)
}
</script>

<template>
  <div class="templates-view">
    <header class="templates-header">
      <h1>Presentation Templates</h1>
      <p>Choose a template to get started quickly with your presentation</p>
    </header>

    <div class="templates-grid">
      <div v-for="template in templates" :key="template.id" class="template-card">
        <div class="template-preview" @click="previewTemplate(template)">
          <img
            :alt="template.title"
            :src="template.preview"
            onerror="this.src='/templates/placeholder.png'"
          />
        </div>
        <div class="template-info">
          <h3>{{ template.title }}</h3>
          <p>{{ template.description }}</p>
        </div>
        <div class="template-actions">
          <button class="use-btn" @click="useTemplate(template)">Use Template</button>
          <button class="preview-btn" @click="previewTemplate(template)">Preview</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.templates-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.templates-header {
  text-align: center;
  margin-bottom: 40px;
}

.templates-header h1 {
  margin-bottom: 10px;
}

.templates-header p {
  color: #666;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.template-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.template-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.template-preview {
  height: 200px;
  overflow: hidden;
  cursor: pointer;
}

.template-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.template-preview:hover img {
  transform: scale(1.05);
}

.template-info {
  padding: 15px;
}

.template-info h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.template-info p {
  color: #666;
  margin: 0;
}

.template-actions {
  display: flex;
  padding: 15px;
  border-top: 1px solid #eee;
  gap: 10px;
}

.use-btn {
  flex: 1;
  padding: 8px;
  background-color: #4a8bfc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.preview-btn {
  padding: 8px 15px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}
</style>
