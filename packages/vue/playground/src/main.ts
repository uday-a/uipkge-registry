import { createApp, type Component } from 'vue'
import App from './App.vue'
import Story from './Story.vue'
import './playground.css'

const app = createApp(App)
app.component('Story', Story)

// Replicate Nuxt auto-import for registry UI primitives used across demos
const uiComponents = import.meta.glob('../../components/*/*.vue', { eager: true })
for (const [path, mod] of Object.entries(uiComponents)) {
  const match = path.match(/\/([A-Z][A-Za-z0-9]+)\.vue$/)
  if (match && (mod as any).default) {
    const compName = match[1]
    app.component(compName, (mod as any).default as Component)
  }
}

app.mount('#app')
