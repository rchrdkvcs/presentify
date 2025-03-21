<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

interface UserSettings {
  defaultTheme: string
  transition: string
  autoSave: boolean
  autoCenterContent: boolean
  showLineNumbers: boolean
  fontSize: number
  slidesPerPage: number
  markdownShortcuts: boolean
  enableSpellcheck: boolean
}

interface ThemeOption {
  id: string
  name: string
}

interface TransitionOption {
  id: string
  name: string
}

// Theme options
const themes: ThemeOption[] = [
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

// Transition options
const transitions: TransitionOption[] = [
  { id: 'none', name: 'None' },
  { id: 'fade', name: 'Fade' },
  { id: 'slide', name: 'Slide' },
  { id: 'convex', name: 'Convex' },
  { id: 'concave', name: 'Concave' },
  { id: 'zoom', name: 'Zoom' },
]

const router = useRouter()
const settings = ref<UserSettings>({
  defaultTheme: 'white',
  transition: 'slide',
  autoSave: true,
  autoCenterContent: true,
  showLineNumbers: true,
  fontSize: 14,
  slidesPerPage: 1,
  markdownShortcuts: true,
  enableSpellcheck: true,
})

const isSaving = ref(false)
const showSuccessMessage = ref(false)

onMounted(() => {
  loadSettings()
})

function loadSettings() {
  const storedSettings = localStorage.getItem('slides-user-settings')

  if (storedSettings) {
    try {
      settings.value = JSON.parse(storedSettings)
    } catch (e) {
      console.error('Error parsing settings:', e)
      // Continue with default settings
    }
  }
}

async function saveSettings() {
  isSaving.value = true

  try {
    localStorage.setItem('slides-user-settings', JSON.stringify(settings.value))

    // Simulate API call for account-related settings
    await new Promise((resolve) => setTimeout(resolve, 500))

    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  } catch (e) {
    console.error('Error saving settings:', e)
    alert('Failed to save settings. Please try again.')
  } finally {
    isSaving.value = false
  }
}

function resetToDefaults() {
  if (confirm('Are you sure you want to reset all settings to default values?')) {
    settings.value = {
      defaultTheme: 'white',
      transition: 'slide',
      autoSave: true,
      autoCenterContent: true,
      showLineNumbers: true,
      fontSize: 14,
      slidesPerPage: 1,
      markdownShortcuts: true,
      enableSpellcheck: true,
    }
    saveSettings()
  }
}

function exportSettings() {
  const dataStr = JSON.stringify(settings.value, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

  const exportFileDefaultName = 'slides-settings.json'

  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}

function importSettings(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  const reader = new FileReader()

  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      const importedSettings = JSON.parse(content)

      // Validate imported settings
      const requiredKeys = ['defaultTheme', 'transition', 'autoSave']
      const hasRequiredKeys = requiredKeys.every((key) => key in importedSettings)

      if (!hasRequiredKeys) {
        throw new Error('Invalid settings file format')
      }

      settings.value = {
        ...settings.value, // Keep defaults for any missing properties
        ...importedSettings, // Override with imported values
      }

      saveSettings()
      alert('Settings imported successfully')
    } catch (e) {
      console.error('Error importing settings:', e)
      alert('Failed to import settings. File format may be invalid.')
    }

    // Reset the input to allow reimporting the same file
    input.value = ''
  }

  reader.readAsText(file)
}
</script>

