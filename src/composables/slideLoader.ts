export interface SlideModule {
  path: string
  name: string
  title: string
  component: () => Promise<any>
}

export async function loadSlides(): Promise<SlideModule[]> {
  const slideModules: SlideModule[] = []

  const modules = import.meta.glob('../slides/*.md', { eager: false })

  for (const path in modules) {
    const fileName = path.split('/').pop() || ''
    const slug = fileName.replace('.md', '')

    const title = slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    slideModules.push({
      path: `/${slug}`,
      name: slug,
      title,
      component: () => import(`../views/SlideView.vue`),
    })
  }

  return slideModules
}
