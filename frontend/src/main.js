/* 
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

*/

// Import Vue's createApp function
import { createApp } from 'vue'
// Import root App component
import App from './App.vue'
// Import router configuration
import router from './router'

// Create the Vue application
const app = createApp(App)
// Add router to the application
app.use(router)
// Mount the app to the DOM element with id 'app'
app.mount('#app')

