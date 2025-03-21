const STORAGE_KEY = 'slides-app-presentations'

interface Slide {
  id: string
  title: string
  content: string
  theme: string
  lastEdited: Date | null
}

export async function saveSlide(slide: Slide): Promise<void> {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  existing[slide.id] = {
    ...slide,
    lastEdited: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
}

export async function loadSlide(id?: string): Promise<Slide | Slide[]> {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')

  if (id) {
    return stored[id] || null
  }

  // Return all presentations (for listing)
  return Object.values(stored).map((slide: any) => ({
    id: slide.id,
    title: slide.title,
    lastEdited: new Date(slide.lastEdited),
  }))
}

export async function deleteSlide(id: string): Promise<void> {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  if (existing[id]) {
    delete existing[id]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
  }
}