<template>
  <div class="settings-container">
    <h1>Settings</h1>

    <div v-if="showSuccessMessage" class="success-message">Settings saved successfully</div>

    <div class="settings-form">
      <section class="settings-section">
        <h2>Presentation Defaults</h2>

        <div class="form-group">
          <label for="defaultTheme">Default Theme</label>
          <select id="defaultTheme" v-model="settings.defaultTheme" class="form-control">
            <option v-for="theme in themes" :key="theme.id" :value="theme.id">
              {{ theme.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="transition">Default Transition</label>
          <select id="transition" v-model="settings.transition" class="form-control">
            <option v-for="transition in transitions" :key="transition.id" :value="transition.id">
              {{ transition.name }}
            </option>
          </select>
        </div>

        <div class="form-group checkbox">
          <input id="autoCenterContent" v-model="settings.autoCenterContent" type="checkbox" />
          <label for="autoCenterContent">Auto-center slide content</label>
        </div>
      </section>

      <section class="settings-section">
        <h2>Editor Preferences</h2>

        <div class="form-group">
          <label for="fontSize">Font Size</label>
          <div class="range-with-value">
            <input
              id="fontSize"
              v-model.number="settings.fontSize"
              class="range-input"
              max="24"
              min="10"
              step="1"
              type="range"
            />
            <span class="range-value">{{ settings.fontSize }}px</span>
          </div>
        </div>

        <div class="form-group checkbox">
          <input id="showLineNumbers" v-model="settings.showLineNumbers" type="checkbox" />
          <label for="showLineNumbers">Show line numbers</label>
        </div>

        <div class="form-group checkbox">
          <input id="markdownShortcuts" v-model="settings.markdownShortcuts" type="checkbox" />
          <label for="markdownShortcuts">Enable markdown shortcuts</label>
        </div>

        <div class="form-group checkbox">
          <input id="enableSpellcheck" v-model="settings.enableSpellcheck" type="checkbox" />
          <label for="enableSpellcheck">Enable spellcheck</label>
        </div>
      </section>

      <section class="settings-section">
        <h2>General Settings</h2>

        <div class="form-group checkbox">
          <input id="autoSave" v-model="settings.autoSave" type="checkbox" />
          <label for="autoSave">Auto-save presentations</label>
        </div>

        <div class="form-group">
          <label for="slidesPerPage">Slides per page in dashboard</label>
          <select id="slidesPerPage" v-model.number="settings.slidesPerPage" class="form-control">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="6">6</option>
            <option value="8">8</option>
            <option value="12">12</option>
          </select>
        </div>
      </section>

      <section class="settings-section">
        <h2>Import/Export</h2>

        <div class="import-export-buttons">
          <button class="btn-secondary" @click="exportSettings">Export Settings</button>

          <label class="btn-secondary import-btn">
            Import Settings
            <input accept=".json" class="hidden-input" type="file" @change="importSettings" />
          </label>
        </div>
      </section>
    </div>

    <div class="form-actions">
      <button class="btn-danger" @click="resetToDefaults">Reset to Defaults</button>

      <button :disabled="isSaving" class="btn-primary" @click="saveSettings">
        {{ isSaving ? 'Saving...' : 'Save Settings' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;
}

h1 {
  margin-bottom: 30px;
  font-weight: 600;
}

h2 {
  font-size: 1.4rem;
  font-weight: 500;
  margin-bottom: 20px;
  color: #333;
}

.settings-section {
  margin-bottom: 40px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.checkbox {
  display: flex;
  align-items: center;
}

.checkbox label {
  margin-bottom: 0;
  margin-left: 10px;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.range-with-value {
  display: flex;
  align-items: center;
}

.range-input {
  flex: 1;
}

.range-value {
  margin-left: 15px;
  min-width: 50px;
  text-align: right;
  font-family: monospace;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn-primary,
.btn-danger,
.btn-secondary {
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition:
    background-color 0.2s,
    opacity 0.2s;
}

.btn-primary {
  background-color: #4a8bfc;
  color: white;
}

.btn-primary:hover {
  background-color: #3a7bf0;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-danger {
  background-color: #f44336;
  color: white;
}

.btn-danger:hover {
  background-color: #e53935;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background-color: #e8e8e8;
}

.import-export-buttons {
  display: flex;
  gap: 15px;
}

.import-btn {
  position: relative;
  display: inline-block;
  text-align: center;
}

.hidden-input {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.success-message {
  background-color: #dff0d8;
  color: #3c763d;
  padding: 10px 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  animation: fade-out 3s forwards;
}

@keyframes fade-out {
  0%,
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
