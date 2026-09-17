import { createApp } from 'vue'
import App from './App.vue'
import Story from './Story.vue'
import '../../styles/tailwind.css'

const app = createApp(App)
app.component('Story', Story)
app.mount('#app')
